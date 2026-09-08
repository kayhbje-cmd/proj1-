import React, { useState } from 'react';
import {
  PhoneCall,
  Hospital,
  Shield,
  Fuel,
  Coffee,
  AlertOctagon,
  MapPin,
  ExternalLink,
  Clock,
  Compass,
  CheckCircle2,
  Share2,
  Heart,
} from 'lucide-react';
import { EmergencyFacility } from '../types';

interface EmergencyViewProps {
  facilities: EmergencyFacility[];
  onOpenSOS: () => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  facilities,
  onOpenSOS,
}) => {
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const emergencyHelplines = [
    { name: 'National Emergency Response', number: '112', desc: 'Police, Fire, Ambulance Combined' },
    { name: 'NHAI Highway Rescue', number: '1033', desc: 'Towing, Crane & Trauma Ambulance on National Highways' },
    { name: 'Trauma & Medical Ambulance', number: '108', desc: 'Direct Government Emergency Care' },
    { name: 'Women Safety Highway Helpline', number: '1091', desc: '24/7 Dedicated Support for Women Travelers' },
  ];

  const handleShareLocation = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        'EMERGENCY: I am traveling on NH-44 near Butibori MIDC (20.9234° N, 78.9812° E). Need immediate road assistance.'
      );
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 3000);
    }
  };

  const filteredFacilities = filterType === 'all'
    ? facilities
    : facilities.filter(f => f.type === filterType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital':
      case 'ambulance':
        return <Hospital className="w-5 h-5 text-rose-600" />;
      case 'police':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'fuel':
        return <Fuel className="w-5 h-5 text-emerald-600" />;
      default:
        return <Coffee className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner with 1-Tap SOS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            24/7 Citizen Highway Support
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Emergency Services & Safe Highway Stops
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Direct access to trauma hospitals, police posts, 24/7 verified well-lit petrol pumps, and official NHAI emergency assistance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShareLocation}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            {copiedLocation ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-600" />}
            <span>{copiedLocation ? 'GPS Coordinates Copied!' : 'Copy GPS SOS'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSOS}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Launch SOS Mode</span>
          </button>
        </div>
      </div>

      {/* Direct Helplines Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          National Emergency Highway Helplines (1-Tap Dial)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyHelplines.map((line, idx) => (
            <a
              key={idx}
              href={`tel:${line.number}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {line.name}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {line.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xl font-extrabold text-slate-900 font-heading">
                  {line.number}
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  Tap to Dial ➔
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Facilities ({facilities.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('hospital')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'hospital'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Hospitals & Trauma Care
        </button>
        <button
          type="button"
          onClick={() => setFilterType('police')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'police'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Highway Police Posts
        </button>
        <button
          type="button"
          onClick={() => setFilterType('fuel')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'fuel'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Safe Stops for Families & Women
        </button>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => {
          return (
            <div
              key={fac.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs">
                      {getIcon(fac.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{fac.name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {fac.distanceKm} km away • ETA ~{fac.etaMins} mins
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{fac.address}</span>
                </p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {fac.services.map((svc, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`tel:${fac.phone}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {fac.phone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
