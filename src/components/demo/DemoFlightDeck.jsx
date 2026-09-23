import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { usePlanStore } from '../../store/usePlanStore';
import { useBreakdownStore } from '../../store/useBreakdownStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useToastStore } from '../../store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';

// 10 Curated Presentation Beats for Complete Client Walkthrough
// Curated Presentation Beats for Complete Client Walkthrough
const GUIDE_STEPS = [
  {
    id: 1,
    title: 'Multi-Plant Operations Cockpit',
    module: 'Executive Overview',
    plant: 'Magnum Group',
    category: 'ALL',
    isShortPath: true,
    route: '/',
    badge: 'GROUP OVERVIEW',
    highlight: 'Unified Group Cockpit & SAP B1 Sync',
    description: 'Brings together Kharagpur rPET resin recycling and Hooghly PET preforms injection into a single operational cockpit.',
    takeaway: '40+ years manufacturing heritage, 45,000 MTPA recycling and 50,000 MTPA processing capacities in one view.',
    actionType: 'NAVIGATE'
  },
  {
    id: 2,
    title: 'Kharagpur Unit 3 Extrusion Cockpit',
    module: 'Module A · Kharagpur',
    plant: 'Module A',
    category: 'A',
    isShortPath: true,
    route: '/rpet',
    badge: 'SCADA TELEMETRY (S2)',
    highlight: 'Live 5.4 t/h Rate & Shift C Trip Alert',
    description: 'Monitors real-time extrusion line telemetry and immediately flags Shift C\'s 3.5h unplanned trip on EX-02.',
    takeaway: 'Quantifies ₹16.4 Lakh in food-grade resin held back by last night\'s downtime event.',
    actionType: 'NAVIGATE'
  },
  {
    id: 3,
    title: 'Automated 3-Shift Maintenance Roster',
    module: 'Module A · Kharagpur',
    plant: 'Module A',
    category: 'A',
    isShortPath: true,
    route: '/rpet/plan',
    badge: 'DAILY PLAN (F-A1)',
    highlight: 'Eliminates Manual Scheduling Spreadsheets',
    description: 'Auto-balances maintenance across Shifts A, B, and C with fixed dropdown technician selection and search for 199+ techs.',
    takeaway: 'Eliminates shift handover friction and highlights skill gaps before lines are impacted.',
    actionType: 'VIEW_PLAN'
  },
  {
    id: 4,
    title: 'Two-Way WhatsApp Field Dispatch',
    module: 'Module A · Kharagpur',
    plant: 'Module A',
    category: 'A',
    isShortPath: false,
    route: '/rpet/plan',
    badge: 'MOBILE DISPATCH (F-A3)',
    highlight: 'Work Order Dispatched to Ramesh with Checklist',
    description: 'Simulates field technician workflow on mobile. Dispatches work order #PA-1 to Ramesh, who uploads a 78.4°C FLIR thermal scan.',
    takeaway: 'Zero app installation required for technicians; photos and sign-offs sync straight to SAP B1.',
    actionType: 'WHATSAPP_FLOW'
  },
  {
    id: 5,
    title: 'Breakdown Board & Live Rupee Cost Clock',
    module: 'Module A · Kharagpur',
    plant: 'Module A',
    category: 'A',
    isShortPath: false,
    route: '/rpet/breakdowns',
    badge: 'INCIDENT RESPONSE (F-A2)',
    highlight: '6-Lane Kanban with Live Ticking Loss Clock',
    description: 'Tracks incidents from Assigned to In Progress, Waiting Spare, and Resolved. The live cost clock ticks upwards every second.',
    takeaway: 'Directly ties mechanical downtime duration to financial resin loss in real time.',
    actionType: 'NAVIGATE'
  },
  {
    id: 6,
    title: 'Reliability Pareto & Chronic Failure Analysis',
    module: 'Module A · Kharagpur',
    plant: 'Module A',
    category: 'A',
    isShortPath: true,
    route: '/rpet/reliability',
    badge: 'RELIABILITY PARETO (S1)',
    highlight: 'Extruder EX-02 Identified as Top Offender',
    description: 'Aggregates 90 days of downtime to identify Extruder EX-02 as the chronic bottleneck (34.5 hours down, 6 repeat events).',
    takeaway: 'Shows rising MTTR trend (2.5h to 5h) and repeat failure flags (6 events · 30 d rule).',
    actionType: 'NAVIGATE'
  },
  {
    id: 7,
    title: 'Natural Language Plant Copilot',
    module: 'Module A · Kharagpur',
    plant: 'Module A',
    category: 'A',
    isShortPath: false,
    route: '/rpet/ask',
    badge: 'PLANT COPILOT (F-A4)',
    highlight: 'SCADA & SAP B1 Grounded Intelligence',
    description: 'Allows plant engineers and managers to query maintenance logs, shift logs, and spare parts inventory in plain language.',
    takeaway: '8 prepared offline intents with interactive mini-charts and direct deep links.',
    actionType: 'NAVIGATE'
  },
  {
    id: 8,
    title: 'Hooghly Unit 1 Preforms Rejection Bill',
    module: 'Module B · Hooghly',
    plant: 'Module B',
    category: 'B',
    isShortPath: false,
    route: '/preform',
    badge: 'EXCEL REPLACEMENT (F-B1)',
    highlight: '6-Machine Status & Rejection Trend (1.7% to 2.16%)',
    description: 'Replaces Excel quality reporting with real-time shift analytics across all 6 injection systems and a live ₹55.69L MTD scrap bill.',
    takeaway: 'Exposes 3-week upward drift from 1.7% baseline to 2.16% driven by weight variation on H-03.',
    actionType: 'NAVIGATE'
  },
  {
    id: 9,
    title: 'Machine Drilldown & Night Shift Disparity',
    module: 'Module B · Hooghly',
    plant: 'Module B',
    category: 'B',
    isShortPath: false,
    route: '/preform/machine/H-03',
    badge: 'MACHINE DRILLDOWN (F-B2, S6)',
    highlight: 'Shift C Black Specks 1.6× & Defect Stacked Trend',
    description: 'Exposes Shift C black specks (2.9% vs 1.8%/1.9% day shifts) and surging weight variation rejects on H-03.',
    takeaway: 'Points directly to overnight resin dehumidification and dryer hopper handling.',
    actionType: 'NAVIGATE'
  },
  {
    id: 10,
    title: 'Multi-Machine Cavity Heatmap & Thermal Drift',
    module: 'Module B · Hooghly',
    plant: 'Module B',
    category: 'B',
    isShortPath: true,
    route: '/preform/cavity/H-03',
    badge: 'CAVITY HEATMAP (F-B3, S5)',
    highlight: 'Cavities 41 & 42 Overweight (+0.4g) Drift',
    description: 'Interactive heatmaps for 96, 72, and 4-cavity tooling. Highlights H-03 Cavities 41 & 42 thermal drift in Manifold Zone 3.',
    takeaway: '21-day drift line justifies mold servicing before defective preforms reach bottle blowers.',
    actionType: 'NAVIGATE'
  },
  {
    id: 11,
    title: 'Dynamic Financial Recalibration Engine',
    module: 'Financial Assumptions',
    plant: 'Global Engine',
    category: 'ALL',
    isShortPath: true,
    route: '/settings',
    badge: 'MONEY ENGINE (SEC 10)',
    highlight: 'Instant Global Recomputation across Both Plants',
    description: 'Demonstrates the dynamic financial engine. Adjusting line rate, resin price, contribution, or machine weights updates all figures.',
    takeaway: 'Invites the owner Devendra Surana to test his own numbers, turning the demo into their arithmetic.',
    actionType: 'FINANCIAL_UPDATE'
  }
];

