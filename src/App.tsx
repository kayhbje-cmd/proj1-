import React, { useState } from 'react';
import {
  Navbar,
} from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { JourneyPlanner } from './components/JourneyPlanner';
import { RiskScoreCircular } from './components/RiskScoreCircular';
import { RiskMap } from './components/RiskMap';
import { RiskTimeline } from './components/RiskTimeline';
import { WeatherRiskCard } from './components/WeatherRiskCard';
import { AccidentRiskCard } from './components/AccidentRiskCard';
import { TimeAwareRiskCard } from './components/TimeAwareRiskCard';
import { HazardListCard } from './components/HazardListCard';
import { AlternativeRoutesCard } from './components/AlternativeRoutesCard';
import { ActionableAlerts } from './components/ActionableAlerts';
import { TTSWarningModule } from './components/TTSWarningModule';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { EmergencyView } from './components/EmergencyView';
import { LiveRisksView } from './components/LiveRisksView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AboutView } from './components/AboutView';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { SafetyReportModal } from './components/SafetyReportModal';
import { FamilyShareModal } from './components/FamilyShareModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CommunityReportsCard } from './components/CommunityReportsCard';
import { CommunityReportSubmitModal } from './components/CommunityReportSubmitModal';
import { CommunityReportDetailPanel } from './components/CommunityReportDetailPanel';

import {
  ActiveTab,
  JourneyPlanInput,
  RouteOption,
  RouteSegment,
  RoadHazard,
  AccidentHotspot,
  CommunityReport,
} from './types';
import {
  ROUTES_DATA,
  MOCK_HAZARDS,
  MOCK_HOTSPOTS,
  MOCK_FACILITIES,
  MOCK_WEATHER,
  TIME_SLOTS_DATA,
  DEMO_PRESETS,
  MOCK_COMMUNITY_REPORTS,
} from './data/mockRoutes';
import {
  Sparkles,
  FileText,
  PhoneCall,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  Share2,
  Smartphone,
} from 'lucide-react';

const CURRENT_DEMO_USER_ID = 'demo-user-current';

