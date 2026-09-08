import React from 'react';
import {
  BarChart3,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Building,
  Target,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import { AccidentHotspot, RoadHazard } from '../types';

interface AnalyticsDashboardProps {
  hotspots: AccidentHotspot[];
  hazards: RoadHazard[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  hotspots,
  hazards,
}) => {
  // Key statistical metrics
  const totalAccidentsAnalyzed = hotspots.reduce((acc, h) => acc + h.incidentCount, 0) + 184;
  const highRiskKm = 34.2;
  const projectedCrashReduction = '38.4%';

  const topBlackspots = [
    { name: 'NH-44 Milepost 18 Butibori', crashes: 44, severity: 'High Fatality', cause: 'Blind Merge & Speeding' },
    { name: 'Seloo Bridge Undivided Sector', crashes: 31, severity: 'Severe Multi-Vehicle', cause: 'Aquaplaning / No Divider' },
    { name: 'Hingna MIDC Intersection', crashes: 26, severity: 'Pedestrian / Heavy Freight', cause: 'Unregulated U-Turn' },
    { name: 'Wardha Bypass Flyover Entry', crashes: 19, severity: 'Night Collisions', cause: 'Inadequate Lighting' },
  ];

  const safetyInterventions = [
    { sector: 'Km 15-22 Butibori', action: 'Install solar blinkers, rumble strips & variable speed radar limits', costTier: 'Immediate (<30 days)' },
    { sector: 'Km 24-28 Seloo Bridge', action: 'Construct concrete jersey barrier and continuous stormwater culverts', costTier: 'Capital Works (Q3)' },
    { sector: 'Km 8-12 Hingna Curve', action: 'High-friction pavement overlay (anti-skid epoxy slurry)', costTier: 'Pavement Maintenance' },
    { sector: 'Km 38 Seloo Village', action: 'Pedestrian underpass & street illumination upgrade', costTier: 'Municipal Intervention' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            Citizen & Public Authority Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Highway Safety Audit & Blackspot Analytics
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
            Corridor-level accident clustering and preventive road engineering insights conforming to Problem Statement PS ID: R1-03.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting Corridor Safety CSV report...')}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Historical Crashes Audited</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-heading">
            {totalAccidentsAnalyzed}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Over 24 months across corridor</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Critical Risk Highway</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-heading">
            {highRiskKm} km
          </p>
          <span className="text-[11px] text-amber-700 font-medium">Requires active driver caution</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Projected Crash Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 font-heading">
            {projectedCrashReduction}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Via route bypass & speed guidance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Emergency Response SLA</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-heading">
            9.2 mins
          </p>
          <span className="text-[11px] text-blue-700 font-medium">NHAI 1033 Trauma coverage</span>
        </div>

      </div>

      {/* Top Blackspots Table Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Ranked Highway Blackspot Intersections
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized by fatality index and verified multi-vehicle crashes
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">MoRTH Criteria Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Location Stretch</th>
                <th className="py-2.5 px-3">12-Month Crashes</th>
                <th className="py-2.5 px-3">Severity Class</th>
                <th className="py-2.5 px-3">Primary Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topBlackspots.map((spot, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-bold text-slate-900">{spot.name}</td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600">{spot.crashes} collisions</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      {spot.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{spot.cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Civil Engineering Interventions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <h3 className="font-extrabold text-base text-slate-900 mb-1">
          Targeted Civil Safety Interventions
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Recommended engineering remedies to mitigate avoidable accidents on NH-44
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safetyInterventions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-slate-900">{item.sector}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {item.costTier}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
