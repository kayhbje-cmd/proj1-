import React from 'react';
import {
  X,
  ThumbsUp,
  Flag,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CommunityReport, RouteSegment } from '../types';

interface CommunityReportDetailPanelProps {
  report: CommunityReport | null;
  segment: RouteSegment | null;
  onClose: () => void;
  onConfirm?: (reportId: string) => void;
  onReportMisleading?: (reportId: string) => void;
  isDarkMode?: boolean;
}

export const CommunityReportDetailPanel: React.FC<CommunityReportDetailPanelProps> = ({
  report,
  segment,
  onClose,
  onConfirm,
  onReportMisleading,
  isDarkMode = false,
}) => {
  if (!report) return null;

  // Get icon for report type
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return '🚦';
      case 'construction':
        return '🚧';
      case 'potholes':
        return '🕳️';
      case 'waterlogging':
        return '🌊';
      case 'heavy_rain':
        return '🌧️';
      case 'accident':
        return '⚠️';
      case 'visibility':
        return '👁️';
      case 'blockage':
        return '🚫';
      default:
        return '📍';
    }
  };

  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Calculate age
  const getAgeText = () => {
    const minutes = report.ageMinutes;
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
  };

  // Get confidence color
  const getConfidenceColor = () => {
    const score = report.confidenceScore;
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 50) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  // Get recommendation based on confidence
  const getRecommendation = () => {
    if (report.confidenceLevel === 'HIGHLY_CONFIRMED') {
      return `Multiple recent travellers have confirmed this report. ${
        report.type === 'traffic'
          ? 'Consider adjusting your route or allowing extra time.'
          : report.type === 'waterlogging' || report.type === 'flooding'
            ? 'Consider avoiding this section if possible. High hydroplaning risk.'
            : 'Drive carefully and follow recommended precautions.'
      }`;
    } else if (report.confidenceLevel === 'LIKELY') {
      return `Several travellers have observed similar conditions. Proceed with caution and monitor road conditions as you approach.`;
    }
    return `This is a newly reported issue. Take note but remain alert as conditions may change. Other travellers can help confirm this.`;
  };

  return (
    <div
      className={`absolute inset-x-3 bottom-3 w-auto max-h-[calc(100dvh-1.5rem)] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-40 sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto sm:w-96 sm:max-h-[calc(100vh-2rem)] ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-750 border-slate-700' : 'bg-gradient-to-r from-blue-50 to-emerald-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getReportIcon(report.type)}</div>
          <div>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {report.type.charAt(0).toUpperCase() + report.type.slice(1).replace(/_/g, ' ')}
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{report.roadName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-full transition-colors ${
            isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-5 space-y-5 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Confidence Score */}
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Community Confidence</span>
            </div>
            <span className={`text-2xl font-black ${getConfidenceColor().split(' ')[0].replace('from-', 'text-')}`}>
              {report.confidenceScore}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getConfidenceColor()}`}
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>
          <p className={`text-xs mt-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {report.confidenceLevel === 'HIGHLY_CONFIRMED' && '✓ Highly Confirmed'}
            {report.confidenceLevel === 'LIKELY' && '~ Likely (Several confirmations)'}
            {report.confidenceLevel === 'NEW_REPORT' && '○ New Report (Awaiting verification)'}
          </p>
        </div>

        {/* Report Details */}
        <div className={`rounded-xl p-4 space-y-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
          {/* Description */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Observation
            </p>
            <p className={`text-sm mt-2 leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              "{report.description}"
            </p>
          </div>

          <div className="h-px bg-slate-300 dark:bg-slate-600" />

          {/* Time & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Clock className="w-3 h-3 inline mr-1" /> Time
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{getAgeText()}</p>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {formatDate(report.reportedAt)}
              </p>
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <MapPin className="w-3 h-3 inline mr-1" /> Location
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                {report.locationVerified ? '✓ Verified' : '— Not verified'}
              </p>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {report.coordinates[0].toFixed(4)}, {report.coordinates[1].toFixed(4)}
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-300 dark:bg-slate-600" />

          {/* Confirmations */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Users className="w-3 h-3 inline mr-1" /> Traveller Confirmations
            </p>
            <p className={`text-2xl font-black mt-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {report.confirmations.length}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              Independent travellers who confirmed this
            </p>
          </div>
        </div>

        {/* Segment Info (if available) */}
        {segment && (
          <div
            className={`rounded-xl p-4 space-y-2 border-2 ${
              isDarkMode
                ? 'bg-slate-700 border-slate-600'
                : segment.riskLevel === 'CRITICAL'
                  ? 'bg-red-50 border-red-200'
                  : segment.riskLevel === 'HIGH'
                    ? 'bg-orange-50 border-orange-200'
                    : segment.riskLevel === 'MODERATE'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Road Risk Score
              </span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black">{segment.riskScore}</div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    segment.riskLevel === 'CRITICAL'
                      ? isDarkMode
                        ? 'bg-red-900 text-red-200'
                        : 'bg-red-200 text-red-900'
                      : segment.riskLevel === 'HIGH'
                        ? isDarkMode
                          ? 'bg-orange-900 text-orange-200'
                          : 'bg-orange-200 text-orange-900'
                        : segment.riskLevel === 'MODERATE'
                          ? isDarkMode
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-200 text-yellow-900'
                          : isDarkMode
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-200 text-green-900'
                  }`}
                >
                  {segment.riskLevel}
                </span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {segment.recommendedAction}
            </p>
          </div>
        )}

        {/* Recommendation */}
        <div
          className={`rounded-xl p-4 flex gap-3 ${isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border-2 border-blue-200'}`}
        >
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
              {getRecommendation()}
            </p>
          </div>
        </div>

        {/* Trust Note */}
        <div
          className={`rounded-lg p-3 text-xs leading-relaxed ${
            isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <p>
            <strong>About Community Reports:</strong> Community reports are traveller observations and may not always be
            accurate or current. SafeRoute AI combines community information with other available data to help users make
            informed decisions.
          </p>
        </div>
      </div>

      {/* Actions Footer */}
      <div className={`p-4 border-t flex gap-2 ${isDarkMode ? 'bg-slate-750 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <button
          onClick={() => onConfirm?.(report.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
            isDarkMode
              ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-200'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          Confirm
        </button>
        <button
          onClick={() => onReportMisleading?.(report.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
            isDarkMode ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300' : 'bg-red-100/50 hover:bg-red-100 text-red-600'
          }`}
        >
          <Flag className="w-4 h-4" />
          Report as Misleading
        </button>
      </div>
    </div>
  );
};
