import React from 'react';
import {
  AlertTriangle,
  ThumbsUp,
  Flag,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { CommunityReport, ConfidenceLevel, ReportAgeCategory } from '../types';

interface CommunityReportsCardProps {
  reports: CommunityReport[];
  onConfirmReport?: (reportId: string) => void;
  onReportMisleading?: (reportId: string) => void;
  isDarkMode?: boolean;
}

export const CommunityReportsCard: React.FC<CommunityReportsCardProps> = ({
  reports,
  onConfirmReport,
  onReportMisleading,
  isDarkMode = false,
}) => {
  // Get icon and emoji for report type
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

  // Get age category color
  const getAgeColor = (category: ReportAgeCategory) => {
    switch (category) {
      case 'FRESH':
        return 'bg-green-100 text-green-800';
      case 'RECENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'MAY_HAVE_CHANGED':
        return 'bg-orange-100 text-orange-800';
      case 'OLD_REPORT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get age indicator label
  const getAgeLabel = (category: ReportAgeCategory, minutes: number) => {
    switch (category) {
      case 'FRESH':
        return '🟢 ' + (minutes < 1 ? 'Just now' : minutes + ' min ago');
      case 'RECENT':
        return '🟡 ' + minutes + ' min ago';
      case 'MAY_HAVE_CHANGED':
        return '🟠 ' + Math.floor(minutes / 60) + 'h ago';
      case 'OLD_REPORT':
        return '🔴 ' + Math.floor(minutes / 60) + 'h ago';
      default:
        return minutes + ' min ago';
    }
  };

  // Get confidence level styling
  const getConfidenceStyle = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGHLY_CONFIRMED':
        return { bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'Highly Confirmed' };
      case 'LIKELY':
        return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Likely' };
      case 'NEW_REPORT':
        return { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: 'New Report' };
      default:
        return { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', label: 'Pending Verification' };
    }
  };

  // Filter active reports only
  const activeReports = reports.filter((r) => r.active);

  if (activeReports.length === 0) {
    return (
      <div
        className={`rounded-2xl border-2 p-6 text-center ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200'
        }`}
      >
        <MessageSquare className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No active community reports on this route.</p>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          ✓ Road appears clear based on recent traveller observations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
          <Users className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Community Reports</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Demo Community Data — Traveller observations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activeReports.slice(0, 5).map((report) => {
          const confidenceStyle = getConfidenceStyle(report.confidenceLevel);
          const confirmationCount = report.confirmations.length;

          return (
            <div
              key={report.id}
              className={`rounded-xl border-2 p-4 space-y-3 transition-all hover:shadow-lg ${
                isDarkMode
                  ? `${confidenceStyle.bg.replace('bg-', 'dark-bg-').replace('50', '900').replace('border-', 'dark-border-')} border-slate-600 bg-slate-750`
                  : `${confidenceStyle.bg} border-slate-200`
              }`}
            >
              {/* Header: Type + Road + Age */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl leading-none mt-0.5">{getReportIcon(report.type)}</div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1).replace(/_/g, ' ')}
                    </h4>
                    <p className={`text-xs flex items-center gap-1.5 mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <MapPin className="w-3 h-3" />
                      {report.roadName}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap font-semibold ${getAgeColor(report.ageCategory)}`}
                >
                  {getAgeLabel(report.ageCategory, report.ageMinutes)}
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                "{report.description}"
              </p>

              {/* Stats Row */}
              <div className={`flex items-center gap-4 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-semibold">{confirmationCount}</span>
                  <span>{confirmationCount === 1 ? 'confirmed' : 'confirmed'}</span>
                </div>
                {report.locationVerified && (
                  <div className="flex items-center gap-1">
                    <span>✓ Location verified</span>
                  </div>
                )}
              </div>

              {/* Confidence Badge + Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-current border-opacity-10">
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${confidenceStyle.text}`}>
                  {confidenceStyle.label} • {report.confidenceScore}%
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onConfirmReport?.(report.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isDarkMode
                        ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-200'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Confirm</span>
                  </button>
                  <button
                    onClick={() => onReportMisleading?.(report.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isDarkMode
                        ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300'
                        : 'bg-red-100/50 hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeReports.length > 5 && (
        <div className={`text-center py-3 text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          +{activeReports.length - 5} more reports
        </div>
      )}

      {/* Trust Message */}
      <div
        className={`rounded-lg p-3 text-xs leading-relaxed ${
          isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
        }`}
      >
        <p>
          <strong>Community reports</strong> are traveller observations and may not always be accurate or current.
          SafeRoute AI combines community information with other safety data to help users make informed decisions.
        </p>
      </div>
    </div>
  );
};
