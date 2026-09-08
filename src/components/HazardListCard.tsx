import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Navigation,
  Shield,
  Filter,
  CheckCircle2,
  Car,
  ChevronRight,
  MapPin,
  Waves,
  Hammer,
} from 'lucide-react';
import { RoadHazard, RiskLevel } from '../types';

interface HazardListCardProps {
  hazards: RoadHazard[];
  onSelectHazard?: (hazard: RoadHazard) => void;
}

export const HazardListCard: React.FC<HazardListCardProps> = ({
  hazards,
  onSelectHazard,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredHazards = filterType === 'all'
    ? hazards
    : hazards.filter(h => h.type === filterType);

  const getSeverityBadge = (sev: RiskLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'MODERATE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'LOW':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-5 sm:p-7">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Citizen Hazard Log
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Active Road Obstacles & En-Route Hazards
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {filteredHazards.length} verified hazards ahead
        </span>
      </div>

      {/* Hazards List */}
      <div className="space-y-3">
        {filteredHazards.map((hz) => {
          const badge = getSeverityBadge(hz.severity);

          return (
            <div
              key={hz.id}
              className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 hover:bg-slate-100/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-amber-600 shadow-2xs shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{hz.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${badge}`}>
                      {hz.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      ({hz.distanceAheadKm} km ahead)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                    {hz.impactOnRoute}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1 rounded-xl">
                    <strong className="text-emerald-800 shrink-0">Action:</strong>
                    <span>{hz.suggestedAction}</span>
                  </div>
                </div>
              </div>

              {onSelectHazard && (
                <div className="sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectHazard(hz)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View on Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
