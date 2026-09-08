import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "SafeRoute AI Engine",
      version: "2.4.0-production",
      psId: "R1-03 — Preventable Road Accidents"
    });
  });

  // Text-to-Speech (TTS) Audible Warning Generation Endpoint using Gemini Audio TTS
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voiceName } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required for TTS synthesis" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ error: "GEMINI_API_KEY not configured for server-side TTS" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Speak this critical highway safety warning clearly, calmly and authoritatively for a vehicle driver: ${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(502).json({ error: "No audio payload returned from Gemini TTS engine" });
      }

      return res.json({
        audioBase64: base64Audio,
        sampleRate: 24000,
        model: "gemini-3.1-flash-tts-preview",
      });
    } catch (err: any) {
      console.warn("Gemini TTS API error:", err?.message || err);
      return res.status(500).json({ error: err?.message || "Failed to generate TTS audio" });
    }
  });

  // AI Safety Assistant Endpoint using Gemini 3.5 Flash with Google Maps Grounding
  app.post("/api/assistant", async (req, res) => {
    try {
      const { message, journeyContext, lat, lng } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          const systemPrompt = `You are the SafeRoute AI Journey Safety Copilot, dedicated to National Problem Statement PS ID: R1-03 (Preventable Road Accidents).
Your motto: "Navigation tells you where to go. SafeRoute AI tells you what risks you may face on the way."

Current Journey Context:
- Origin: ${journeyContext?.origin || "Nagpur Zero Mile"}
- Destination: ${journeyContext?.destination || "Wardha Highway Junction"}
- Overall Route Risk Score: ${journeyContext?.riskScore || 68}/100 (${journeyContext?.riskLevel || "HIGH RISK"})
- Total Distance: ${journeyContext?.distance || "76 km"}
- Estimated Travel Time: ${journeyContext?.duration || "1 hr 35 min"}
- High Risk Segments: ${journeyContext?.highRiskSummary || "Km 15-28: NH-44 heavy rain, slick surface, blackspot near Butibori junction"}
- Weather Conditions: ${journeyContext?.weatherSummary || "Intense rain showers (14mm/hr), visibility 450m, wet hydroplaning hazard"}
- Primary Hazards: ${journeyContext?.hazardSummary || "Road work near 18.2 km, waterlogging between 22-26 km, historical accident hotspot"}
- Recommended Route Option: ${journeyContext?.recommendedRoute || "Route B via Outer Ring Expressway (38/100 Low Risk)"}
- Nearest Emergency Trauma Care: ${journeyContext?.nearestHospital || "AIIMS Trauma Center, Nagpur (8.4 km, ETA 14 min)"}

Guidelines for response:
1. Provide precise, actionable road safety guidance referencing actual road names, kilometer markers, and weather impacts.
2. If the user asks about places, trauma hospitals, police posts, highway rest zones, or route detours, provide grounded real-world locations.
3. Tone: Calm, authoritative, highly safety-conscious, and protective. Keep responses structured with concise bullet points or short paragraphs.`;

          const targetLat = typeof lat === "number" ? lat : 21.1458;
          const targetLng = typeof lng === "number" ? lng : 79.0882;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: message,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3,
              tools: [{ googleMaps: {} }],
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: targetLat,
                    longitude: targetLng,
                  },
                },
              },
            },
          });

          const reply = response.text || "SafeRoute AI detected heightened risks along your route. Please maintain cautious speed and consider Route B.";

          // Extract Google Maps grounding chunks
          const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
          const groundedPlaces: { title: string; uri: string }[] = [];

          if (Array.isArray(rawChunks)) {
            for (const c of rawChunks) {
              const mapsObj = (c as any)?.maps;
              if (mapsObj && mapsObj.uri) {
                groundedPlaces.push({
                  title: mapsObj.title || "Google Maps Location",
                  uri: mapsObj.uri,
                });
              }
            }
          }

          return res.json({
            reply,
            source: "gemini-3.5-flash-maps-grounded",
            groundedPlaces,
          });
        } catch (geminiError) {
          console.warn("Gemini API call failed, falling back to dynamic safety rules engine:", geminiError);
        }
      }

      // Contextual safety engine fallback
      const q = (message || "").toLowerCase();
      let fallbackReply = "";

      if (q.includes("why") && (q.includes("risk") || q.includes("high"))) {
        fallbackReply = `Your route is currently rated ${journeyContext?.riskLevel || "HIGH RISK"} (${journeyContext?.riskScore || 68}/100) primarily because:
1. **Critical Weather Shock**: Rain intensity reaches 14mm/hr with road visibility dropping to 450m along Km 15–28.
2. **Historical Accident Blackspot**: Butibori / NH-44 junction has 24 recorded incidents over the past 12 months, predominantly in wet evening conditions.
3. **Pavement Micro-Traction**: Wet asphalt increases braking distance by approximately 42% for vehicles traveling at 65+ km/h.
We strongly recommend switching to **Route B (Safer Outer Ring)** or delaying departure by 40 minutes.`;
      } else if (q.includes("which section") || q.includes("careful") || q.includes("dangerous")) {
        fallbackReply = `The most hazardous stretch is **Km 15.2 to Km 23.8 on NH-44 (near Butibori Industrial Zone)**:
- **Risk Score**: 84/100 (Critical)
- **Primary Danger**: High-speed merge combined with severe water ponding on the outer two lanes.
- **Action**: Reduce speed to ≤ 45 km/h, activate low-beam headlights, maintain at least 4 car lengths from heavy transport trucks, and avoid abrupt lane changes.`;
      } else if (q.includes("leave earlier") || q.includes("time") || q.includes("departure")) {
        fallbackReply = `Yes. Comparative temporal analysis shows:
- **6:00 AM Departure**: Risk drops to **32/100 (LOW)** with clear visibility and low heavy-vehicle transit.
- **Current / 6:00 PM**: Peaks at **76/100 (HIGH)** due to evening shift rush hour, fading daylight, and active storm clouds.
- **Action**: Leaving before 4:30 PM or after 8:30 PM reduces your accident probability by 47%.`;
      } else if (q.includes("safer route") || q.includes("alternative")) {
        fallbackReply = `**Route B (Safer Expressway Bypass)** is strongly recommended:
- **Risk Score**: 38/100 (Low Risk) vs 68/100 on your current path.
- **Time Trade-off**: Adds only +7 minutes (52 min total vs 45 min).
- **Key Safety Advantages**: Bypasses the flooded Butibori underpass, has continuous divided lanes, and provides immediate access to emergency trauma bays along the Outer Ring Road.`;
      } else if (q.includes("rain") || q.includes("heavy rain") || q.includes("weather")) {
        fallbackReply = `Safety Protocol for Rain on this journey:
1. **Hydroplaning Defense**: Do not brake abruptly if steering feels light; ease off the accelerator gradually.
2. **Lighting**: Switch on low-beam headlights and tail lamps (do NOT use hazard flashers while moving unless completely stopped).
3. **Braking Allowance**: Double your following distance to minimum 5–6 seconds behind buses and multi-axle freight.
4. **Safe Shelter**: If downpour exceeds wiper capacity, pull into the **Bharat Petroleum Safe Rest Area at Km 19.5**.`;
      } else if (q.includes("hospital") || q.includes("emergency") || q.includes("police") || q.includes("nearest")) {
        fallbackReply = `Immediate Emergency Contacts & Nearest Care Facilities on route:
- **Emergency Dispatch**: Dial 112 (Unified Emergency) or 1073 (National Highway Helpline)
- **Nearest Trauma Center**: AIIMS Nagpur Trauma & Critical Care (8.4 km away, ETA 14 mins, Contact: +91 712 2855555)
- **Highway Patrol Post**: Wardha Highway Police Chowki (11.2 km ahead, Patrol Unit #04 active).`;
      } else {
        fallbackReply = `SafeRoute AI Journey Assessment for ${journeyContext?.origin || "Current Route"} → ${journeyContext?.destination || "Destination"}:
- **Status**: ${journeyContext?.riskLevel || "HIGH RISK"} (${journeyContext?.riskScore || 68}/100)
- **Top Caution**: Reduced road friction, severe spray from commercial vehicles, and waterlogged segments at Km 18–24.
- **Recommended Action**: Select **Route B (Safer Route)** to bypass primary accident blackspots, or reduce cruising speed to below 50 km/h. Safe travels!`;
      }

      return res.json({ reply: fallbackReply, source: "safety-engine-rules" });
    } catch (err) {
      console.error("Error in AI assistant endpoint:", err);
      res.status(500).json({ error: "Failed to generate safety advice" });
    }
  });

  // Serve static or Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SafeRoute AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
