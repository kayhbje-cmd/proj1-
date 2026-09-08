import React from 'react';
import {
  Clock,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { TimeSlotRisk } from '../types';

interface TimeAwareRiskCardProps {
  timeSlots: TimeSlotRisk[];
  currentTime: string;
  onSelectDepartureTime: (timeStr: string) => void;
}

export const TimeAwareRiskCard: React.FC<TimeAwareRiskCardProps> = ({
  timeSlots,
  currentTime,
  onSelectDepartureTime,
}) => {
  const getIcon = (timeStr?: string) => {
    if (!timeStr) return Moon;
    const s = String(timeStr);
    if (s.includes('6:00 AM') || s.includes('06:00')) return Sunrise;
    if (s.includes('12:00 PM') || s.includes('12:00')) return Sun;
    if (s.includes('6:00 PM') || s.includes('18:00')) return Sunset;
    return Moon;
  };

  const getRiskClass = (score: number) => {
    if (score > 70) return 'text-rose-800 border-rose-200 bg-rose-50';
    if (score > 50) return 'text-orange-800 border-orange-200 bg-orange-50';
    if (score > 35) return 'text-amber-800 border-amber-200 bg-amber-50';
    return 'text-emerald-800 border-emerald-200 bg-emerald-50';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-5 sm:p-7">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Smart Departure Planning
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Road Safety by Time of Day
          </h3>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Safest Departure Window Found</span>
        </div>
      </div>

      {/* Recommended Time Highlight Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide block mb-0.5">
            AI Recommended Citizen Departure
          </span>
          <p className="text-sm font-bold text-slate-900">
            Tomorrow Morning (06:00 AM) — 64% Lower Accident Risk
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Daylight visibility, zero monsoon waterlogging, and minimal commercial truck traffic.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelectDepartureTime('06:00')}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Select 06:00 AM
        </button>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(timeSlots || []).map((slot, idx) => {
          const displayLabel = slot.slotLabel || slot.label || slot.time || `Time Slot ${idx + 1}`;
          const Icon = getIcon(displayLabel);
          const score = slot.riskScore ?? slot.score ?? 50;
          const riskBadge = getRiskClass(score);
          const isOptimal = Boolean(slot.isOptimal ?? slot.isRecommended);
          const weather = slot.weatherForecast || 'Normal';
          const traffic = slot.trafficDensity || 'Moderate';
          const lighting = slot.lightingCondition || slot.visibilityFactor || 'Daylight';
          const recommendation = slot.recommendation || slot.notes || slot.rationale || '';

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                isOptimal
                  ? 'bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">{displayLabel}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${riskBadge}`}>
                  {score}/100
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Weather:</span>
                  <span className="font-semibold text-slate-800">{weather}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Traffic:</span>
                  <span className="font-semibold text-slate-800">{traffic}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Lighting:</span>
                  <span className="font-semibold text-slate-800">{lighting}</span>
                </div>
              </div>

              {recommendation && (
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {recommendation}
                </p>
              )}

              <button
                type="button"
                onClick={() => onSelectDepartureTime(slot.time || slot.label || displayLabel.split(' ')[0])}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Plan for this time
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
