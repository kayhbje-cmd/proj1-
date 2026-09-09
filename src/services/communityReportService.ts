import { CommunityReport, ConfidenceLevel, ReportAgeCategory } from '../types';

/**
 * Calculate the age category and minutes for a report
 */
export const calculateReportAge = (
  reportedAt: string,
): { ageMinutes: number; ageCategory: ReportAgeCategory } => {
  const now = new Date();
  const reported = new Date(reportedAt);
  const diffMs = now.getTime() - reported.getTime();
  const ageMinutes = Math.round(diffMs / 60000);

  let ageCategory: ReportAgeCategory = 'OLD_REPORT';
  if (ageMinutes < 15) {
    ageCategory = 'FRESH';
  } else if (ageMinutes < 60) {
    ageCategory = 'RECENT';
  } else if (ageMinutes < 240) {
    // 4 hours
    ageCategory = 'MAY_HAVE_CHANGED';
  }

  return { ageMinutes, ageCategory };
};

/**
 * Calculate confidence score based on:
 * - Number of independent confirmations
 * - Recency of report
 * - Age category
 */
export const calculateConfidenceScore = (report: CommunityReport): number => {
  let score = 30; // Base score

  // Confirmation factor (0-40 points)
  const confirmationCount = report.confirmations.length;
  if (confirmationCount >= 5) {
    score += 40;
  } else if (confirmationCount >= 3) {
    score += 30;
  } else if (confirmationCount >= 1) {
    score += 15;
  }

  // Age factor (0-30 points) - newer is better
  switch (report.ageCategory) {
    case 'FRESH':
      score += 30;
      break;
    case 'RECENT':
      score += 20;
      break;
    case 'MAY_HAVE_CHANGED':
      score += 10;
      break;
    case 'OLD_REPORT':
      score = Math.max(10, score - 20); // Penalize old reports
      break;
  }

  // Location verification bonus (0-10 points)
  if (report.locationVerified) {
    score += 10;
  }

  // Reporter history factor (0-5 points or penalty)
  if (report.issuedMisleadingReports > 2) {
    score = Math.max(10, score - 15); // Penalize frequent false reporters
  } else if (report.issuedMisleadingReports === 0) {
    score += 5;
  }

  // Cap at 100
  return Math.min(100, Math.max(10, score));
};

/**
 * Determine confidence level based on score and confirmations
 */
export const getConfidenceLevel = (
  confidenceScore: number,
  confirmationCount: number,
): ConfidenceLevel => {
  if (confidenceScore >= 75 && confirmationCount >= 3) {
    return 'HIGHLY_CONFIRMED';
  } else if (confidenceScore >= 50 && confirmationCount >= 1) {
    return 'LIKELY';
  }
  return 'NEW_REPORT';
};

/**
 * Calculate the community intelligence contribution to overall risk
 * Used to influence the route risk score
 *
 * Returns a value 0-20 (representing the max points added to risk score)
 */
export const calculateCommunityRiskInfluence = (
  reportsForSegment: CommunityReport[],
  segmentRiskBase: number,
): number => {
  if (reportsForSegment.length === 0) return 0;

  // Filter for active, recent, highly confirmed reports
  const weightedReports = reportsForSegment
    .filter((r) => r.active)
    .map((r) => {
      let weight = 0;

      // Confidence weight (0-1)
      if (r.confidenceLevel === 'HIGHLY_CONFIRMED') {
        weight = 0.8;
      } else if (r.confidenceLevel === 'LIKELY') {
        weight = 0.5;
      } else {
        weight = 0.2;
      }

      // Age factor (reduce weight for old reports)
      if (r.ageCategory === 'OLD_REPORT') {
        weight *= 0.2;
      } else if (r.ageCategory === 'MAY_HAVE_CHANGED') {
        weight *= 0.6;
      } else if (r.ageCategory === 'RECENT') {
        weight *= 0.9;
      }

      return weight;
    });

  if (weightedReports.length === 0) return 0;

  // Average weighted impact
  const averageWeight = weightedReports.reduce((a, b) => a + b, 0) / weightedReports.length;

  // Cap influence at 20 points, scaled by base risk
  // Higher base risk = less additional influence (already risky)
  // Lower base risk = more influence (new risk factor)
  const baseInfluence = averageWeight * 20;
  const riskFactor = Math.max(0.5, (100 - segmentRiskBase) / 100);

  return baseInfluence * riskFactor;
};

/**
 * Get reports for a specific road segment
 */
export const getReportsForSegment = (
  reports: CommunityReport[],
  segmentId?: string,
  roadName?: string,
): CommunityReport[] => {
  return reports.filter((r) => {
    if (segmentId && r.roadSegmentId === segmentId) return true;
    if (roadName && r.roadName.toLowerCase().includes(roadName.toLowerCase())) return true;
    return false;
  });
};

/**
 * Group similar reports together
 * Used to prevent duplicate entries and show grouped confidence
 */
export const groupSimilarReports = (
  reports: CommunityReport[],
  radiusKm: number = 1,
): CommunityReport[][] => {
  const groups: CommunityReport[][] = [];
  const used = new Set<string>();

  for (const report of reports) {
    if (used.has(report.id)) continue;

    const group = [report];
    used.add(report.id);

    // Find similar reports (same type, nearby location, similar time)
    for (const other of reports) {
      if (used.has(other.id) || other.type !== report.type) continue;

      const distance = calculateDistance(report.coordinates, other.coordinates);
      const timeDiffMins = Math.abs(
        new Date(report.reportedAt).getTime() - new Date(other.reportedAt).getTime(),
      ) / 60000;

      // Same report type, within radius, reported within 2 hours
      if (distance <= radiusKm && timeDiffMins <= 120) {
        group.push(other);
        used.add(other.id);
      }
    }

    groups.push(group);
  }

  return groups;
};

/**
 * Calculate distance between two coordinates (in km)
 * Using simplified Haversine formula
 */
export const calculateDistance = (
  coord1: [number, number],
  coord2: [number, number],
): number => {
  const [lat1, lng1] = coord1;
  const [lat2, lng2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Update report age information (minutes and category)
 */
export const updateReportAge = (report: CommunityReport): CommunityReport => {
  const { ageMinutes, ageCategory } = calculateReportAge(report.reportedAt);
  return {
    ...report,
    ageMinutes,
    ageCategory,
  };
};

/**
 * Update confidence score based on current state
 */
export const updateReportConfidence = (report: CommunityReport): CommunityReport => {
  const confidenceScore = calculateConfidenceScore(report);
  const confidenceLevel = getConfidenceLevel(confidenceScore, report.confirmations.length);

  return {
    ...report,
    confidenceScore,
    confidenceLevel,
  };
};

/**
 * Add a confirmation to a report
 * Prevents duplicate confirmations from same user
 */
export const addConfirmationToReport = (
  report: CommunityReport,
  userId: string,
): CommunityReport => {
  // Check if user already confirmed
  if (report.confirmations.some((c) => c.userId === userId)) {
    return report; // Prevent duplicate confirmations
  }

  const updated = {
    ...report,
    confirmations: [
      ...report.confirmations,
      {
        userId,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return updateReportConfidence(updated);
};
