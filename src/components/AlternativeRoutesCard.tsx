import React from 'react';
import {
  GitFork,
  Clock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { RouteOption, RiskLevel } from '../types';

interface AlternativeRoutesCardProps {
  routes: RouteOption[];
  activeRouteId: string;
  onSelectRoute: (routeId: string) => void;
}

export const AlternativeRoutesCard: React.FC<AlternativeRoutesCardProps> = ({
  routes,
  activeRouteId,
  onSelectRoute,
}) => {
  const getBadge = (level: RiskLevel) => {
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
            <GitFork className="w-3.5 h-3.5 text-emerald-700" />
            Route Comparison & Trade-Offs
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Compare Routes by Safety vs. Travel Time
          </h3>
        </div>
        <span className="text-xs text-slate-500">Click any card to select for navigation</span>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route) => {
          const isActive = route.id === activeRouteId;
          const badgeClass = getBadge(route.riskLevel);

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-50/40 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              {/* Highlight badge for recommended */}
              {route.isRecommended && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Safest Choice
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {route.name}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                  <span className="font-semibold">{route.distanceKm} km</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {route.durationStr}
                  </span>
                </div>

                {/* Score badge */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 mb-3 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">Risk Score:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${badgeClass}`}>
                    {route.riskScore} / 100 ({route.riskLevel})
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {route.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-200/80">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active Route</span>
                    </>
                  ) : (
                    <>
                      <span>Select This Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
