import React from 'react';
import {
  ShieldAlert,
  Navigation,
  Activity,
  AlertTriangle,
  PhoneCall,
  BarChart3,
  Sun,
  Moon,
  Info,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Monitor,
  Share2,
  MapPin,
  Heart,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSOS: () => void;
  onOpenShare?: () => void;
  isMobileSimulator?: boolean;
  onToggleMobileSimulator?: () => void;
  hasAnalyzedJourney: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenSOS,
  onOpenShare,
  isMobileSimulator,
  onToggleMobileSimulator,
  hasAnalyzedJourney,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Citizen Brand */}
          <div
            id="navbar-brand"
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-white">
              <ShieldAlert className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-heading">
                  SafeRoute<span className="text-emerald-700"> AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wide">
                  Citizen Safety
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                National Road Safety Initiative • PS ID: R1-03
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-btn-planner"
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Plan Journey
            </button>

            <button
              id="nav-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Safety Radar
              {hasAnalyzedJourney && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            <button
              id="nav-btn-live-risks"
              onClick={() => setActiveTab('live-risks')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'live-risks'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Live Alerts
            </button>

            <button
              id="nav-btn-emergency"
              onClick={() => setActiveTab('emergency')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'emergency'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              Emergency Help
            </button>

            <button
              id="nav-btn-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Civilian Stats
            </button>

            <button
              id="nav-btn-about"
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-slate-100 text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Info className="w-4 h-4" />
              About
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Mobile Frame Simulator Toggle */}
            {onToggleMobileSimulator && (
              <button
                type="button"
                onClick={onToggleMobileSimulator}
                title={isMobileSimulator ? 'Switch to Full Screen View' : 'Switch to Smartphone App View'}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {isMobileSimulator ? (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-slate-600" />
                    <span>Wide View</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mobile App View</span>
                  </>
                )}
              </button>
            )}

            {/* Family Share Trigger */}
            {onOpenShare && (
              <button
                id="navbar-share-btn"
                onClick={onOpenShare}
                title="Share Live Safety Dossier with Family"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Family Share</span>
              </button>
            )}

            {/* Emergency SOS Button */}
            <button
              id="navbar-sos-btn"
              onClick={onOpenSOS}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 112</span>
            </button>

          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation Bar (Top of Screen) */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 no-scrollbar gap-1 text-xs">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeTab === 'planner' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" /> Commute
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Safety Radar
          </button>
          <button
            onClick={() => setActiveTab('live-risks')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeTab === 'live-risks' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Alerts
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeTab === 'emergency' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'text-slate-600'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" /> Help
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> Stats
          </button>
        </div>
      </div>
    </header>
  );
};
