import React, { useState } from 'react';
import {
  ShieldAlert,
  CloudRain,
  AlertTriangle,
  Clock,
  Trees,
  Hospital,
  ChevronDown,
  ChevronUp,
  Info,
  Car,
  Activity,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { RiskLevel, RouteOption } from '../types';

interface RiskScoreCircularProps {
  currentRoute: RouteOption;
  origin: string;
  destination: string;
}

export const RiskScoreCircular: React.FC<RiskScoreCircularProps> = ({
  currentRoute,
  origin,
  destination,
}) => {
  const [showTransparency, setShowTransparency] = useState(false);

  const score = currentRoute.riskScore;

  // Determine label & color scheme
  let level: RiskLevel = 'LOW';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let strokeColor = '#059669'; // Forest Green
  let riskLevelTitle = 'Low Risk Journey';
  let citizenSummary = 'Road conditions are favorable. Normal cautious driving is recommended.';

  if (score > 75) {
    level = 'CRITICAL';
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    strokeColor = '#dc2626'; // Red
    riskLevelTitle = 'Critical Danger Ahead';
    citizenSummary = 'Major accident blackspot & waterlogged corridor detected. We strongly suggest taking the bypass.';
  } else if (score > 55) {
    level = 'HIGH';
    badgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
    strokeColor = '#ea580c'; // Orange
    riskLevelTitle = 'High Caution Required';
    citizenSummary = 'Elevated crash probability due to rain slick pavement and heavy commercial truck traffic.';
  } else if (score > 35) {
    level = 'MODERATE';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    strokeColor = '#d97706'; // Yellow/Amber
    riskLevelTitle = 'Moderate Risk Stretch';
    citizenSummary = 'Passing through urban bottlenecks with mixed pedestrian and two-wheeler traffic.';
  }

  // Calculate dynamic sub-metrics based on the route
  const isSafer = currentRoute.id === 'route-b';
  const isFastest = currentRoute.id === 'route-a';

  const accidentScore = isSafer ? 24 : isFastest ? 78 : 52;
  const weatherScore = isSafer ? 30 : isFastest ? 68 : 45;
  const infraScore = isSafer ? 28 : isFastest ? 72 : 48;
  const emergencyScore = isSafer ? 85 : isFastest ? 55 : 68;

  // SVG Circular Math
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Journey Safety Index
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Route Risk Assessment
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wide ${badgeColor}`}>
          {level} RISK ({score}/100)
        </div>
      </div>

      {/* Main Gauge & Citizen Explainer */}
      <div className="flex flex-col md:flex-row items-center gap-6 py-2">
        
        {/* SVG Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Value Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-slate-900 font-heading leading-none">
              {score}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Risk Score
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              out of 100
            </span>
          </div>
        </div>

        {/* Citizen Explanation Column */}
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {riskLevelTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
              {citizenSummary}
            </p>
          </div>

          {/* Quick Sub-Risk Breakdown Bars */}
          <div className="space-y-2 pt-1">
            
            {/* Accident Blackspots */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Historical Blackspot Density
                </span>
                <span className="font-bold text-slate-900">{accidentScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    accidentScore > 65 ? 'bg-rose-600' : accidentScore > 40 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${accidentScore}%` }}
                />
              </div>
            </div>

            {/* Weather & Road Condition */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                  Monsoon Weather Hazard
                </span>
                <span className="font-bold text-slate-900">{weatherScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    weatherScore > 65 ? 'bg-rose-600' : weatherScore > 40 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${weatherScore}%` }}
                />
              </div>
            </div>

            {/* Emergency Accessibility */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span className="flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-emerald-600" />
                  Trauma & Ambulance Coverage
                </span>
                <span className="font-bold text-slate-900">{emergencyScore}% Accessible</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${emergencyScore}%` }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Citizen Safety Transparency Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowTransparency(!showTransparency)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-emerald-800">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            Why is this score calculated this way? (Citizen Formula Transparency)
          </span>
          {showTransparency ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTransparency && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed animate-fadeIn">
            <p className="font-bold text-slate-800">
              SafeRoute AI Scoring Methodology (Problem Statement R1-03 Specification):
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong className="text-slate-800">Accident History (35%):</strong> Geo-mapped blackspot frequency over past 24 months.</li>
              <li><strong className="text-slate-800">Weather & Friction (25%):</strong> Wet pavement, precipitation rate, and calculated braking distance increase.</li>
              <li><strong className="text-slate-800">Infrastructure & Geometry (25%):</strong> Potholes, unlit intersections, blind curves, and ongoing construction.</li>
              <li><strong className="text-slate-800">Emergency Remoteness (15%):</strong> Distance to nearest Level-1 trauma care hospital and NHAI rescue ambulance.</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};
