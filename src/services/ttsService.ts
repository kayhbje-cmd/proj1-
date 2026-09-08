// SafeRoute AI - Hands-Free Text-to-Speech (TTS) Engine
import { RouteSegment, RoadHazard, TTSWarningSettings } from '../types';

export const DEFAULT_TTS_SETTINGS: TTSWarningSettings = {
  enabled: true,
  autoAnnounce: true,
  chimeEnabled: true,
  speechRate: 1.05,
  volume: 1.0,
  voiceEngine: 'browser',
  voiceName: '',
};

type StateListener = (state: {
  isSpeaking: boolean;
  currentText: string;
  activeSegmentId: string | null;
}) => void;

class TTSService {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private listeners: Set<StateListener> = new Set();
  private settings: TTSWarningSettings = { ...DEFAULT_TTS_SETTINGS };

  private isSpeaking = false;
  private currentText = '';
  private activeSegmentId: string | null = null;

  constructor() {
    // Load persisted settings if any
    try {
      const saved = localStorage.getItem('saferoute_tts_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }

  public getSettings(): TTSWarningSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<TTSWarningSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem('saferoute_tts_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  public subscribe(listener: StateListener) {
    this.listeners.add(listener);
    listener({
      isSpeaking: this.isSpeaking,
      currentText: this.currentText,
      activeSegmentId: this.activeSegmentId,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({
        isSpeaking: this.isSpeaking,
        currentText: this.currentText,
        activeSegmentId: this.activeSegmentId,
      });
    }
  }

  /**
   * Initializes or resumes the AudioContext on user interaction
   */
  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
      return null;
    }
  }

  /**
   * Plays a pleasant 2-tone highway alert chime (aviation/cockpit style)
   */
  public async playAlertChime(): Promise<void> {
    if (!this.settings.chimeEnabled) return;

    return new Promise((resolve) => {
      const ctx = this.getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Tone 1: 587.33 Hz (D5) -> Tone 2: 880 Hz (A5)
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.12);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.18 * this.settings.volume, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.24 * this.settings.volume, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);

        osc.onended = () => resolve();
      } catch (err) {
        console.warn('Could not play alert chime:', err);
        resolve();
      }
    });
  }

  /**
   * Formats spoken warning text for a highway segment
   */
  public formatSegmentWarning(
    segment: RouteSegment,
    isApproaching = false,
    distanceAheadKm?: number
  ): string {
    const isCritical = segment.riskLevel === 'CRITICAL';
    const isHigh = segment.riskLevel === 'HIGH';
    const cleanRoadName = (segment.roadName || 'Highway corridor').replace(/NH-/i, 'National Highway ');
    
    let prefix = 'Caution.';
    if (isCritical) {
      prefix = 'High Priority Highway Warning.';
    } else if (isHigh) {
      prefix = 'Driver Warning.';
    }

    let positionText = `At kilometer ${segment.fromKm} to ${segment.toKm} on ${cleanRoadName}`;
    if (isApproaching && distanceAheadKm !== undefined) {
      positionText = `Approaching high risk zone in ${distanceAheadKm} kilometers at kilometer ${segment.fromKm} to ${segment.toKm}`;
    }

    const reasons = (segment.reasons || []).slice(0, 2).join('. ');
    const advice = segment.recommendedAction || 'Exercise extreme caution and reduce speed.';

    return `${prefix} ${positionText}. Risk rating is ${segment.riskScore} out of 100. Primary hazard: ${reasons}. Safety recommendation: ${advice}`;
  }

  /**
   * Formats spoken warning for a live road hazard
   */
  public formatHazardWarning(hazard: RoadHazard): string {
    const distText = hazard.distanceAheadKm ? `${hazard.distanceAheadKm} kilometers ahead` : 'ahead on your route';
    const action = hazard.suggestedAction || 'Reduce speed and maintain caution.';
    return `Road Alert: ${hazard.title}, ${distText}. ${hazard.impactOnRoute}. Recommended action: ${action}`;
  }

  /**
   * Speaks given text using Gemini TTS if available, or Browser SpeechSynthesis
   */
  public async speak(
    text: string,
    options?: {
      segmentId?: string;
      withChime?: boolean;
      forceBrowserEngine?: boolean;
    }
  ): Promise<void> {
    if (!this.settings.enabled || !text.trim()) return;

    // Stop any ongoing speech
    this.stop();

    this.isSpeaking = true;
    this.currentText = text;
    this.activeSegmentId = options?.segmentId || null;
    this.notify();

    // 1. Play alert chime first if requested
    if (options?.withChime !== false && this.settings.chimeEnabled) {
      await this.playAlertChime();
    }

    // 2. Determine voice engine
    const useGemini = this.settings.voiceEngine === 'gemini_ai' && !options?.forceBrowserEngine;

    if (useGemini) {
      const success = await this.speakWithGeminiAI(text);
      if (success) return;
      // Fallback to browser synthesis if Gemini fails
    }

    await this.speakWithBrowserSynthesis(text);
  }

  /**
   * Speak via Browser Web Speech API
   */
  private speakWithBrowserSynthesis(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis is not supported in this browser.');
        this.isSpeaking = false;
        this.notify();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Clean text for speech
      const cleaned = text
        .replace(/[*_#`~]/g, '')
        .replace(/\bKm\b/gi, 'kilometer')
        .replace(/➔|->/g, 'to')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleaned);
      this.currentUtterance = utterance;

      utterance.rate = Math.max(0.7, Math.min(1.5, this.settings.speechRate));
      utterance.volume = Math.max(0, Math.min(1, this.settings.volume));
      utterance.pitch = 1.0;

      // Select voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let chosenVoice = null;
        if (this.settings.voiceName) {
          chosenVoice = voices.find((v) => v.name === this.settings.voiceName);
        }
        if (!chosenVoice) {
          // Prefer high quality English voice (e.g., Google or Natural)
          chosenVoice =
            voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('India'))) ||
            voices.find((v) => v.lang.startsWith('en')) ||
            voices[0];
        }
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentText = '';
        this.activeSegmentId = null;
        this.currentUtterance = null;
        this.notify();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.isSpeaking = false;
        this.currentText = '';
        this.activeSegmentId = null;
        this.currentUtterance = null;
        this.notify();
        resolve();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Failed to invoke window.speechSynthesis.speak:', err);
        this.isSpeaking = false;
        this.notify();
        resolve();
      }
    });
  }

  /**
   * Speak via backend Gemini AI Audio API
   */
  private async speakWithGeminiAI(text: string): Promise<boolean> {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: this.settings.voiceName || 'Kore',
        }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      if (!data.audioBase64) {
        return false;
      }

      // Decode base64 and play using AudioContext
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      const binaryStr = atob(data.audioBase64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      let audioBuffer: AudioBuffer;
      try {
        audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      } catch {
        // In case raw 24kHz 16-bit PCM little-endian
        const pcm16 = new Int16Array(bytes.buffer);
        audioBuffer = ctx.createBuffer(1, pcm16.length, data.sampleRate || 24000);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < pcm16.length; i++) {
          channelData[i] = pcm16[i] / 32768;
        }
      }

      return new Promise<boolean>((resolve) => {
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        gainNode.gain.value = this.settings.volume;

        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        this.currentAudioSource = source;

        source.onended = () => {
          this.isSpeaking = false;
          this.currentText = '';
          this.activeSegmentId = null;
          this.currentAudioSource = null;
          this.notify();
          resolve(true);
        };

        source.start(0);
      });
    } catch (err) {
      console.warn('Gemini TTS call failed:', err);
      return false;
    }
  }

  /**
   * Stop any current speech playback immediately
   */
  public stop() {
    if (this.currentUtterance) {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }

    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop();
        this.currentAudioSource.disconnect();
      } catch {
        // ignore
      }
      this.currentAudioSource = null;
    }

    this.isSpeaking = false;
    this.currentText = '';
    this.activeSegmentId = null;
    this.notify();
  }

  /**
   * Get available browser speech synthesis voices
   */
  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }
}

export const ttsService = new TTSService();
