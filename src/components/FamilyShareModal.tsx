import React, { useState } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  PhoneCall,
  Shield,
  Heart,
  MessageCircle,
  Copy,
  Users,
} from 'lucide-react';
import { RouteOption } from '../types';

interface FamilyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: RouteOption;
  origin: string;
  destination: string;
  vehicleType: string;
  departureTime: string;
}

export const FamilyShareModal: React.FC<FamilyShareModalProps> = ({
  isOpen,
  onClose,
  currentRoute,
  origin,
  destination,
  vehicleType,
  departureTime,
}) => {
  const [copied, setCopied] = useState(false);
  const [contactName, setContactName] = useState('Family');

  if (!isOpen) return null;

  const cleanOrigin = (origin || 'Origin').split(',')[0];
  const cleanDest = (destination || 'Destination').split(',')[0];
  const safetyRatingText = currentRoute.riskScore <= 40 ? 'Safe Route' : currentRoute.riskScore <= 60 ? 'Moderate Caution' : 'High Risk';

  const shareText = `🚗 SafeRoute AI - Live Journey Update\n` +
    `Dear ${contactName},\n` +
    `I am traveling from ${cleanOrigin} to ${cleanDest} by ${vehicleType.toUpperCase()}.\n` +
    `• Safety Score: ${currentRoute.riskScore}/100 (${safetyRatingText})\n` +
    `• Route: ${currentRoute.name}\n` +
    `• Departure: ${departureTime} (Est. Travel: ${currentRoute.durationStr})\n` +
    `• Emergency Patrol: Dial 112 / 1033 (NHAI Rescue)\n` +
    `Tracked via SafeRoute AI Citizen Safety Portal (PS ID: R1-03).`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Heart className="w-6 h-6 fill-emerald-600/20 text-emerald-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Citizen Peace of Mind
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Share Trip with Family
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

        {/* Form Body */}
        <div className="py-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Who are you sharing with?
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Mom, Brother, Priya"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Preview Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px] space-y-1.5 leading-relaxed">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 font-bold text-slate-900">
              <span>{cleanOrigin} ➔ {cleanDest}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                currentRoute.riskScore <= 40 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Safety {currentRoute.riskScore}/100
              </span>
            </div>
            <p className="text-slate-600">
              Departing at {departureTime} ({currentRoute.durationStr}) via {currentRoute.name}.
            </p>
            <p className="text-slate-500 text-[10px]">
              Includes 24/7 highway emergency dial numbers (112 & 1033).
            </p>
          </div>

          {/* Share Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Share Live Status on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Safety Message'}</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-[10px] text-slate-400">
          Encourages safer driving habits and keeps families informed.
        </div>

      </div>
    </div>
  );
};
