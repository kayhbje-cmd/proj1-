export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type VehicleType = 'car' | 'bike' | 'bus' | 'truck' | 'walking';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteSegment {
  id: string;
  roadName: string;
  fromKm: number;
  toKm: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  reasons: string[];
  recommendedAction: string;
  weatherCondition: string;
  incidentCount12m: number;
  delayMins: number;
  coordinates: [number, number][];
}

export interface RouteOption {
  id: string;
  name: string;
  tag: 'Fastest' | 'Safer' | 'Balanced';
  durationMins: number;
  durationStr: string;
  distanceKm: number;
  distanceStr: string;
  riskScore: number;
  riskLevel: RiskLevel;
  hazardCount: number;
  weatherImpact: 'LOW' | 'MODERATE' | 'HIGH';
  description: string;
  summary?: string;
  tradeOffReason?: string;
  isRecommended: boolean;
  segments: RouteSegment[];
}

export interface WeatherRiskInfo {
  condition: string;
  temperatureC: number;
  rainProbability: number;
  rainIntensityMm: number;
  visibilityMeters: number;
  windSpeedKmh: number;
  impactLevel: 'LOW' | 'MODERATE' | 'HIGH';
  impactSummary: string;
  timeForecast: string;
}

export interface AccidentHotspot {
  id: string;
  name: string;
  locationName: string;
  incidentCount: number;
  riskLevel: RiskLevel;
  timePattern: string;
  primaryCause: string;
  recommendedPrecaution: string;
  coordinates: [number, number];
}

export interface RoadHazard {
  id: string;
  type: 'accident' | 'road_closure' | 'construction' | 'potholes' | 'flooding' | 'landslide' | 'traffic' | 'visibility';
  title: string;
  locationDescription?: string;
  locationDesc?: string;
  distanceAheadKm: number;
  severity: RiskLevel;
  estimatedDuration?: string;
  durationEstimate?: string;
  delayMins: number;
  impactOnRoute: string;
  suggestedAction: string;
  timestamp?: string;
  reportedAt?: string;
  verifiedCount?: number;
  coordinates: [number, number];
}

export interface EmergencyFacility {
  id: string;
  type: 'hospital' | 'police' | 'ambulance' | 'fuel' | 'safe_stop';
  name: string;
  category: string;
  distanceKm: number;
  etaMins: number;
  isOpen: boolean;
  phone: string;
  address: string;
  coordinates: [number, number];
  services: string[];
}

export interface TimeRiskSlot {
  label?: string;
  time?: string;
  slotLabel?: string;
  hour24?: number;
  riskScore?: number;
  score?: number;
  riskLevel?: RiskLevel;
  level?: RiskLevel;
  isRecommended?: boolean;
  isOptimal?: boolean;
  trafficDensity?: 'Low' | 'Moderate' | 'Heavy' | 'Extreme' | string;
  visibilityFactor?: 'Optimal' | 'Reduced' | 'Severely Compromised' | string;
  weatherForecast?: string;
  lightingCondition?: string;
  notes?: string;
  rationale?: string;
  recommendation?: string;
}

export type TimeSlotRisk = TimeRiskSlot;

export interface JourneyPlanInput {
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  vehicleType: VehicleType;
  avoidHighRiskRoads: boolean;
  preferSaferRoute: boolean;
  maxAcceptableRisk: number;
}

export interface SafetyScoreBreakdown {
  accidentHistory: number; // 28%
  weather: number; // 24%
  roadCondition: number; // 18%
  timePattern: number; // 15%
  environmentalRisk: number; // 10%
  emergencyAccessibility: number; // 5%
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type ActiveTab = 'landing' | 'planner' | 'dashboard' | 'live-risks' | 'emergency' | 'analytics' | 'about';

export interface TTSWarningSettings {
  enabled: boolean;
  autoAnnounce: boolean;
  chimeEnabled: boolean;
  speechRate: number;
  volume: number;
  voiceEngine: 'gemini_ai' | 'browser';
  voiceName: string;
}

export interface GroundedPlace {
  title: string;
  uri: string;
  snippet?: string;
  address?: string;
}

// Community Road Reports Types
export type CommunityReportType = 
  | 'traffic' 
  | 'construction' 
  | 'potholes' 
  | 'waterlogging' 
  | 'heavy_rain' 
  | 'accident' 
  | 'visibility' 
  | 'blockage' 
  | 'other';

export type ConfidenceLevel = 'NEW_REPORT' | 'LIKELY' | 'HIGHLY_CONFIRMED';

export type ReportAgeCategory = 'FRESH' | 'RECENT' | 'MAY_HAVE_CHANGED' | 'OLD_REPORT';

export interface CommunityReportConfirmation {
  userId: string;
  timestamp: string;
}

export interface CommunityReport {
  id: string;
  type: CommunityReportType;
  roadName: string;
  roadSegmentId?: string;
  description: string;
  coordinates: [number, number];
  reportedAt: string;
  reportedBy: string;
  locationVerified: boolean;
  confirmations: CommunityReportConfirmation[];
  issuedMisleadingReports: number; // Count by this reporter
  confidenceScore: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  ageCategory: ReportAgeCategory;
  ageMinutes: number;
  active: boolean;
  userId?: string;
  photoUrl?: string;
}

export interface SafetyScoreBreakdownWithCommunity extends SafetyScoreBreakdown {
  communityRoadIntelligence: number; // Contribution to overall score
}
