import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Hospital,
  Shield,
  CloudRain,
  Fuel,
  Coffee,
  X,
  Navigation,
  Compass,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  PhoneCall,
} from 'lucide-react';
import {
  RouteOption,
  RouteSegment,
  AccidentHotspot,
  RoadHazard,
  EmergencyFacility,
  RiskLevel,
} from '../types';

interface RiskMapProps {
  currentRoute: RouteOption;
  allRoutes: RouteOption[];
  onSelectRoute: (routeId: string) => void;
  hotspots: AccidentHotspot[];
  hazards: RoadHazard[];
  emergencyFacilities: EmergencyFacility[];
  selectedSegment: RouteSegment | null;
  onSelectSegment: (segment: RouteSegment | null) => void;
  isDarkMode: boolean;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  currentRoute,
  allRoutes,
  onSelectRoute,
  hotspots,
  hazards,
  emergencyFacilities,
  selectedSegment,
  onSelectSegment,
  isDarkMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filter toggles
  const [filter, setFilter] = useState<'all' | 'hazards' | 'weather' | 'hotspots' | 'emergency'>('all');
  const [inspectingItem, setInspectingItem] = useState<{
    type: 'segment' | 'hotspot' | 'hazard' | 'facility';
    data: any;
  } | null>(null);

  // Colors for risk segments
  const getSegmentColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return '#dc2626'; // Red
      case 'HIGH':
        return '#ea580c'; // Orange
      case 'MODERATE':
        return '#d97706'; // Amber
      case 'LOW':
      default:
        return '#16a34a'; // Emerald
    }
  };

  // Synchronize when selectedSegment prop changes
  useEffect(() => {
    if (selectedSegment) {
      setInspectingItem({ type: 'segment', data: selectedSegment });
    }
  }, [selectedSegment]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = [20.95, 78.85];
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 10,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Voyager tile layer for crisp white / light citizen map
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tile = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tile;
      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      // Update tile if dark/light toggles
      if (tileLayerRef.current) {
        const tileUrl = isDarkMode
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        tileLayerRef.current.setUrl(tileUrl);
      }
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (!layerGroup) return;
    layerGroup.clearLayers();

    // 1. Draw Inactive Alternative Routes (dashed and clickable)
    allRoutes.forEach((route) => {
      if (route.id !== currentRoute.id) {
        const allCoords = route.segments.flatMap((s) => s.coordinates);
        if (allCoords.length > 0) {
          const polyline = L.polyline(allCoords, {
            color: '#94a3b8',
            weight: 4,
            opacity: 0.6,
            dashArray: '8, 8',
          });

          polyline.on('click', () => {
            onSelectRoute(route.id);
          });

          polyline.bindTooltip(
            `<div class="text-xs font-bold text-slate-800 bg-white p-1 rounded shadow-xs">${route.name} (Tap to Switch)</div>`,
            { sticky: true, className: 'map-custom-tooltip' }
          );

          layerGroup.addLayer(polyline);
        }
      }
    });

    // 2. Draw Active Route Segments (Colored by risk score)
    currentRoute.segments.forEach((seg) => {
      if (seg.coordinates && seg.coordinates.length > 1) {
        const color = getSegmentColor(seg.riskLevel);
        const polyline = L.polyline(seg.coordinates, {
          color: color,
          weight: 7,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.on('click', () => {
          onSelectSegment(seg);
          setInspectingItem({ type: 'segment', data: seg });
        });

        polyline.bindTooltip(
          `<div class="p-1 text-xs">
            <span class="font-bold text-slate-900">Km ${seg.fromKm} - ${seg.toKm}</span>
            <div class="text-[10px] font-semibold text-slate-600">Risk: ${seg.riskScore}/100 (${seg.riskLevel})</div>
          </div>`,
          { sticky: true }
        );

        layerGroup.addLayer(polyline);
      }
    });

    // 3. Accident Hotspots (Markers with crash count)
    if (filter === 'all' || filter === 'hotspots') {
      hotspots.forEach((spot) => {
        const iconHtml = `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <span class="text-[10px] leading-none">${spot.incidentCount}</span>
            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping"></span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-hotspot',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(spot.coordinates, { icon: customIcon });
        marker.on('click', () => {
          setInspectingItem({ type: 'hotspot', data: spot });
        });
        layerGroup.addLayer(marker);
      });
    }

    // 4. Live Hazards & Weather alerts
    if (filter === 'all' || filter === 'hazards' || filter === 'weather') {
      hazards.forEach((hazard) => {
        if (filter === 'weather' && hazard.type !== 'WEATHER_WATERLOGGING') return;

        const isCritical = hazard.severity === 'CRITICAL';
        const bgColor = isCritical ? '#dc2626' : '#d97706';

        const iconHtml = `
          <div style="background-color: ${bgColor};" class="w-7 h-7 rounded-full text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-hazard',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(hazard.coordinates, { icon: customIcon });
        marker.on('click', () => {
          setInspectingItem({ type: 'hazard', data: hazard });
        });
        layerGroup.addLayer(marker);
      });
    }

    // 5. Emergency facilities & Safe stops
    if (filter === 'all' || filter === 'emergency') {
      emergencyFacilities.forEach((fac) => {
        const isHospital = fac.type === 'HOSPITAL';
        const isPolice = fac.type === 'POLICE_OUTPOST';
        const isFuel = fac.type === 'FUEL_REST_STOP';

        const bgClass = isHospital ? 'bg-rose-600' : isPolice ? 'bg-blue-600' : 'bg-emerald-600';

        const iconHtml = `
          <div class="w-6 h-6 rounded-full ${bgClass} text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <span class="text-[10px] font-bold">${isHospital ? 'H' : isPolice ? 'P' : '⛽'}</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-facility',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(fac.coordinates, { icon: customIcon });
        marker.on('click', () => {
          setInspectingItem({ type: 'facility', data: fac });
        });
        layerGroup.addLayer(marker);
      });
    }

    // 6. Start & Destination Pins
    const allSegCoords = currentRoute.segments.flatMap((s) => s.coordinates);
    if (allSegCoords.length > 1) {
      const startCoord = allSegCoords[0];
      const endCoord = allSegCoords[allSegCoords.length - 1];

      // Origin Pin
      const startIcon = L.divIcon({
        html: `<div class="px-2.5 py-1 rounded-full bg-emerald-700 text-white font-bold text-[11px] shadow-md border-2 border-white flex items-center gap-1">
          <span>Start</span>
        </div>`,
        className: 'custom-pin-start',
        iconSize: [60, 24],
        iconAnchor: [30, 24],
      });
      L.marker(startCoord, { icon: startIcon }).addTo(layerGroup);

      // Destination Pin
      const endIcon = L.divIcon({
        html: `<div class="px-2.5 py-1 rounded-full bg-rose-700 text-white font-bold text-[11px] shadow-md border-2 border-white flex items-center gap-1">
          <span>Dest</span>
        </div>`,
        className: 'custom-pin-end',
        iconSize: [60, 24],
        iconAnchor: [30, 24],
      });
      L.marker(endCoord, { icon: endIcon }).addTo(layerGroup);

      // Auto-fit bounds
      const bounds = L.latLngBounds(allSegCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [currentRoute, allRoutes, hotspots, hazards, emergencyFacilities, filter, isDarkMode]);

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Filter Bar (Clean Pill Controls) */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Layers
        </button>
        <button
          type="button"
          onClick={() => setFilter('hotspots')}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            filter === 'hotspots' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Blackspots
        </button>
        <button
          type="button"
          onClick={() => setFilter('hazards')}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            filter === 'hazards' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Road Hazards
        </button>
        <button
          type="button"
          onClick={() => setFilter('emergency')}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            filter === 'emergency' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Hospital className="w-3.5 h-3.5" />
          Safe Stops & Help
        </button>
      </div>

      {/* Route Legend Indicator (Bottom-Left) */}
      <div className="hidden sm:flex absolute bottom-3 left-3 z-10 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-[11px] space-y-1">
        <span className="font-bold text-slate-800 uppercase tracking-wider block text-[9px]">
          Road Risk Scale
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-1.5 rounded-full bg-emerald-600" /> Safe
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-1.5 rounded-full bg-amber-500" /> Caution
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-1.5 rounded-full bg-rose-600" /> Blackspot
          </span>
        </div>
      </div>

      {/* Interactive Item Inspector Card / Mobile Bottom Sheet */}
      {inspectingItem && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 z-20 bg-white border border-slate-200 rounded-3xl p-4 shadow-xl animate-fadeIn">
          
          <div className="flex items-start justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {inspectingItem.type === 'segment' && <Navigation className="w-4 h-4 text-emerald-700" />}
              {inspectingItem.type === 'hotspot' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              {inspectingItem.type === 'hazard' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {inspectingItem.type === 'facility' && <Hospital className="w-4 h-4 text-blue-600" />}

              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                {inspectingItem.type === 'segment' && 'Road Stretch Details'}
                {inspectingItem.type === 'hotspot' && `Accident Blackspot: ${inspectingItem.data.locationName}`}
                {inspectingItem.type === 'hazard' && inspectingItem.data.title}
                {inspectingItem.type === 'facility' && inspectingItem.data.name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setInspectingItem(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segment Details */}
          {inspectingItem.type === 'segment' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-800">
                  Km {inspectingItem.data.fromKm} – {inspectingItem.data.toKm} ahead
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Risk Assessment:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  inspectingItem.data.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                  inspectingItem.data.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  inspectingItem.data.riskLevel === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {inspectingItem.data.riskScore}/100 ({inspectingItem.data.riskLevel})
                </span>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1 text-[11px]">Primary Risk Drivers:</span>
                <ul className="space-y-1">
                  {inspectingItem.data.reasons.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                      <span className="text-rose-600 mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <strong className="text-emerald-800 block mb-0.5 font-bold">Recommended Citizen Precaution:</strong>
                {inspectingItem.data.recommendedAction}
              </div>
            </div>
          )}

          {/* Hotspot Details */}
          {inspectingItem.type === 'hotspot' && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <strong className="block font-bold text-rose-800">Historical Crash Frequency:</strong>
                {inspectingItem.data.incidentCount} police-verified collisions at this junction in past 12 months.
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">High-Risk Timing:</span>
                {inspectingItem.data.timePattern}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Primary Crash Driver:</span>
                {inspectingItem.data.primaryCause}
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <strong className="text-amber-800 block mb-0.5 font-bold">Safe Driving Advice:</strong>
                {inspectingItem.data.recommendedPrecaution}
              </div>
            </div>
          )}

          {/* Hazard Details */}
          {inspectingItem.type === 'hazard' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Distance Ahead:</span>
                <span className="font-bold text-slate-900">{inspectingItem.data.distanceAheadKm} km</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Expected Road Impact:</span>
                {inspectingItem.data.impactOnRoute}
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <strong className="text-emerald-800 block mb-0.5 font-bold">Suggested Action:</strong>
                {inspectingItem.data.suggestedAction}
              </div>
            </div>
          )}

          {/* Emergency Facility Details */}
          {inspectingItem.type === 'facility' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Distance & ETA:</span>
                <span className="font-bold text-emerald-800">
                  {inspectingItem.data.distanceKm} km • ETA ~{inspectingItem.data.etaMins} mins
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Location Address:</span>
                {inspectingItem.data.address}
              </div>
              <a
                href={`tel:${inspectingItem.data.phone}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {inspectingItem.data.phone}</span>
              </a>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
