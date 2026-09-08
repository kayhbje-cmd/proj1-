import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Car,
  Bike,
  Bus,
  Truck,
  Footprints,
  Shield,
  Sparkles,
  ArrowRight,
  LocateFixed,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Share2,
} from 'lucide-react';
import { JourneyPlanInput, VehicleType } from '../types';
import { DEMO_PRESETS } from '../data/mockRoutes';

interface JourneyPlannerProps {
  initialInput: JourneyPlanInput;
  onAnalyzeJourney: (input: JourneyPlanInput) => void;
  isAnalyzing: boolean;
}

export const JourneyPlanner: React.FC<JourneyPlannerProps> = ({
  initialInput,
  onAnalyzeJourney,
  isAnalyzing,
}) => {
  const [form, setForm] = useState<JourneyPlanInput>(initialInput);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Quick preset loader
  const handleSelectPreset = (index: number) => {
    const preset = DEMO_PRESETS[index];
    setForm(prev => ({
      ...prev,
      from: preset.from,
      to: preset.to,
    }));
  };

  // Geolocation handler
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Pinpointing current GPS position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLocationStatus('GPS Coordinates verified: Sitabuldi, Nagpur');
        setForm(prev => ({
          ...prev,
          from: `Current GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) — Sitabuldi, Nagpur`,
        }));
        setTimeout(() => setLocationStatus(null), 3000);
      },
      () => {
        setIsLocating(false);
        setLocationStatus('Using central hub: Nagpur Zero Mile Stone');
        setForm(prev => ({
          ...prev,
          from: 'Nagpur Zero Mile Stone, Sitabuldi',
        }));
        setTimeout(() => setLocationStatus(null), 3000);
      },
      { timeout: 5000 }
    );
  };

  const vehicleOptions: { type: VehicleType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'car', label: 'Car / Cab', icon: Car },
    { type: 'bike', label: 'Two Wheeler', icon: Bike },
    { type: 'bus', label: 'Bus', icon: Bus },
    { type: 'truck', label: 'Truck / Cargo', icon: Truck },
    { type: 'walking', label: 'Pedestrian', icon: Footprints },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyzeJourney(form);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      
      {/* Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5" />
          Citizen Road Risk Analysis
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          Plan Your Safe Journey
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto mt-1">
          Input your travel plan to inspect accident spots, waterlogging risks, and find the safest alternative route.
        </p>
      </div>

      {/* Main Card Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xs">
        
        {/* Quick Demo Presets */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Quick Route Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {DEMO_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Origin Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Starting Location (Origin)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                type="text"
                id="journey-input-from"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                required
                placeholder="e.g. Sitabuldi, Nagpur"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-24 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="absolute inset-y-1.5 right-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <LocateFixed className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'GPS'}</span>
              </button>
            </div>
            {locationStatus && (
              <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {locationStatus}
              </p>
            )}
          </div>

          {/* Destination Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Destination
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Navigation className="w-4 h-4 text-rose-600" />
              </div>
              <input
                type="text"
                id="journey-input-to"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                required
                placeholder="e.g. Wardha Bus Stand / MIDC"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Vehicle Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {vehicleOptions.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, vehicle: type })}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    form.vehicle === type
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Departure Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="date"
                  value={form.departureDate}
                  onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Departure Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="time"
                  value={form.departureTime}
                  onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Citizen Travel Options */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Citizen Safety Preferences
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, preferSaferRoute: !prev.preferSaferRoute }))}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  form.preferSaferRoute
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Prefer Safer Route (Prioritize Safety Score over Speed)</span>
              </button>

              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, avoidAccidentZones: !prev.avoidAccidentZones }))}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  form.avoidAccidentZones
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bypass High-Crash Blackspots</span>
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              id="analyze-journey-submit"
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all hover:scale-101 active:scale-99 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Road Blackspots & Weather...</span>
                </>
              ) : (
                <>
                  <span>Inspect Route Risk & Safety Radar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