export const DemoFlightDeck = () => {
  const AUTO_STEP_DURATION_SEC = 8;
  const autoPlayTimerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    isOpen,
    isMinimized,
    activeTab,
    moduleFilter,
    currentStepIdx: storedStepIdx,
    completedStepIds,
    isAutoPlay,
    countdown,
    setIsOpen,
    setIsMinimized,
    setActiveTab,
    setModuleFilter,
    setCurrentStepIdx,
    setCountdown,
    setIsAutoPlay,
    nextStep,
    prevStep,
    jumpToStep,
    restartGuide
  } = useDemoStore();

  const {
    assignTask,
    sendPhotoMessage,
    setActiveTechName,
    setPhoneScreen,
    resetToDemo: resetPlan
  } = usePlanStore();

  const { resetBreakdowns, reportBreakdown } = useBreakdownStore();
  const { setResinBenchmarkPrice } = useSettingsStore();
  const { addToast } = useToastStore();

  const filteredSteps = useMemo(() => {
    if (moduleFilter === 'A') return GUIDE_STEPS.filter((s) => s.category === 'A');
    if (moduleFilter === 'B') return GUIDE_STEPS.filter((s) => s.category === 'B');
    if (moduleFilter === 'SHORT') return GUIDE_STEPS.filter((s) => s.isShortPath);
    return GUIDE_STEPS;
  }, [moduleFilter]);

  const currentStepIdx = Math.min(Math.max(0, storedStepIdx || 0), Math.max(0, filteredSteps.length - 1));
  const currentStep = filteredSteps[currentStepIdx] || filteredSteps[0];
  const percentComplete = Math.round(((currentStepIdx + 1) / filteredSteps.length) * 100);

  // Execute navigation for a step without destructively wiping data
  const executeStep = (stepIndex, customList = filteredSteps, triggerSideEffects = false) => {
    const step = customList[stepIndex];
    if (!step) return;

    // 1. Navigate if route is different
    if (location.pathname !== step.route) {
      navigate(step.route);
    }

    // 2. Only trigger simulation mutations when explicitly requested
    if (triggerSideEffects) {
      if (step.actionType === 'VIEW_PLAN') {
        setPhoneScreen('inbox');
        addToast({
          title: `Step ${step.id}: ${step.title}`,
          message: 'Loaded 3-Shift Maintenance Roster and technician availability',
          type: 'info'
        });
      } else if (step.actionType === 'WHATSAPP_FLOW') {
        setPhoneScreen('chat');
        setActiveTechName('Ramesh');
        assignTask('A', 0, 'Ramesh');
        addToast({
          title: `Step ${step.id}: Work Order Dispatched`,
          message: 'Dispatched task #PA-1 to Ramesh via WhatsApp simulation',
          type: 'whatsapp'
        });

        setTimeout(() => {
          sendPhotoMessage('Ramesh');
          addToast({
            title: 'Field Response: FLIR Scan',
            message: 'Ramesh uploaded 78.4°C thermal scan synced to SAP B1',
            type: 'whatsapp'
          });
        }, 2500);
      } else if (step.actionType === 'FINANCIAL_UPDATE') {
        setResinBenchmarkPrice(115);
        addToast({
          title: `Step ${step.id}: Benchmark Updated`,
          message: 'Resin benchmark set to 115 INR/kg. All downtime costs updated.',
          type: 'success'
        });
      }
    }
  };

  const handleFilterChange = (newFilter) => {
    setModuleFilter(newFilter);
    setCurrentStepIdx(0);
    let newList = GUIDE_STEPS;
    if (newFilter === 'A') newList = GUIDE_STEPS.filter((s) => s.category === 'A');
    else if (newFilter === 'B') newList = GUIDE_STEPS.filter((s) => s.category === 'B');
    else if (newFilter === 'SHORT') newList = GUIDE_STEPS.filter((s) => s.isShortPath);
    executeStep(0, newList, false);
  };

  // Step navigation handlers - moves forward and backward without data loss
  const handleNextStep = () => {
    if (currentStepIdx < filteredSteps.length - 1) {
      const nextIdx = nextStep(filteredSteps.length);
      executeStep(nextIdx, filteredSteps, false);
      addToast({
        title: `Step ${filteredSteps[nextIdx].id}: ${filteredSteps[nextIdx].title}`,
        message: filteredSteps[nextIdx].highlight,
        type: 'info'
      });
    } else {
      // Reached the end - do not loop or reset automatically
      setIsAutoPlay(false);
      addToast({
        title: 'Walkthrough Completed',
        message: `You reached Step ${filteredSteps.length} of ${filteredSteps.length}. Click "Start Over" to restart.`,
        type: 'success'
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      const prevIdx = prevStep();
      executeStep(prevIdx, filteredSteps, false);
      addToast({
        title: `Step ${filteredSteps[prevIdx].id}: ${filteredSteps[prevIdx].title}`,
        message: filteredSteps[prevIdx].highlight,
        type: 'info'
      });
    }
  };

  const handleJumpToStep = (index) => {
    jumpToStep(index);
    executeStep(index, filteredSteps, false);
    addToast({
      title: `Step ${filteredSteps[index].id}: ${filteredSteps[index].title}`,
      message: filteredSteps[index].highlight,
      type: 'info'
    });
  };

  // Explicit Start Over: resets flow to Step 1 only on explicit user selection
  const handleStartOver = () => {
    restartGuide();
    executeStep(0, filteredSteps, false);
    addToast({
      title: 'Guide Restarted',
      message: 'Walkthrough restarted at Step 1. All application data preserved.',
      type: 'info'
    });
  };

  // Slow Auto-Advance Timer Logic (8s per step)
  useEffect(() => {
    if (!isAutoPlay || !isOpen) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (currentStepIdx < filteredSteps.length - 1) {
            const nextIdx = nextStep(filteredSteps.length);
            executeStep(nextIdx, filteredSteps, false);
            return AUTO_STEP_DURATION_SEC;
          } else {
            setIsAutoPlay(false);
            return AUTO_STEP_DURATION_SEC;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, isOpen, currentStepIdx, filteredSteps]);

  // Full reset of demo environment & factory mock data
  const handleResetAll = () => {
    resetPlan();
    resetBreakdowns();
    setResinBenchmarkPrice(108);
    restartGuide();
    navigate('/');
    addToast({
      title: 'Demo Environment Reset',
      message: 'Restored initial rosters, chats, breakdowns, 108 INR/kg price, and reset guide to Step 1',
      type: 'info'
    });
  };

  return (
    <>
      {/* Floating Launcher Button - Positioned safely above persistent footer */}
      <div className="fixed bottom-9 sm:bottom-11 right-3 sm:right-5 z-40">
        <button
          onClick={() => {
            const nextState = !isOpen;
            setIsOpen(nextState);
            if (nextState) setIsMinimized(false);
          }}
          className="bg-[#143a72] hover:bg-[#0c2347] dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-3.5 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/80 dark:border-slate-700 cursor-pointer transition-all hover:scale-105 active:scale-95"
          title={isOpen ? 'Close Demo Deck' : `Resume Demo Deck (Step ${currentStepIdx + 1} of ${filteredSteps.length})`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-heading text-[11px] font-bold tracking-tight">
            {isOpen ? 'Close Demo Deck' : 'Demo Deck'}
          </span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
            {currentStepIdx + 1}/{filteredSteps.length}
          </span>
        </button>
      </div>

      {/* Slide-Up Demo Guide Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className={`fixed bottom-20 sm:bottom-22 right-2 sm:right-5 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-700 overflow-hidden flex flex-col transition-all ${isMinimized
                ? 'w-[320px] sm:w-[360px] p-2.5'
                : 'w-[340px] sm:w-[410px] max-w-[94vw] p-3 sm:p-4'
              }`}
          >
            {/* Minimized Pill View for unobtrusive browsing */}
            {isMinimized ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono font-bold bg-[#143a72] dark:bg-blue-600 text-white px-1.5 py-0.5 rounded shrink-0">
                    Step {currentStepIdx + 1}/{filteredSteps.length}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {currentStep.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStepIdx === 0}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 cursor-pointer text-[10px] font-bold"
                    title="Previous Step"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={currentStepIdx === filteredSteps.length - 1}
                    className="p-1 rounded bg-[#143a72] hover:bg-[#0c2347] dark:bg-blue-600 dark:hover:bg-blue-500 text-white disabled:opacity-30 cursor-pointer text-[10px] font-bold px-2"
                    title="Next Step"
                  >
                    Next
                  </button>
                  <button
                    onClick={handleStartOver}
                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-[10px] font-bold cursor-pointer"
                    title="Start Over from Step 1"
                  >
                    Restart
                  </button>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer text-xs"
                    title="Expand Guide"
                  >
                    Expand
                  </button>
                </div>
              </div>
            ) : (
              /* Expanded Full Step-by-Step Guide */
              <>
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#143a72] dark:bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-[10px]">
                      POC
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        Demo Flight Deck
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Guided Flow · Step {currentStepIdx + 1} of {filteredSteps.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleStartOver}
                      className="text-slate-500 dark:text-slate-400 hover:text-[#143a72] dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors border border-slate-200 dark:border-slate-700"
                      title="Restart guide back to Step 1"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                      title="Minimize panel"
                    >
                      Minimize
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                      title="Close panel (current step is preserved)"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Tab Switcher: Step Guide vs Direct Scenarios */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mt-2">
                  <button
                    onClick={() => setActiveTab('guide')}
                    className={`flex-1 pb-1.5 text-center text-xs font-bold transition-colors cursor-pointer ${activeTab === 'guide'
                        ? 'text-[#143a72] dark:text-blue-400 border-b-2 border-[#143a72] dark:border-blue-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                  >
                    Step-by-Step Guide ({currentStepIdx + 1}/{filteredSteps.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('scenarios')}
                    className={`flex-1 pb-1.5 text-center text-xs font-bold transition-colors cursor-pointer ${activeTab === 'scenarios'
                        ? 'text-[#143a72] dark:text-blue-400 border-b-2 border-[#143a72] dark:border-blue-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                  >
                    Quick Scenarios
                  </button>
                </div>

                {/* Tab 1: Step-by-Step Guided Tour */}
                {activeTab === 'guide' && (
                  <div className="pt-2.5 pb-1 flex flex-col space-y-2.5">
                    {/* Module Scope Filter Pills: All | Module A | Module B | 25-Min Short */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800">
                      {[
                        { id: 'ALL', label: `All (${GUIDE_STEPS.length})` },
                        { id: 'A', label: 'Module A · Kharagpur (6)' },
                        { id: 'B', label: 'Module B · Hooghly (3)' },
                        { id: 'SHORT', label: '25-Min Path (5)' }
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => handleFilterChange(pill.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${moduleFilter === pill.id
                              ? 'bg-[#143a72] dark:bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>

                    {/* Overall Progress and Stepper Header */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#143a72] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                            STEP {(currentStepIdx + 1).toString().padStart(2, '0')} OF {filteredSteps.length.toString().padStart(2, '0')}
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                            {percentComplete}% COMPLETED
                          </span>
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold truncate ml-2">
                          {currentStep.module}
                        </span>
                      </div>

                      {/* Continuous Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-[#143a72] to-emerald-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>

                      {/* Interactive Stepper Dots Track */}
                      <div className="flex gap-1 w-full">
                        {filteredSteps.map((step, idx) => {
                          const isCompleted = (completedStepIds || []).includes(step.id) || idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          return (
                            <button
                              key={step.id}
                              onClick={() => handleJumpToStep(idx)}
                              title={`Step ${idx + 1}: ${step.title} (${isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Upcoming'})`}
                              className={`h-2 flex-1 rounded-full transition-all cursor-pointer relative ${isCurrent
                                  ? 'bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-800 shadow-xs'
                                  : isCompleted
                                    ? 'bg-[#143a72] dark:bg-blue-600'
                                    : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
                                }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Route Alignment Indicator if viewing another screen */}
                    {location.pathname !== currentStep.route && (
                      <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg px-2.5 py-1.5 text-[11px] text-amber-900 dark:text-amber-200">
                        <span className="truncate">Active screen: <code className="font-mono text-[10px] bg-amber-100/80 dark:bg-amber-900/60 px-1 py-0.5 rounded">{location.pathname}</code></span>
                        <button
                          onClick={() => navigate(currentStep.route)}
                          className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-0.5 rounded text-[10px] cursor-pointer ml-2 transition-colors"
                        >
                          Go to Step Screen
                        </button>
                      </div>
                    )}

                    {/* Active Step Content Card */}
                    <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold bg-[#143a72]/10 dark:bg-blue-950/50 text-[#143a72] dark:text-blue-300 px-2 py-0.5 rounded">
                          {currentStep.badge}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 font-medium">
                          {currentStep.route}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {currentStep.title}
                      </h4>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentStep.description}
                      </p>

                      <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white">Key Focus: </span>
                        {currentStep.takeaway}
                      </div>
                    </div>

                    {/* Slow Auto-Advance Bar & Control */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-lg p-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!isAutoPlay) {
                              setCountdown(AUTO_STEP_DURATION_SEC);
                            }
                            setIsAutoPlay(!isAutoPlay);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${isAutoPlay
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                            }`}
                        >
                          {isAutoPlay ? 'Pause Auto' : `Slow Auto (${AUTO_STEP_DURATION_SEC}s)`}
                        </button>
                        {isAutoPlay && (
                          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                            Next in {countdown}s
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isAutoPlay ? 'Auto-advancing' : 'Paced for manual talk'}
                      </span>
                    </div>

                    {/* Progress Fill Bar when Auto-Play is Active */}
                    {isAutoPlay && (
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                          style={{ width: `${((AUTO_STEP_DURATION_SEC - countdown) / AUTO_STEP_DURATION_SEC) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* One-by-One Manual Navigation Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handlePrevStep}
                        disabled={currentStepIdx === 0}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none font-bold text-xs cursor-pointer transition-all text-center"
                      >
                        Previous Step
                      </button>
                      {currentStepIdx < filteredSteps.length - 1 ? (
                        <button
                          onClick={handleNextStep}
                          className="w-full py-2 px-3 rounded-lg bg-[#143a72] hover:bg-[#0c2347] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition-all shadow-xs text-center"
                        >
                          Next Step
                        </button>
                      ) : (
                        <button
                          onClick={handleStartOver}
                          className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-all shadow-xs text-center flex items-center justify-center gap-1.5"
                        >
                          <span>Start Over (Step 1)</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Direct 1-Click Quick Scenarios */}
                {activeTab === 'scenarios' && (
                  <div className="space-y-1.5 py-2 overflow-y-auto max-h-[50vh] pr-0.5">
                    {/* Scenario 1 */}
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl p-2 border border-emerald-200 dark:border-emerald-900/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[11px] text-emerald-950 dark:text-emerald-200">
                          1. WhatsApp Technician Flow
                        </span>
                        <span className="text-[8.5px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1 rounded font-bold">
                          S1-S2
                        </span>
                      </div>
                      <p className="text-[9.5px] text-emerald-800/80 dark:text-emerald-300 mb-1.5 leading-tight">
                        Dispatches task, simulates FLIR scan upload, and sign-off.
                      </p>
                      <button
                        onClick={() => {
                          handleJumpToStep(3);
                          executeStep(3, filteredSteps, true);
                        }}
                        className="w-full bg-[#075E54] hover:bg-[#064e46] text-white text-[10px] font-bold py-1 rounded-md cursor-pointer"
                      >
                        Trigger WhatsApp Flow
                      </button>
                    </div>

                    {/* Scenario 2 */}
                    <div className="bg-rose-50/70 dark:bg-rose-950/30 rounded-xl p-2 border border-rose-200 dark:border-rose-900/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[11px] text-rose-950 dark:text-rose-200">
                          2. Incident & Ticking Cost Clock
                        </span>
                        <span className="text-[8.5px] font-mono bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-1 rounded font-bold">
                          S3
                        </span>
                      </div>
                      <p className="text-[9.5px] text-rose-800/80 dark:text-rose-300 mb-1.5 leading-tight">
                        EX-02 trip on Kanban with live rupee cost clock.
                      </p>
                      <button
                        onClick={() => {
                          handleJumpToStep(4);
                          reportBreakdown('EX-02', 'Coperion gearbox high vibration alarm (>4.5 mm/s)', 'bearing wear', 'P1', 'Ramesh');
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1 rounded-md cursor-pointer"
                      >
                        Trigger Incident Cost Clock
                      </button>
                    </div>

                    {/* Scenario 3 */}
                    <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-xl p-2 border border-blue-200 dark:border-blue-900/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[11px] text-blue-950 dark:text-blue-200">
                          3. Cavities 41-42 Drift
                        </span>
                        <span className="text-[8.5px] font-mono bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-1 rounded font-bold">
                          S4-S5
                        </span>
                      </div>
                      <p className="text-[9.5px] text-blue-800/80 dark:text-blue-300 mb-1.5 leading-tight">
                        Inspects 72-cavity drift and flags mold servicing.
                      </p>
                      <button
                        onClick={() => handleJumpToStep(8)}
                        className="w-full bg-[#143a72] hover:bg-[#0c2347] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[10px] font-bold py-1 rounded-md cursor-pointer"
                      >
                        Inspect Cavity Drift
                      </button>
                    </div>

                    {/* Scenario 4 */}
                    <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-xl p-2 border border-amber-200 dark:border-amber-900/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[11px] text-amber-950 dark:text-amber-200">
                          4. Financial Recalculation
                        </span>
                        <span className="text-[8.5px] font-mono bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1 rounded font-bold">
                          Global
                        </span>
                      </div>
                      <p className="text-[9.5px] text-amber-800/80 dark:text-amber-300 mb-1.5 leading-tight">
                        Sets resin price to 115 INR/kg and recomputes figures.
                      </p>
                      <button
                        onClick={() => {
                          handleJumpToStep(9);
                          executeStep(9, filteredSteps, true);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold py-1 rounded-md cursor-pointer"
                      >
                        Update Benchmark to 115 INR
                      </button>
                    </div>

                    {/* Scenario 5 */}
                    <div className="bg-purple-50/70 dark:bg-purple-950/30 rounded-xl p-2 border border-purple-200 dark:border-purple-900/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[11px] text-purple-950 dark:text-purple-200">
                          5. AI Maintenance Copilot
                        </span>
                        <span className="text-[8.5px] font-mono bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 px-1 rounded font-bold">
                          Copilot
                        </span>
                      </div>
                      <p className="text-[9.5px] text-purple-800/80 dark:text-purple-300 mb-1.5 leading-tight">
                        Natural language queries over logs & spare parts.
                      </p>
                      <button
                        onClick={() => handleJumpToStep(6)}
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold py-1 rounded-md cursor-pointer"
                      >
                        Open Plant Copilot
                      </button>
                    </div>
                  </div>
                )}

                {/* Compact Footer with Environment Reset */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-mono">Progress Saved</span>
                    <button
                      onClick={handleStartOver}
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer underline"
                    >
                      Start Over
                    </button>
                  </div>
                  <button
                    onClick={handleResetAll}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-semibold cursor-pointer underline"
                    title="Reset factory data, technician rosters, and guide back to initial demo state"
                  >
                    Reset All Demo Data
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
