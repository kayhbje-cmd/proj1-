import React from 'react';
import {
  Compass,
  Map,
  AlertTriangle,
  PhoneCall,
  Sparkles,
  Navigation,
  ShieldAlert,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSOS: () => void;
  onOpenAI: () => void;
  unreadAlertsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOS,
  onOpenAI,
  unreadAlertsCount = 3,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. Plan / Home */}
        <button
          id="mobile-nav-plan"
          type="button"
          onClick={() => setActiveTab(activeTab === 'landing' ? 'planner' : 'planner')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'planner' || activeTab === 'landing'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${
            activeTab === 'planner' || activeTab === 'landing' ? 'bg-emerald-50 text-emerald-700' : ''
          }`}>
            <Navigation className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Plan</span>
        </button>

        {/* 2. Safety Map / Dashboard */}
        <button
          id="mobile-nav-dashboard"
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : ''
          }`}>
            <Map className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Radar</span>
        </button>

        {/* 3. Center SOS Emergency Button (Prominent) */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            id="mobile-nav-sos-pill"
            type="button"
            onClick={onOpenSOS}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 border-2 border-white transition-all active:scale-90 cursor-pointer"
            aria-label="Emergency Highway Distress SOS"
          >
            <PhoneCall className="w-5 h-5" />
          </button>
          <span className="text-[9px] font-bold text-rose-600 tracking-wider uppercase mt-0.5">SOS</span>
        </div>

        {/* 4. Live Hazards & Citizen Reports */}
        <button
          id="mobile-nav-hazards"
          type="button"
          onClick={() => setActiveTab('live-risks')}
          className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'live-risks'
              ? 'text-amber-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors relative ${
            activeTab === 'live-risks' ? 'bg-amber-50 text-amber-700' : ''
          }`}>
            <AlertTriangle className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Alerts</span>
        </button>

        {/* 5. Safe Copilot AI */}
        <button
          id="mobile-nav-copilot"
          type="button"
          onClick={onOpenAI}
          className="flex flex-col items-center justify-center w-14 py-1 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <div className="p-1 rounded-xl hover:bg-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight text-indigo-700 font-medium">Copilot</span>
        </button>

      </div>
    </div>
  );
};
