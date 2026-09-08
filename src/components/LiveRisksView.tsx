import React, { useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Car,
  Filter,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  MapPin,
  Camera,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { RoadHazard, RiskLevel } from '../types';
import { RiskMap } from './RiskMap';
import { RouteOption, RouteSegment, AccidentHotspot, EmergencyFacility } from '../types';

interface LiveRisksViewProps {
  hazards: RoadHazard[];
  onAddHazard: (hazard: RoadHazard) => void;
  currentRoute: RouteOption;
  allRoutes: RouteOption[];
  onSelectRoute: (id: string) => void;
  hotspots: AccidentHotspot[];
  emergencyFacilities: EmergencyFacility[];
  selectedSegment: RouteSegment | null;
  onSelectSegment: (seg: RouteSegment | null) => void;
  isDarkMode: boolean;
}

export const LiveRisksView: React.FC<LiveRisksViewProps> = ({
  hazards,
  onAddHazard,
  currentRoute,
  allRoutes,
  onSelectRoute,
  hotspots,
  emergencyFacilities,
  selectedSegment,
  onSelectSegment,
  isDarkMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isReportingOpen, setIsReportingOpen] = useState(false);

  // New report form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<RoadHazard['type']>('potholes');
  const [reportSeverity, setReportSeverity] = useState<RiskLevel>('HIGH');
  const [reportLocation, setReportLocation] = useState('');
  const [reportImpact, setReportImpact] = useState('');
  const [reportAction, setReportAction] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  const filteredHazards = activeCategory === 'all'
    ? hazards
    : hazards.filter(h => {
        if (activeCategory === 'weather') return h.type === 'flooding' || h.type === 'visibility';
        if (activeCategory === 'accidents') return h.type === 'accident';
        if (activeCategory === 'road_condition') return h.type === 'potholes' || h.type === 'construction';
        if (activeCategory === 'environmental') return h.type === 'landslide';
        return true;
      });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;

    const newHz: RoadHazard = {
      id: `user-${Date.now()}`,
      title: reportTitle,
      type: reportType,
      severity: reportSeverity,
      coordinates: [20.92, 78.88], // Default vicinity near Butibori
      distanceAheadKm: 14,
      delayMins: 10,
      impactOnRoute: reportImpact || 'Citizen-verified hazard on active lane.',
      suggestedAction: reportAction || 'Reduce speed and follow signboards.',
      reportedAt: 'Just now by Citizen',
      verifiedCount: 1,
    };

    onAddHazard(newHz);
    setIsReportingOpen(false);
    setReportTitle('');
    setReportLocation('');
    setReportImpact('');
    setReportAction('');
    setHasPhoto(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner & Reporting Trigger */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Citizen Live Network
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Live Highway Threats & Community Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time verified reports submitted by highway travelers and municipal road safety patrols.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReportingOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Road Hazard</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Hazards ({hazards.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('weather')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'weather'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Monsoon & Flooding
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('accidents')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'accidents'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Accident Sites
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('road_condition')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'road_condition'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Potholes & Construction
        </button>
      </div>

      {/* Map Radar Integration */}
      <RiskMap
        currentRoute={currentRoute}
        allRoutes={allRoutes}
        onSelectRoute={onSelectRoute}
        hotspots={hotspots}
        hazards={filteredHazards}
        emergencyFacilities={emergencyFacilities}
        selectedSegment={selectedSegment}
        onSelectSegment={onSelectSegment}
        isDarkMode={isDarkMode}
      />

      {/* Hazards Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHazards.map((hz) => {
          const isCrit = hz.severity === 'CRITICAL';
          const isHigh = hz.severity === 'HIGH';

          return (
            <div
              key={hz.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${
                      isCrit ? 'bg-rose-50 text-rose-600' : isHigh ? 'bg-orange-50 text-orange-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{hz.title}</h4>
                      <span className="text-[11px] text-slate-500">{hz.reportedAt}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isCrit ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {hz.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {hz.impactOnRoute}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-3">
                  <strong className="text-emerald-800 block mb-0.5 font-bold">Suggested Driver Action:</strong>
                  {hz.suggestedAction}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {hz.verifiedCount} Citizen Verifications
                </span>
                <span className="font-semibold text-slate-900">{hz.distanceAheadKm} km ahead</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {isReportingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Report a Road Hazard
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Help fellow citizens stay safe on this corridor
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportingOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Hazard Title / Summary
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Deep pothole cluster on right lane"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Hazard Category
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs"
                  >
                    <option value="potholes">Potholes / Broken Asphalt</option>
                    <option value="flooding">Waterlogging / Flooding</option>
                    <option value="accident">Accident / Road Obstacle</option>
                    <option value="construction">Unmarked Construction</option>
                    <option value="visibility">Severe Fog / Smoke</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Severity Level
                  </label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs"
                  >
                    <option value="LOW">Low (Minor bump)</option>
                    <option value="MODERATE">Moderate (Lane slowdown)</option>
                    <option value="HIGH">High (Severe vehicle damage)</option>
                    <option value="CRITICAL">Critical (Total lane blockage)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Exact Location / Milestone
                </label>
                <input
                  type="text"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  placeholder="e.g. Km 18 near Butibori Flyover"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Impact on Traffic
                </label>
                <input
                  type="text"
                  value={reportImpact}
                  onChange={(e) => setReportImpact(e.target.value)}
                  placeholder="e.g. Vehicles swerving sharply into oncoming traffic"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              {/* Photo Simulator Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer ${
                    hasPhoto ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>{hasPhoto ? 'Photo Attached (road_hazard_gps.jpg)' : 'Attach Hazard Photo (Optional)'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportingOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Submit Citizen Report
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
