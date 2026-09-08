import React, { useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  Car,
  X,
  ChevronRight,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { RoadHazard } from '../types';
import { ttsService } from '../services/ttsService';

interface ActionableAlertsProps {
  hazards: RoadHazard[];
  onSelectHazard?: (hz: RoadHazard) => void;
}

export const ActionableAlerts: React.FC<ActionableAlertsProps> = ({
  hazards,
  onSelectHazard,
}) => {
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Pick top critical alerts
  const criticalHazards = (hazards || [])
    .filter((h) => h?.id && !dismissed.includes(h.id))
    .slice(0, 3);

  if (criticalHazards.length === 0) return null;

  return (
    <div className="space-y-2.5 mb-6">
      {criticalHazards.map((hz) => {
        const isCritical = hz.severity === 'CRITICAL';
        return (
          <div
            key={hz.id}
            id={`alert-banner-${hz.id}`}
            className={`p-3.5 sm:p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-xs transition-all ${
              isCritical
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isCritical ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {isCritical ? 'CRITICAL HIGHWAY ALERT' : 'SAFETY WARNING'}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{hz.title}</span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    ({hz.distanceAheadKm} km ahead)
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {hz.impactOnRoute} • <strong className="text-emerald-800 font-bold">Action:</strong> {hz.suggestedAction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const text = ttsService.formatHazardWarning(hz);
                  ttsService.speak(text, { withChime: true });
                  if (onSelectHazard) onSelectHazard(hz);
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                title="Play audible spoken warning for this hazard"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Listen</span>
              </button>
              {onSelectHazard && (
                <button
                  type="button"
                  onClick={() => onSelectHazard(hz)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-2xs cursor-pointer"
                >
                  Locate
                </button>
              )}
              <button
                type="button"
                onClick={() => setDismissed([...dismissed, hz.id])}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors cursor-pointer"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
