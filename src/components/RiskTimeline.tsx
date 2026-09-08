import React, { useState, useEffect } from 'react';
import {
  Milestone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Navigation,
  MapPin,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  CloudRain,
  Eye,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';
import { RouteSegment, RiskLevel } from '../types';
import { ttsService } from '../services/ttsService';

interface RiskTimelineProps {
  segments: RouteSegment[];
  selectedSegment: RouteSegment | null;
  onSelectSegment: (seg: RouteSegment) => void;
  departureTime: string;
}

export const RiskTimeline: React.FC<RiskTimelineProps> = ({
  segments,
  selectedSegment,
  onSelectSegment,
  departureTime,
}) => {
  const [ttsState, setTtsState] = useState({
    isSpeaking: false,
    activeSegmentId: null as string | null,
  });

  useEffect(() => {
    return ttsService.subscribe((state) => {
      setTtsState({
        isSpeaking: state.isSpeaking,
        activeSegmentId: state.activeSegmentId,
      });
    });
  }, []);

  // Helper to compute simulated ETA based on average speeds
  const computeETA = (fromKm: number) => {
    const [h, m] = departureTime ? departureTime.split(':').map(Number) : [18, 0];
    const totalMinutes = h * 60 + m + Math.round((fromKm / 50) * 60);
    const estH = Math.floor(totalMinutes / 60) % 24;
    const estM = totalMinutes % 60;
    const period = estH >= 12 ? 'PM' : 'AM';
    const displayH = estH % 12 === 0 ? 12 : estH % 12;
    return `${displayH}:${estM.toString().padStart(2, '0')} ${period}`;
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
          border: 'border-rose-300',
          label: 'Critical Risk',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          dot: 'bg-orange-600',
          border: 'border-orange-300',
          label: 'High Caution',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          border: 'border-amber-300',
          label: 'Moderate',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          border: 'border-emerald-300',
          label: 'Safe Flow',
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Milestone Radar
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Kilometer-by-Kilometer Risk Timeline
          </h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {segments.length} highway sections
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-6">
        Click any road segment to highlight its radar zone on the safety map above.
      </p>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {segments.map((seg) => {
          const badge = getRiskBadge(seg.riskLevel);
          const isSelected = selectedSegment?.id === seg.id;
          const eta = computeETA(seg.fromKm);

          return (
            <div
              key={seg.id}
              onClick={() => onSelectSegment(seg)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/50 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              {/* Timeline Indicator Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full border-2 border-white shadow-xs transition-transform ${
                  badge.dot
                } ${isSelected ? 'scale-125 ring-2 ring-emerald-600' : ''}`}
              />

              {/* Card Content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 font-heading">
                    Km {seg.fromKm} – {seg.toKm}
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ETA ~{eta}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${badge.bg}`}>
                    {badge.label} ({seg.riskScore}/100)
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active on Map
                    </span>
                  )}
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-1 mb-2">
                {seg.reasons.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Actionable Citizen Precaution & Audible Warning Trigger */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-800 shrink-0">Advice:</span>
                  <span>{seg.recommendedAction}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const isCurrentSpeaking = ttsState.isSpeaking && ttsState.activeSegmentId === seg.id;
                    if (isCurrentSpeaking) {
                      ttsService.stop();
                    } else {
                      const warningText = ttsService.formatSegmentWarning(seg);
                      ttsService.speak(warningText, { segmentId: seg.id });
                      onSelectSegment(seg);
                    }
                  }}
                  className={`self-start sm:self-center px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    ttsState.isSpeaking && ttsState.activeSegmentId === seg.id
                      ? 'bg-emerald-600 text-white shadow-xs animate-pulse ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                  title="Play hands-free audible voice warning for this stretch"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>
                    {ttsState.isSpeaking && ttsState.activeSegmentId === seg.id
                      ? 'Playing Warning...'
                      : 'Listen Warning'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
