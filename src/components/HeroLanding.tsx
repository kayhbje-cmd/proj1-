import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  CloudRain,
  AlertTriangle,
  Hospital,
  Clock,
  Car,
  Activity,
  CheckCircle2,
  Compass,
  Zap,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  Heart,
  MapPin,
  Share2,
} from 'lucide-react';
import { DEMO_PRESETS } from '../data/mockRoutes';

interface HeroLandingProps {
  onPlanJourney: () => void;
  onExploreDemo: (presetIndex?: number) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onPlanJourney,
  onExploreDemo,
}) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-12 lg:py-14 bg-slate-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* National PS ID & Citizen Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs text-xs text-emerald-800 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Problem Statement PS ID: R1-03</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Preventable Road Accidents</span>
          </div>
        </div>

        {/* Hero Title & Civilian Focus */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading mb-3">
            SafeRoute <span className="text-emerald-700">Citizen</span>
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-4">
            Know the Road Risk Before You Reach It
          </p>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Empowering everyday drivers, commuters, and families with real-time foresight on accident blackspots, heavy monsoon waterlogging, and en-route emergency facilities.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              id="hero-primary-cta"
              onClick={onPlanJourney}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Check My Route Safety</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={() => onExploreDemo(0)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Explore Demo (NH-44 Corridor)</span>
            </button>
          </div>

          {/* Core Citizen Mission Card */}
          <div className="max-w-2xl mx-auto px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium shadow-xs">
            <span className="text-emerald-700 font-bold">Citizen Principle: </span>
            “Conventional navigation tells you where to turn. <strong className="text-slate-900">SafeRoute AI warns you of hazards before they threaten your family.</strong>”
          </div>
        </div>

        {/* Live Citizen Highway Telemetry Preview Box */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 mb-10">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-slate-900 font-bold uppercase tracking-wider">
                Live Highway Advisory: NH-44 Nagpur ➔ Wardha
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              Station: Butibori Milepost 18
            </span>
          </div>

          {/* 3 Real Citizen Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
                <span>Accident Blackspot</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-lg font-extrabold text-slate-900 font-heading">
                44 Crashes / 12M
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Km 18 Butibori: Blind merge zone with heavy industrial freight.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-1">
                <span>Weather Radar</span>
                <CloudRain className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-lg font-extrabold text-slate-900 font-heading">
                +42% Braking Distance
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Km 24 Seloo Bridge: Standing water. Reduce speed to 45 km/h.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
                <span>Safer Bypass Available</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-lg font-extrabold text-slate-900 font-heading">
                50% Lower Risk
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                Route B Bypass adds only 7 mins, avoiding all 4 blackspots.
              </p>
            </div>

          </div>

        </div>

        {/* Quick Demo Commute Presets for Citizens */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Citizen Highway Corridors (Demo Quick Select)
            </h3>
            <span className="text-[11px] text-emerald-700 font-medium">Click to inspect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onExploreDemo(idx)}
                className="p-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left transition-all shadow-2xs hover:border-emerald-500 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-slate-900 font-bold mb-1">
                  <span>{p.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {p.from.split(',')[0]} ➔ {p.to.split(',')[0]}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {p.highlight}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
