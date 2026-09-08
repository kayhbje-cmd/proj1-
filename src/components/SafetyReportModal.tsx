import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  CloudRain,
  PhoneCall,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { RouteOption, RouteSegment } from '../types';

interface SafetyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: RouteOption;
  origin: string;
  destination: string;
  departureTime: string;
  vehicleType: string;
}

export const SafetyReportModal: React.FC<SafetyReportModalProps> = ({
  isOpen,
  onClose,
  currentRoute,
  origin,
  destination,
  departureTime,
  vehicleType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">
        
        {/* Modal Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                Journey Safety Dossier
              </h3>
              <p className="text-[11px] text-slate-500">
                Official Corridor Assessment • PS ID: R1-03
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-900 printable-area">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b-2 border-slate-900 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                SafeRoute AI • Road Risk Intelligence
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading">
                Pre-Trip Hazard & Safety Advisory
              </h2>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500">
              <div>Issue Date: {new Date().toLocaleDateString()}</div>
              <div>Status: Active Highway Clearance</div>
            </div>
          </div>

          {/* Journey Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Origin</span>
              <strong className="text-slate-900">{(origin || 'Origin').split(',')[0]}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Destination</span>
              <strong className="text-slate-900">{(destination || 'Destination').split(',')[0]}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Vehicle Class</span>
              <strong className="text-slate-900 capitalize">{vehicleType || 'car'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Departure</span>
              <strong className="text-slate-900">{departureTime || '18:00'}</strong>
            </div>
          </div>

          {/* Overall Safety Rating */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Corridor Safety Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-heading">
                  {currentRoute.riskScore}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ 100</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {currentRoute.riskLevel} Risk
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 max-w-sm">
              Primary cautionary advice: Active rainfall reduces friction at Butibori flyover merge. Maintain 50 km/h and turn on dipped headlights.
            </p>
          </div>

          {/* Segment by segment list */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Route Segment Clearance Checklist
            </h4>
            <div className="space-y-2 text-xs">
              {currentRoute.segments.map((seg) => (
                <div
                  key={seg.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      Km {seg.fromKm} - {seg.toKm}
                    </span>
                    <span className="text-slate-500 ml-2">({seg.riskLevel} Risk)</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {seg.recommendedAction}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 self-start sm:self-center">
                    Score: {seg.riskScore}/100
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helpline Box */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <strong className="font-bold block mb-1">En-Route Emergency Contacts:</strong>
            <div className="flex flex-wrap gap-4 text-xs">
              <span>National Police / Ambulance: <strong>112</strong></span>
              <span>NHAI Highway Patrol: <strong>1033</strong></span>
              <span>Trauma Ambulance: <strong>108</strong></span>
              <span>Women Highway Helpline: <strong>1091</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
