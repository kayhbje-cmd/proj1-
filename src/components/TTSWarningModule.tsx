import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  RotateCcw,
  Settings,
  Radio,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Sliders,
  Check,
  X,
  Navigation,
  Gauge,
} from 'lucide-react';
import { RouteOption, RouteSegment, TTSWarningSettings } from '../types';
import { ttsService, DEFAULT_TTS_SETTINGS } from '../services/ttsService';

interface TTSWarningModuleProps {
  currentRoute: RouteOption;
  selectedSegment: RouteSegment | null;
  onSelectSegment: (segment: RouteSegment) => void;
  isDarkMode?: boolean;
}

export const TTSWarningModule: React.FC<TTSWarningModuleProps> = ({
  currentRoute,
  selectedSegment,
  onSelectSegment,
  isDarkMode = false,
}) => {
  const [ttsState, setTtsState] = useState({
    isSpeaking: false,
    currentText: '',
    activeSegmentId: null as string | null,
  });
  const [settings, setSettings] = useState<TTSWarningSettings>(() => ttsService.getSettings());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Simulation state for approaching segments
  const [isDriveSimulating, setIsDriveSimulating] = useState(false);
  const [currentKm, setCurrentKm] = useState(0);
  const [announcedSegmentIds, setAnnouncedSegmentIds] = useState<Set<string>>(new Set());
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to TTS Service state
  useEffect(() => {
    const unsubscribe = ttsService.subscribe((state) => {
      setTtsState(state);
    });

    const loadVoices = () => {
      const v = ttsService.getVoices();
      if (v.length > 0) setAvailableVoices(v);
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      unsubscribe();
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const handleToggleMute = () => {
    const updated = !settings.enabled;
    const newSettings = { ...settings, enabled: updated };
    setSettings(newSettings);
    ttsService.updateSettings(newSettings);
    if (!updated) {
      ttsService.stop();
    }
  };

  const handleUpdateSetting = <K extends keyof TTSWarningSettings>(
    key: K,
    val: TTSWarningSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: val };
    setSettings(newSettings);
    ttsService.updateSettings(newSettings);
  };

  // Trigger spoken warning for a specific segment
  const handleSpeakSegment = (segment: RouteSegment, isApproaching = false) => {
    const text = ttsService.formatSegmentWarning(segment, isApproaching);
    ttsService.speak(text, {
      segmentId: segment.id,
      withChime: settings.chimeEnabled,
    });
    onSelectSegment(segment);
  };

  // Test current voice
  const handleTestVoice = () => {
    ttsService.speak(
      'SafeRoute Audio Co-Pilot online. Audible hazard warnings are active for your route.',
      { withChime: settings.chimeEnabled }
    );
  };

  // Highway drive simulation logic
  const toggleDriveSimulation = () => {
    if (isDriveSimulating) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      setIsDriveSimulating(false);
      ttsService.stop();
    } else {
      setIsDriveSimulating(true);
      setCurrentKm(5);
      setAnnouncedSegmentIds(new Set());

      // Start initial guidance
      ttsService.speak(
        `Starting Hands-Free Audio Guidance for your trip from Nagpur to Wardha. Approaching speed and hazard alerts will be announced automatically.`,
        { withChime: true }
      );
    }
  };

  // Watch currentKm in simulation and check if approaching a high-risk segment
  useEffect(() => {
    if (!isDriveSimulating) return;

    simIntervalRef.current = setInterval(() => {
      setCurrentKm((prevKm) => {
        const nextKm = prevKm + 3;
        const totalKm = currentRoute.distanceKm || 76;

        if (nextKm >= totalKm) {
          if (simIntervalRef.current) clearInterval(simIntervalRef.current);
          setIsDriveSimulating(false);
          ttsService.speak('You have safely arrived at your destination.', { withChime: true });
          return totalKm;
        }

        // Check if approaching any high-risk segment (within 3 km)
        for (const seg of currentRoute.segments) {
          if (
            (seg.riskLevel === 'CRITICAL' || seg.riskLevel === 'HIGH' || seg.riskLevel === 'MODERATE') &&
            !announcedSegmentIds.has(seg.id)
          ) {
            const distanceAhead = seg.fromKm - nextKm;
            // If within 2 km of start or right at the entry
            if (distanceAhead <= 2 && distanceAhead >= -1) {
              setAnnouncedSegmentIds((prev) => new Set(prev).add(seg.id));
              onSelectSegment(seg);
              const warningText = ttsService.formatSegmentWarning(seg, true, Math.max(0, distanceAhead));
              ttsService.speak(warningText, {
                segmentId: seg.id,
                withChime: true,
              });
              break;
            }
          }
        }

        return nextKm;
      });
    }, 3200);

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isDriveSimulating, announcedSegmentIds, currentRoute, onSelectSegment]);

  // Find most critical segment in route
  const highestRiskSegment = currentRoute.segments.reduce((prev, curr) =>
    curr.riskScore > (prev?.riskScore || 0) ? curr : prev,
    currentRoute.segments[0]
  );

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all">
      
      {/* Background Subtle Wave Accents */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              ttsState.isSpeaking
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100 animate-pulse'
                : settings.enabled
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {settings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 font-heading">
                Hands-Free Audible Safety Warnings
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  ttsState.isSpeaking
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 animate-pulse'
                    : settings.enabled
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {ttsState.isSpeaking ? 'Speaking Advisory' : settings.enabled ? 'Audio Alert Armed' : 'Muted'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Spoken warnings before entering high-risk accident hotspots, slick zones & sharp merges
            </p>
          </div>
        </div>

        {/* Quick Top Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              settings.enabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {settings.enabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                Mute
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                Enable Voice
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Audio voice settings"
            title="Configure TTS voice, speed & engine"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Speaking Banner (When Active) */}
      {ttsState.isSpeaking && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-lg border border-emerald-700/50 animate-fadeIn">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms] h-4" />
                <span className="w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:150ms] h-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms] h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Active Spoken Guidance
              </span>
            </div>
            <button
              type="button"
              onClick={() => ttsService.stop()}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition-colors cursor-pointer"
            >
              Silence
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            "{ttsState.currentText}"
          </p>
        </div>
      )}

      {/* Drive Simulation & Approaching Radar Strip */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Card 1: Interactive Drive Mode Simulation */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Hands-Free Drive Simulator
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                Km {currentKm} / {currentRoute.distanceKm}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Simulate in-transit movement along NH-44 to trigger automatic approaching warnings.
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-600 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentKm / currentRoute.distanceKm) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <button
              type="button"
              onClick={toggleDriveSimulation}
              className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isDriveSimulating
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              {isDriveSimulating ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Stop Drive Mode
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  Start Drive Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Highest-Risk Zone Audible Alert */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                Highest Risk Segment
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                {highestRiskSegment?.riskScore || 84}/100
              </span>
            </div>
            <div className="text-xs font-extrabold text-slate-900 font-heading">
              Km {highestRiskSegment?.fromKm} – {highestRiskSegment?.toKm}: {highestRiskSegment?.roadName}
            </div>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
              {highestRiskSegment?.reasons?.[0] || 'Waterlogging and accident blackspot near industrial merge.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSpeakSegment(highestRiskSegment, true)}
            className="w-full mt-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            Play Approaching Warning
          </button>
        </div>

        {/* Card 3: Quick Voice Test & Selected Segment */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {selectedSegment ? 'Selected Segment' : 'Voice Co-Pilot Test'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {settings.voiceEngine === 'gemini_ai' ? 'Gemini AI Voice' : 'Browser Engine'}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900">
              {selectedSegment
                ? `Km ${selectedSegment.fromKm}–${selectedSegment.toKm} (${selectedSegment.riskLevel})`
                : 'Audible Highway Warning Readiness'}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              {selectedSegment
                ? selectedSegment.recommendedAction
                : 'Verify speaker volume and 2-tone cockpit alert chime before traveling.'}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {selectedSegment ? (
              <button
                type="button"
                onClick={() => handleSpeakSegment(selectedSegment)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Speak This Segment
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTestVoice}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Test Voice & Chime
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Voice Configuration Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Sliders className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 font-heading">
                  TTS Warning Settings
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Pre-warning Chime Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Cockpit Alert Chime</div>
                  <div className="text-[11px] text-slate-500">
                    Plays a 2-tone frequency chime before speaking warnings
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.chimeEnabled}
                  onChange={(e) => handleUpdateSetting('chimeEnabled', e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Automatic Announcements Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Auto-Announce Approaching Hazards</div>
                  <div className="text-[11px] text-slate-500">
                    Proactively speaks warnings 2 km before critical zones
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoAnnounce}
                  onChange={(e) => handleUpdateSetting('autoAnnounce', e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Engine Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Voice Engine
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateSetting('voiceEngine', 'browser')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      settings.voiceEngine === 'browser'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Browser Native</div>
                    <div className="text-[10px] text-slate-500">Instant offline synthesis</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateSetting('voiceEngine', 'gemini_ai')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      settings.voiceEngine === 'gemini_ai'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      Gemini Audio
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">Natural automotive speech</div>
                  </button>
                </div>
              </div>

              {/* Voice Choice */}
              {settings.voiceEngine === 'gemini_ai' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gemini AI Voice Persona
                  </label>
                  <select
                    value={settings.voiceName || 'Kore'}
                    onChange={(e) => handleUpdateSetting('voiceName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Kore">Kore (Calm, authoritative protective copilot)</option>
                    <option value="Puck">Puck (Energetic and alert)</option>
                    <option value="Fenrir">Fenrir (Deep, resonant automotive voice)</option>
                    <option value="Zephyr">Zephyr (Warm and smooth)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    System Voice
                  </label>
                  <select
                    value={settings.voiceName}
                    onChange={(e) => handleUpdateSetting('voiceName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="">Default Recommended Voice</option>
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Speech Rate Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Speech Rate</label>
                  <span className="font-mono text-slate-500">{settings.speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={settings.speechRate}
                  onChange={(e) => handleUpdateSetting('speechRate', parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0.8x (Deliberate)</span>
                  <span>1.05x (Standard)</span>
                  <span>1.4x (Brisk)</span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestVoice}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Play Sample
              </button>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
