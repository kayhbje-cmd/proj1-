import React from 'react';
import {
  CloudRain,
  Thermometer,
  Eye,
  Wind,
  Droplets,
  AlertTriangle,
  Clock,
  Car,
  ShieldAlert,
} from 'lucide-react';
import { WeatherRiskInfo } from '../types';

interface WeatherRiskCardProps {
  weather: WeatherRiskInfo;
}

export const WeatherRiskCard: React.FC<WeatherRiskCardProps> = ({ weather }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-5 sm:p-7">
      
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            Monsoon Weather & Surface Friction
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Real-Time Weather Risk Advisory
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
          Live Radar Active
        </span>
      </div>

      {/* Calculated Impact Banner */}
      <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Journey Safety Advisory: {weather.impactLevel}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
          {weather.impactSummary}
        </p>
        <div className="mt-2.5 pt-2 border-t border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
          <span>{weather.timeForecast}</span>
        </div>
      </div>

      {/* Weather Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        
        {/* Condition & Temp */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block mb-1">Current Weather</span>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-sm text-slate-900">{weather.condition}</span>
          </div>
          <span className="text-xs text-slate-600 font-semibold">{weather.temperatureC}°C</span>
        </div>

        {/* Rain Rate */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block mb-1">Precipitation</span>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-sm text-slate-900">{weather.rainfallMmHr} mm/h</span>
          </div>
          <span className="text-xs text-slate-600">Continuous drizzle</span>
        </div>

        {/* Visibility */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block mb-1">Driver Visibility</span>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-sm text-slate-900">{weather.visibilityMeters}m</span>
          </div>
          <span className="text-xs text-amber-700 font-semibold">Reduced headlights range</span>
        </div>

        {/* Waterlogging Risk */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block mb-1">Waterlogging</span>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="font-bold text-sm text-slate-900">{weather.waterloggingRisk}</span>
          </div>
          <span className="text-xs text-rose-700 font-semibold">Underpasses flooded</span>
        </div>

        {/* Wind */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block mb-1">Cross-Winds</span>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-slate-600" />
            <span className="font-bold text-sm text-slate-900">{weather.windSpeedKmph} km/h</span>
          </div>
          <span className="text-xs text-slate-600">Gusts over bridge</span>
        </div>

      </div>

      {/* Driver Safety Advice Box */}
      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
        <Car className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-blue-900 block mb-0.5">Civilian Safety Precaution:</strong>
          Wet asphalt increases your stopping distance by over 40%. Turn on dipped headlights, double your following distance, and avoid abrupt steering maneuvers.
        </div>
      </div>

    </div>
  );
};
