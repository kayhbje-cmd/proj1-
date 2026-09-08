import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  AlertOctagon,
  Shield,
  Hospital,
  MapPin,
  Share2,
  CheckCircle2,
  Navigation,
  MessageCircle,
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName?: string;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  currentLocationName = 'NH-44 Corridor, Nagpur–Wardha Sector',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const distressMessage = `URGENT SOS! I am stranded on ${currentLocationName} (Approx Coordinates: 20.9320° N, 78.9610° E). Need immediate police / medical roadside assistance.`;

  const handleCopySOS = () => {
    navigator.clipboard?.writeText(distressMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppDistress = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(distressMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-700 block">
                Citizen Distress Protocol
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Emergency Road SOS
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Broadcast Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              Your Real-Time GPS Location
            </span>
            <span className="text-emerald-700 font-bold">GPS Accuracy: ±8m</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            {currentLocationName}
          </p>
          <p className="text-[11px] font-mono text-slate-500">
            Coordinates: 20.9320° N, 78.9610° E (Milepost 18)
          </p>

          <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopySOS}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Coordinates Copied!' : 'Copy SOS Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppDistress}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Send SOS via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Instant Dial Direct Numbers */}
        <div className="space-y-2.5 mb-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Immediate Response Contacts (1-Tap Dial)
          </span>

          <a
            href="tel:112"
            className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-between transition-all shadow-md shadow-rose-600/20 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-white" />
              <div>
                <div className="font-extrabold text-sm">Call 112 (National Police & Ambulance)</div>
                <div className="text-[11px] text-rose-100">Direct connection to nearest control room</div>
              </div>
            </div>
            <span className="text-base font-extrabold font-heading">112</span>
          </a>

          <a
            href="tel:1033"
            className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-between transition-all shadow-md shadow-blue-600/20 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white" />
              <div>
                <div className="font-extrabold text-sm">Call 1033 (NHAI Highway Patrol)</div>
                <div className="text-[11px] text-blue-100">National highway crane, towing & rescue</div>
              </div>
            </div>
            <span className="text-base font-extrabold font-heading">1033</span>
          </a>

          <a
            href="tel:108"
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between transition-all shadow-md shadow-emerald-600/20 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Hospital className="w-5 h-5 text-white" />
              <div>
                <div className="font-extrabold text-sm">Call 108 (Trauma Ambulance Dispatch)</div>
                <div className="text-[11px] text-emerald-100">Oxygen-equipped mobile trauma response</div>
              </div>
            </div>
            <span className="text-base font-extrabold font-heading">108</span>
          </a>
        </div>

        <div className="text-center text-[10px] text-slate-400">
          Emergency calls will connect through your mobile network carrier.
        </div>

      </div>
    </div>
  );
};
