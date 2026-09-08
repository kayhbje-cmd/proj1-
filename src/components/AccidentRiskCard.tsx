import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Shield,
  MapPin,
  BarChart2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { AccidentHotspot, RiskLevel } from '../types';

interface AccidentRiskCardProps {
  hotspots: AccidentHotspot[];
  onFocusHotspot?: (hotspot: AccidentHotspot) => void;
}

export const AccidentRiskCard: React.FC<AccidentRiskCardProps> = ({
  hotspots,
  onFocusHotspot,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<string>(hotspots[0]?.id || '');

  // Hourly crash trend chart data (statistical curve for Indian highways)
  const hourlyCrashTrends = [
    { time: '12 AM', count: 18, severity: 'High' },
    { time: '3 AM', count: 12, severity: 'Mod' },
    { time: '6 AM', count: 7, severity: 'Low' },
    { time: '9 AM', count: 14, severity: 'Mod' },
    { time: '12 PM', count: 11, severity: 'Low' },
    { time: '3 PM', count: 16, severity: 'Mod' },
    { time: '6 PM', count: 38, severity: 'Crit' }, // Peak dusk/rush
    { time: '9 PM', count: 32, severity: 'High' }, // Heavy trucks
  ];

  const maxCount = Math.max(...hourlyCrashTrends.map((t) => t.count));

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
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
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Accident History & Blackspot Hotspots
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Verified High-Risk Collision Clusters
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Police & Highway Authority Records</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hotspots List (Left) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Identified Blackspots on Selected Route
          </span>

          {hotspots.map((spot) => {
            const isSelected = spot.id === selectedHotspot;
            const badge = getRiskColor(spot.riskLevel);

            return (
              <div
                key={spot.id}
                onClick={() => {
                  setSelectedHotspot(spot.id);
                  if (onFocusHotspot) onFocusHotspot(spot);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/40 border-rose-600 shadow-xs ring-1 ring-rose-600'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                    <h4 className="font-bold text-sm text-slate-900">{spot.locationName}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${badge}`}>
                    {spot.incidentCount} Crashes / 12M
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {spot.primaryCause}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Peak: {spot.timePattern}
                  </span>
                  <span className="text-emerald-800 font-bold">
                    Precaution: {spot.recommendedPrecaution}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistical Hourly Crash Distribution Chart (Right) */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Hourly Crash Density (Corridor Benchmark)
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                Peak: 6 PM - 10 PM
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Historical distribution shows a sharp accident spike at dusk due to blinding high-beam glare, interstate heavy cargo trucks, and commuter merging.
            </p>

            {/* Custom Bar Chart using Tailwind */}
            <div className="h-40 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-slate-200">
              {hourlyCrashTrends.map((item, idx) => {
                const heightPercent = (item.count / maxCount) * 100;
                const isPeak = item.severity === 'Crit';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        isPeak
                          ? 'bg-rose-600 shadow-xs'
                          : item.severity === 'High'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                    />
                    <span className="text-[9px] font-semibold text-slate-500">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700">
            <strong className="text-slate-900 block mb-0.5 font-bold">Safe Citizen Guidance:</strong>
            If driving between 6:00 PM and 9:30 PM, reduce speed by 15 km/h, keep a 4-second following buffer, and utilize low-beam headlights in rain.
          </div>
        </div>

      </div>

    </div>
  );
};