export default function App() {
  // Navigation & View State - Default to false for citizen-centric clean white theme
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasAnalyzedJourney, setHasAnalyzedJourney] = useState(true);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  // Journey Input state
  const [journeyInput, setJourneyInput] = useState<JourneyPlanInput>({
    from: 'Nagpur Zero Mile Stone, Sitabuldi',
    to: 'Wardha Collectorate Circle, Wardha',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '18:00',
    vehicleType: 'car',
    avoidHighRiskRoads: true,
    preferSaferRoute: false,
    maxAcceptableRisk: 70,
  });

  // Active Route & Telemetry Data
  const [activeRouteId, setActiveRouteId] = useState<string>('route-a');
  const [hazards, setHazards] = useState<RoadHazard[]>(MOCK_HAZARDS);
  const [selectedSegment, setSelectedSegment] = useState<RouteSegment | null>(null);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(MOCK_COMMUNITY_REPORTS);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);

  // Modals & Drawers
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommunityReportSubmitOpen, setIsCommunityReportSubmitOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepText, setAnalysisStepText] = useState('');

  const currentRoute = ROUTES_DATA.find((r) => r.id === activeRouteId) || ROUTES_DATA[0];

  // Handle Journey Submission with multi-stage scan animation
  const handleAnalyzeJourney = (input: JourneyPlanInput) => {
    setIsAnalyzing(true);
    setJourneyInput(input);

    const steps = [
      'Ingesting historical accident blackspot clusters...',
      'Synchronizing Doppler rainfall & visibility sensors...',
      'Calculating pavement friction & braking distance...',
      'Synthesizing multi-source composite safety score...',
    ];

    let currentStep = 0;
    setAnalysisStepText(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisStepText(steps[currentStep]);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setHasAnalyzedJourney(true);

        // If user chose "prefer safer route", automatically select Route B
        if (input.preferSaferRoute) {
          setActiveRouteId('route-b');
        } else {
          setActiveRouteId('route-a');
        }

        setActiveTab('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 450);
  };

  // Switch demo corridor from presets
  const handleExploreDemo = (presetIndex: number = 0) => {
    const preset = DEMO_PRESETS[presetIndex];
    if (preset) {
      setJourneyInput((prev) => ({
        ...prev,
        from: preset.from,
        to: preset.to,
      }));
    }
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDepartureTime = (timeStr?: string) => {
    if (!timeStr) return;
    const str = String(timeStr);
    // Dynamic simulated feedback when clicking different departure hours
    if (str.includes('6:00 AM') || str.includes('06:00') || str.includes('6:00')) {
      setActiveRouteId('route-b'); // Show lower risk route
    }
    setJourneyInput((prev) => ({
      ...prev,
      departureTime: str.includes('AM') || str === '06:00' ? '06:00' : '18:00',
    }));
  };

  const handleAddHazard = (newHazard: RoadHazard) => {
    setHazards((prev) => [newHazard, ...prev]);
  };

  // Community Report Handlers
  const handleConfirmReport = (reportId: string) => {
    setCommunityReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          // A reporter's own confirmation is never treated as independent evidence.
          if (r.reportedBy === CURRENT_DEMO_USER_ID) return r;
          // Add confirmation from current user (simulated as 'user_current')
          const updated = { ...r };
          if (!updated.confirmations.some((c) => c.userId === CURRENT_DEMO_USER_ID)) {
            updated.confirmations = [
              ...updated.confirmations,
              { userId: CURRENT_DEMO_USER_ID, timestamp: new Date().toISOString() },
            ];
          }
          return updated;
        }
        return r;
      })
    );
  };

  const handleReportMisleading = (reportId: string) => {
    // In a real system, this would flag the report and possibly the user
    setCommunityReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, active: false }; // Deactivate for demo
        }
        return r;
      })
    );
  };

  const handleSubmitCommunityReport = (report: {
    type: CommunityReport['type'];
    roadName: string;
    roadSegmentId?: string;
    description: string;
    coordinates: [number, number];
    locationVerified: boolean;
    photoUrl?: string;
  }) => {
    const newReport: CommunityReport = {
      id: `cr-${Date.now()}`,
      type: report.type,
      roadName: report.roadName,
      roadSegmentId: report.roadSegmentId,
      description: report.description,
      coordinates: report.coordinates,
      reportedAt: new Date().toISOString(),
      reportedBy: CURRENT_DEMO_USER_ID,
      locationVerified: report.locationVerified,
      confirmations: [],
      issuedMisleadingReports: 0,
      confidenceScore: 35,
      confidenceLevel: 'NEW_REPORT',
      ageCategory: 'FRESH',
      ageMinutes: 0,
      active: true,
      photoUrl: report.photoUrl,
    };
    setCommunityReports((prev) => {
      // The demo follows the same rule a backend would: near-identical, recent
      // reports are grouped into an existing observation instead of duplicated.
      const matchingReport = prev.find((existing) =>
        existing.active &&
        existing.type === newReport.type &&
        existing.roadName.trim().toLowerCase() === newReport.roadName.trim().toLowerCase() &&
        Date.now() - new Date(existing.reportedAt).getTime() < 2 * 60 * 60 * 1000,
      );
      if (!matchingReport) return [newReport, ...prev];

      return prev.map((existing) => existing.id === matchingReport.id
        ? {
            ...existing,
            confirmations: existing.confirmations.some((confirmation) => confirmation.userId === CURRENT_DEMO_USER_ID)
              ? existing.confirmations
              : [...existing.confirmations, { userId: CURRENT_DEMO_USER_ID, timestamp: new Date().toISOString() }],
          }
        : existing,
      );
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} font-sans transition-colors`}>
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        isMobileSimulator={isMobileSimulator}
        onToggleMobileSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        hasAnalyzedJourney={hasAnalyzedJourney}
      />

      {/* Analysis Loading Screen Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl border border-slate-200 flex flex-col items-center">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading mb-1">
              Analyzing Highway Risks
            </h3>
            <p className="text-xs font-medium text-emerald-700 h-6">
              {analysisStepText}
            </p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-emerald-600 animate-[pulse_1s_ease-in-out_infinite] w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Main Container - Wrapped in Mobile Simulator if enabled */}
      <div className={isMobileSimulator ? 'py-8 px-4 flex justify-center bg-slate-200/70 min-h-screen' : ''}>
        <div className={isMobileSimulator ? 'w-full max-w-[420px] bg-white rounded-[44px] shadow-2xl border-[8px] border-slate-800 overflow-hidden relative' : ''}>
          
          {/* Mobile Simulator Notch */}
          {isMobileSimulator && (
            <div className="w-full bg-slate-800 text-white text-[11px] py-2 px-6 flex items-center justify-between z-30">
              <span className="font-bold">9:41</span>
              <div className="w-24 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1.5 font-bold">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Main Content Router */}
          <main className="pb-24 sm:pb-28">
            
            {/* VIEW 1: HERO LANDING */}
            {activeTab === 'landing' && (
              <div>
                <HeroLanding
                  onPlanJourney={() => {
                    setActiveTab('planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onExploreDemo={handleExploreDemo}
                />
                
                {/* Live Corridor Demonstration Map Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-10">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Real-Time Corridor Telemetry
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900">
                          Active Risk Heatmap: Nagpur — Wardha (NH-44)
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-center">
                        Verified Citizen Radar
                      </span>
                    </div>

                    <RiskMap
                      currentRoute={currentRoute}
                      allRoutes={ROUTES_DATA}
                      onSelectRoute={(id) => setActiveRouteId(id)}
                      hotspots={MOCK_HOTSPOTS}
                      hazards={hazards}
                      emergencyFacilities={MOCK_FACILITIES}
                      selectedSegment={selectedSegment}
                      onSelectSegment={setSelectedSegment}
                      isDarkMode={isDarkMode}
                      communityReports={communityReports}
                      onSelectReport={setSelectedReport}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: JOURNEY PLANNER */}
            {activeTab === 'planner' && (
              <JourneyPlanner
                initialInput={journeyInput}
                onAnalyzeJourney={handleAnalyzeJourney}
                isAnalyzing={isAnalyzing}
              />
            )}

            {/* VIEW 3: SAFETY DASHBOARD (Core Feature) */}
            {activeTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
                
                {/* Dashboard Sub-Header & Controls */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                        Active Highway Assessment
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      {journeyInput.from.split(',')[0]} ➔ {journeyInput.to.split(',')[0]}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Departure: {journeyInput.departureDate} at {journeyInput.departureTime} • Vehicle: <span className="capitalize font-bold text-slate-900">{journeyInput.vehicleType}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      id="dashboard-btn-edit-plan"
                      type="button"
                      onClick={() => setActiveTab('planner')}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <span>Modify Trip</span>
                    </button>

                    <button
                      id="dashboard-btn-share-family"
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Share with Family</span>
                    </button>

                    <button
                      id="dashboard-btn-open-dossier"
                      type="button"
                      onClick={() => setIsReportModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Print Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Prominent Actionable Alerts Banner */}
                <ActionableAlerts
                  hazards={hazards}
                  onSelectHazard={(h) => {
                    const matchedSeg = currentRoute.segments.find(
                      (s) => h.distanceAheadKm >= s.fromKm && h.distanceAheadKm <= s.toKm
                    );
                    if (matchedSeg) setSelectedSegment(matchedSeg);
                  }}
                />

                {/* Hands-Free Audible Warnings Module */}
                <TTSWarningModule
                  currentRoute={currentRoute}
                  selectedSegment={selectedSegment}
                  onSelectSegment={setSelectedSegment}
                  isDarkMode={isDarkMode}
                />

                {/* 1. Overall Risk Score Circular Card with Sub-scores */}
                <RiskScoreCircular
                  currentRoute={currentRoute}
                  origin={journeyInput.from}
                  destination={journeyInput.to}
                />

                {/* 2. Interactive Risk Map */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Interactive Spatial Analysis
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Route Risk Map & Hazard Overlay
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">
                      Tap road segments or markers to highlight risk factor
                    </span>
                  </div>

                  <RiskMap
                    currentRoute={currentRoute}
                    allRoutes={ROUTES_DATA}
                    onSelectRoute={(id) => setActiveRouteId(id)}
                    hotspots={MOCK_HOTSPOTS}
                    hazards={hazards}
                    emergencyFacilities={MOCK_FACILITIES}
                    selectedSegment={selectedSegment}
                    onSelectSegment={setSelectedSegment}
                    isDarkMode={isDarkMode}
                    communityReports={communityReports}
                    onSelectReport={setSelectedReport}
                  />
                </div>

                {/* 3. Sequential Kilometer-by-Kilometer Timeline */}
                <RiskTimeline
                  segments={currentRoute.segments}
                  selectedSegment={selectedSegment}
                  onSelectSegment={setSelectedSegment}
                  departureTime={journeyInput.departureTime}
                />

                {/* 4. Alternative Routes Comparison */}
                <AlternativeRoutesCard
                  routes={ROUTES_DATA}
                  activeRouteId={activeRouteId}
                  onSelectRoute={(id) => {
                    setActiveRouteId(id);
                    setSelectedSegment(null);
                  }}
                />

                {/* 5. Weather Intelligence & Impact Analysis */}
                <WeatherRiskCard weather={MOCK_WEATHER} />

                {/* 6. Accident Risk & Historical Hotspots */}
                <AccidentRiskCard
                  hotspots={MOCK_HOTSPOTS}
                  onFocusHotspot={(h) => {
                    const seg = currentRoute.segments.find((s) => s.fromKm <= 20 && s.toKm >= 15);
                    if (seg) setSelectedSegment(seg);
                  }}
                />

                {/* 7. Departure Time Comparison Simulator */}
                <TimeAwareRiskCard
                  timeSlots={TIME_SLOTS_DATA}
                  currentTime={journeyInput.departureTime}
                  onSelectDepartureTime={handleSelectDepartureTime}
                />

                {/* 8. Live Hazards List */}
                <HazardListCard
                  hazards={hazards}
                  onSelectHazard={(h) => {
                    const seg = currentRoute.segments.find(
                      (s) => h.distanceAheadKm >= s.fromKm && h.distanceAheadKm <= s.toKm
                    );
                    if (seg) setSelectedSegment(seg);
                  }}
                />

                {/* 9. Community Road Reports */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Real-Time Community Intelligence
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Community Road Reports
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsCommunityReportSubmitOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>+ Report Condition</span>
                    </button>
                  </div>

                  <CommunityReportsCard
                    reports={communityReports}
                    onConfirmReport={handleConfirmReport}
                    onReportMisleading={handleReportMisleading}
                    isDarkMode={isDarkMode}
                  />
                </div>

              </div>
            )}

            {/* VIEW 4: LIVE RISKS */}
            {activeTab === 'live-risks' && (
              <LiveRisksView
                hazards={hazards}
                onAddHazard={handleAddHazard}
                currentRoute={currentRoute}
                allRoutes={ROUTES_DATA}
                onSelectRoute={(id) => setActiveRouteId(id)}
                hotspots={MOCK_HOTSPOTS}
                emergencyFacilities={MOCK_FACILITIES}
                selectedSegment={selectedSegment}
                onSelectSegment={setSelectedSegment}
                isDarkMode={isDarkMode}
              />
            )}

            {/* VIEW 5: EMERGENCY VIEW */}
            {activeTab === 'emergency' && (
              <EmergencyView
                facilities={MOCK_FACILITIES}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {/* VIEW 6: ANALYTICS DASHBOARD */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                hotspots={MOCK_HOTSPOTS}
                hazards={hazards}
              />
            )}

            {/* VIEW 7: ABOUT & PS ID R1-03 */}
            {activeTab === 'about' && <AboutView />}

          </main>

        </div>
      </div>

      {/* Floating AI Safety Assistant Trigger Button (Desktop & Mobile) */}
      <div className="fixed bottom-20 lg:bottom-6 right-5 z-40">
        <button
          id="btn-floating-ai-assistant"
          type="button"
          onClick={() => setIsAIOpen(true)}
          className="p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xl flex items-center gap-2.5 transition-all hover:scale-103 active:scale-95 cursor-pointer border border-emerald-600/50"
          title="Open SafeRoute AI Safety Copilot"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <span className="hidden sm:inline font-heading">Citizen Copilot</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        currentRoute={currentRoute}
        origin={journeyInput.from}
        destination={journeyInput.to}
        vehicleType={journeyInput.vehicleType}
      />

      {/* Emergency SOS Dialog */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentLocationName={`${journeyInput.from.split(',')[0]} ➔ ${journeyInput.to.split(',')[0]} (NH-44 Sector)`}
      />

      {/* Safety Report Dossier Modal */}
      <SafetyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentRoute={currentRoute}
        origin={journeyInput.from}
        destination={journeyInput.to}
        departureTime={journeyInput.departureTime}
        vehicleType={journeyInput.vehicleType}
      />

      {/* Family Share Modal */}
      <FamilyShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentRoute={currentRoute}
        origin={journeyInput.from}
        destination={journeyInput.to}
        vehicleType={journeyInput.vehicleType}
        departureTime={journeyInput.departureTime}
      />

      {/* Community Report Submit Modal */}
      <CommunityReportSubmitModal
        isOpen={isCommunityReportSubmitOpen}
        onClose={() => setIsCommunityReportSubmitOpen(false)}
        onSubmit={handleSubmitCommunityReport}
        availableSegments={currentRoute.segments}
        isDarkMode={isDarkMode}
      />

      {/* Community Report Detail Panel */}
      {selectedReport && (
        <div className="fixed inset-0 z-40" onClick={() => setSelectedReport(null)}>
          <CommunityReportDetailPanel
            report={selectedReport}
            segment={currentRoute.segments.find((s) => s.id === selectedReport.roadSegmentId) || null}
            onClose={() => setSelectedReport(null)}
            onConfirm={handleConfirmReport}
            onReportMisleading={handleReportMisleading}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

    </div>
  );
}
