import React from 'react';
import {
  ShieldAlert,
  Target,
  Compass,
  Zap,
  Layers,
  Cpu,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Award,
  ShieldCheck,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Title & Problem Statement ID Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-3">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Citizen Road Safety Mission • PS ID: R1-03</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          SafeRoute AI
        </h1>
        <p className="text-lg sm:text-2xl font-bold text-emerald-700 mt-2">
          Know the Risk Before You Reach It
        </p>
        <p className="text-slate-600 text-xs sm:text-base mt-3 leading-relaxed">
          Transforming highway travel from reactive navigation into proactive risk intelligence to achieve Vision Zero preventable road accidents.
        </p>
      </div>

      {/* Core Mission Quote */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center shadow-xs">
        <p className="text-base sm:text-xl font-medium text-slate-800 italic font-heading">
          “Navigation tells you where to go. <span className="text-emerald-700 font-bold not-italic">SafeRoute AI tells you what risks you may face on the way.</span>”
        </p>
      </div>

      {/* Problem Statement Details */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-rose-700 font-bold text-base">
          <AlertTriangle className="w-5 h-5" />
          <span>The Problem Statement: PS ID: R1-03 — Preventable Road Accidents</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Over 150,000 lives are lost annually on Indian roads—many due to entirely preventable hazards. Drivers routinely embark on unfamiliar journeys without actionable foresight regarding accident-prone junctions, flash waterlogging, unmarked construction diversions, slippery hydroplaning sectors, or emergency trauma accessibility.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Conventional GPS mapping apps optimize almost exclusively for <em>speed</em> and <em>shortest travel time</em>, often directing unsuspecting travelers through hazardous, high-casualty corridors. SafeRoute AI solves this fragmentation by uniting historical police crash data, real-time meteorological radar, highway sensor logs, and emergency response radius into a single predictive safety score.
        </p>
      </div>

      {/* 5-Pillar Architectural Risk Fusion Engine */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
          Multi-Source Risk Fusion Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                1
              </div>
              <span>Historical Accident Blackspot Mapping</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clusters multi-year police FIR records, fatal collision locations, blind merges, and geometric road defects to calculate localized crash probabilities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                2
              </div>
              <span>Dynamic Weather & Pavement Hydrodynamics</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates live Doppler precipitation, standing water depth, aquaplaning potential, and brake friction degradation in real time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                3
              </div>
              <span>Time-Aware Risk Modeling</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes diurnal variations in freight truck volumes, dusk visibility glare, fog density, and recommends optimal departure windows.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                4
              </div>
              <span>Trauma Response & Safe Stoppage Radius</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps Golden Hour medical accessibility, highway police checkpoints, well-lit fuel stations, and dedicated rest areas for women and families.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
