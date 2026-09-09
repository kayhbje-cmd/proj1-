import React, { useState } from 'react';
import {
  X,
  Send,
  MapPin,
  Type,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CommunityReportType, RouteSegment } from '../types';

interface CommunityReportSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: {
    type: CommunityReportType;
    roadName: string;
    roadSegmentId?: string;
    description: string;
    coordinates: [number, number];
    locationVerified: boolean;
    photoUrl?: string;
  }) => void;
  currentLocation?: [number, number];
  availableSegments?: RouteSegment[];
  isDarkMode?: boolean;
}

export const CommunityReportSubmitModal: React.FC<CommunityReportSubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentLocation,
  availableSegments = [],
  isDarkMode = false,
}) => {
  const [step, setStep] = useState<'select-type' | 'select-road' | 'description' | 'confirm' | 'success'>('select-type');
  const [selectedType, setSelectedType] = useState<CommunityReportType | null>(null);
  const [selectedRoad, setSelectedRoad] = useState<string>('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>();
  const [description, setDescription] = useState('');
  const [gpsLocation, setGpsLocation] = useState<[number, number] | undefined>(currentLocation);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'unavailable'>('idle');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();

  const reportTypes: { type: CommunityReportType; label: string; emoji: string; description: string }[] = [
    { type: 'traffic', label: 'Heavy Traffic', emoji: '🚦', description: 'Traffic congestion' },
    { type: 'construction', label: 'Road Construction', emoji: '🚧', description: 'Construction work in progress' },
    { type: 'potholes', label: 'Potholes / Bad Condition', emoji: '🕳️', description: 'Road damage and deterioration' },
    { type: 'waterlogging', label: 'Waterlogging / Flooding', emoji: '🌊', description: 'Water on road surface' },
    { type: 'heavy_rain', label: 'Heavy Rain', emoji: '🌧️', description: 'Severe weather conditions' },
    { type: 'accident', label: 'Accident / Incident', emoji: '⚠️', description: 'Collision or incident' },
    { type: 'visibility', label: 'Poor Visibility', emoji: '👁️', description: 'Fog, dust, or darkness' },
    { type: 'blockage', label: 'Road Blockage', emoji: '🚫', description: 'Path obstructed' },
    { type: 'other', label: 'Other Safety Issue', emoji: '📍', description: 'Other concerns' },
  ];

  const handleSubmit = () => {
    if (selectedType && selectedRoad && description.trim()) {
      onSubmit({
        type: selectedType,
        roadName: selectedRoad,
        roadSegmentId: selectedSegmentId,
        description: description.trim(),
        coordinates: gpsLocation || [20.9500, 78.9100],
        locationVerified: Boolean(gpsLocation),
        photoUrl,
      });
      setStep('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setStep('select-type');
    setSelectedType(null);
    setSelectedRoad('');
    setSelectedSegmentId(undefined);
    setDescription('');
    setGpsLocation(currentLocation);
    setLocationStatus('idle');
    setPhotoUrl(undefined);
    onClose();
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGpsLocation([coords.latitude, coords.longitude]);
        setLocationStatus('idle');
      },
      () => setLocationStatus('unavailable'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 flex items-center justify-between border-b ${
            isDarkMode ? 'bg-slate-750 border-slate-700' : 'bg-gradient-to-r from-blue-50 to-emerald-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <MessageSquare className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`font-extrabold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Report Road Condition
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Help other travellers stay safe</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          {step === 'success' && (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
              <div>
                <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Report Submitted!</h4>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Thanks! Your road report will help other travellers make safer decisions.
                </p>
              </div>
            </div>
          )}

          {step === 'select-type' && (
            <div className="space-y-3">
              <p className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                What type of issue did you observe?
              </p>
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                {reportTypes.map((rt) => (
                  <button
                    key={rt.type}
                    onClick={() => {
                      setSelectedType(rt.type);
                      setStep('select-road');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isDarkMode
                        ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-750'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{rt.emoji}</div>
                    <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{rt.label}</div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{rt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'select-road' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  Road / Route Segment
                </label>
                <input
                  type="text"
                  placeholder="Enter road name or segment"
                  value={selectedRoad}
                  onChange={(e) => setSelectedRoad(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {availableSegments.length > 0 && (
                <div>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Or select from route:</p>
                  <div className="space-y-1.5">
                    {availableSegments.slice(0, 5).map((seg) => (
                      <button
                        key={seg.id}
                        onClick={() => {
                          setSelectedRoad(seg.roadName);
                          setSelectedSegmentId(seg.id);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                          selectedRoad === seg.roadName
                            ? isDarkMode
                              ? 'bg-blue-900 border-blue-600 text-white'
                              : 'bg-blue-100 border-blue-300 text-blue-900'
                            : isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-650'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-sm font-semibold">{seg.roadName}</div>
                        <div className="text-xs opacity-75">Km {seg.fromKm} - {seg.toKm}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'description' && (
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  Describe what you observed
                </label>
                <textarea
                  placeholder="e.g., 'Heavy traffic jam, moving at 10 km/h' or 'Multiple potholes on left lane'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={250}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <div className={`text-xs mt-2 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {description.length}/250
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  Optional photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setPhotoUrl(file ? URL.createObjectURL(file) : undefined);
                  }}
                  className={`block w-full text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                />
              </div>

              {gpsLocation && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>✓ Location verified via GPS</span>
                </div>
              )}

              {!gpsLocation && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-2 text-xs ${
                    isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>Location not verified. You can still submit manually.</p>
                    <button type="button" onClick={requestLocation} className="font-bold underline underline-offset-2">
                      {locationStatus === 'locating' ? 'Checking location…' : 'Use my location for verification'}
                    </button>
                    {locationStatus === 'unavailable' && <p>Location was unavailable or permission was not granted.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div
                className={`rounded-lg p-4 space-y-3 ${isDarkMode ? 'bg-slate-700 border border-slate-600' : 'bg-slate-50 border border-slate-200'}`}
              >
                <div>
                  <p className={`text-xs uppercase tracking-wide font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Report Type
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {reportTypes.find((r) => r.type === selectedType)?.label}
                  </p>
                </div>
                <div className="h-px bg-slate-300 dark:bg-slate-600" />
                <div>
                  <p className={`text-xs uppercase tracking-wide font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Road / Segment
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedRoad}</p>
                </div>
                <div className="h-px bg-slate-300 dark:bg-slate-600" />
                <div>
                  <p className={`text-xs uppercase tracking-wide font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Description
                  </p>
                  <p className={`text-sm mt-1 leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{description}</p>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                <p>
                  By submitting this report, you confirm that the information is accurate to the best of your knowledge. Reports
                  may be reviewed for accuracy and spam-like activity.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className={`p-5 border-t flex gap-3 ${isDarkMode ? 'bg-slate-750 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            {step !== 'select-type' && (
              <button
                onClick={() => {
                  if (step === 'select-road') setStep('select-type');
                  else if (step === 'description') setStep('select-road');
                  else if (step === 'confirm') setStep('description');
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step === 'select-type') handleClose();
                else if (step === 'select-road' && selectedRoad) setStep('description');
                else if (step === 'description' && description.trim()) setStep('confirm');
                else if (step === 'confirm') handleSubmit();
              }}
              disabled={
                (step === 'select-road' && !selectedRoad) ||
                (step === 'description' && !description.trim()) ||
                (step === 'confirm' && !selectedType)
              }
              className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                (step === 'select-road' && !selectedRoad) ||
                (step === 'description' && !description.trim()) ||
                (step === 'confirm' && !selectedType)
                  ? isDarkMode
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              {step === 'confirm' ? 'Submit Report' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
