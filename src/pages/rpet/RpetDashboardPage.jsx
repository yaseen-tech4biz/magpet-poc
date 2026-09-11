import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { Card } from '../../components/ui/Card';
import { KpiCard } from '../../components/ui/KpiCard';
import { DialGauge } from '../../components/ui/DialGauge';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useBreakdownStore } from '../../store/useBreakdownStore';
import { usePlanStore } from '../../store/usePlanStore';

export const RpetDashboardPage = () => {
  const navigate = useNavigate();
  const { tph, formatResinHeld, formatContribLost, resinBenchmarkPrice } = useSettingsStore();
  const { activeJobs, currentTime, tickTime, updateJobState } = useBreakdownStore();
  const { assignTask } = usePlanStore();

  // Simulated live telemetry line rate fluctuation
  const [liveLineRate, setLiveLineRate] = useState(5.4);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedPmAsset, setSelectedPmAsset] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      tickTime();
      // subtle natural line rate noise around 5.4 t/h
      const noise = (Math.random() - 0.5) * 0.08;
      setLiveLineRate(Number((5.4 + noise).toFixed(2)));
    }, 2500);
    return () => clearInterval(timer);
  }, [tickTime]);

  const criticalOpenCount = activeJobs.filter((j) => j.crit).length;

  return (
    <Shell
      moduleType="A"
      crumb={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span><b>Kharagpur Unit 3</b> · rPET Resin · Today</span>
          <button
            onClick={() => setShowTelemetryModal(true)}
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">Live SCADA Telemetry Stream</span>
            <span className="font-mono text-[9px] text-emerald-600 ml-1">PLC 104.2.1</span>
          </button>
        </div>
      }
    >
      {/* 1. Hero Incident Card (Interactive Click-Through to Breakdown Board) */}
      <div
        onClick={() => navigate('/rpet/breakdowns')}
        className="bg-rose-50/70 hover:bg-rose-50 border border-rose-200 hover:border-rose-400 rounded-xl p-5 mb-6 card-shadow hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        title="Click to inspect this incident on Breakdown Board"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-100 group-hover:bg-rose-200 flex items-center justify-center font-bold text-rose-600 text-lg shrink-0 transition-colors">
            !
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                Plant Story S2
              </span>
              <h2 className="text-base font-bold text-slate-900 font-heading group-hover:text-rose-900 transition-colors">
                EX-02 tripped last night · Gearbox bearing over temperature
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              02:40 to 06:10 · 3.5 h down · resolved by Sunil (shift C) · 6th gearbox event in 90 days
            </p>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-rose-100 flex items-center sm:flex-col justify-between sm:justify-center">
          <div>
            <div className="font-mono text-2xl font-bold text-rose-600">
              {formatResinHeld(3.5)}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
              resin value held back
            </div>
          </div>
          <div className="text-xs font-semibold text-rose-700 group-hover:translate-x-1 transition-transform sm:mt-1 flex items-center gap-1">
            <span>Inspect Incident</span>
          </div>
        </div>
      </div>

      {/* 2. 4 Standard KPI Tiles (All Clickable) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div onClick={() => setShowTelemetryModal(true)} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <KpiCard
            value={liveLineRate}
            unit="t/h"
            label="Line rate now"
            trendText={`target ${tph} t/h · live PLC`}
            trendType="neutral"
            colorTheme="green"
          />
        </div>
        <div onClick={() => navigate('/rpet/breakdowns')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <KpiCard
            value={activeJobs.length}
            label="Open jobs"
            trendText={`${criticalOpenCount} on a critical asset`}
            trendType="up"
            colorTheme="red"
          />
        </div>
        <div onClick={() => navigate('/rpet/reliability')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <KpiCard
            value="31.5"
            unit="h"
            label="Downtime MTD"
            trendText={`${formatResinHeld(31.5)} resin value`}
            trendType="up"
            colorTheme="default"
          />
        </div>
        <div onClick={() => navigate('/rpet/plan')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <KpiCard
            value="62%"
            label="PM compliance 90 d"
            trendText="worst on utilities"
            trendType="amber"
            colorTheme="amber"
          />
        </div>
      </div>

      {/* 3. Two Column Section: Live Open Jobs & PM Compliance Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Open Jobs Live Feed (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Open Jobs"
            rightElement={
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  LIVE ({activeJobs.length})
                </span>
                <button
                  onClick={() => navigate('/rpet/breakdowns')}
                  className="text-xs font-semibold text-[#143a72] hover:underline"
                >
                  Board view
                </button>
              </div>
            }
          >
            <div className="divide-y divide-slate-100">
              {activeJobs.map((job) => {
                const liveHours = job.startTime
                  ? Math.max(0.1, (currentTime - job.startTime) / 3600000)
                  : job.sinceHoursAgo || 1.0;

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4 hover:bg-slate-50/80 -mx-4 px-4 rounded-lg cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-slate-400 w-12 pt-0.5 shrink-0">
                        {new Date(job.startTime || Date.now()).toTimeString().slice(0, 5)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#143a72] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            {job.a}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-[#143a72] transition-colors">
                            {job.w}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                          <span>Cause: <b>{job.cause}</b></span>
                          <span>•</span>
                          <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-mono text-[10px]">
                            {job.state.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span>Tech: <b>{job.tech}</b></span>
                          {job.holdReason && <span className="text-amber-700 font-mono">({job.holdReason})</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {job.crit && (
                        <div>
                          <div className="font-mono text-xs font-bold text-rose-600">
                            {formatResinHeld(liveHours)}
                          </div>
                          <div className="text-[9px] font-mono uppercase text-slate-400">
                            held back ({liveHours.toFixed(1)}h)
                          </div>
                        </div>
                      )}
                      <div className="text-[10px] text-blue-700 font-semibold group-hover:underline mt-1">
                        Quick Action
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* PM Compliance 90 Days Dial (1 Col) */}
        <div className="lg:col-span-1">
          <Card
            title="PM Compliance · 90 Days"
            rightElement={
              <button
                onClick={() => navigate('/rpet/plan')}
                className="text-xs font-semibold text-[#143a72] hover:underline"
              >
                Plan view
              </button>
            }
          >
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-5 justify-center py-2">
              <DialGauge pct={62} size={110} />

              <div className="w-full space-y-2 border-t sm:border-t-0 lg:border-t border-slate-100 pt-3 sm:pt-0 lg:pt-3 text-xs">
                <div
                  onClick={() => setSelectedPmAsset({ name: 'CH-01 · Chiller', compliance: 41, task: 'Condenser coil chemical de-scaling & refrigerant pressure check', cycle: 'Every 30 days', overdue: '18 days overdue' })}
                  className="flex items-center justify-between pb-1.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                >
                  <span className="text-slate-700 font-medium">CH-01 · Chiller</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-600">41%</span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPmAsset({ name: 'AC-01 · Compressor', compliance: 45, task: 'Air filter element replacement & moisture drain check', cycle: 'Every 15 days', overdue: '9 days overdue' })}
                  className="flex items-center justify-between pb-1.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                >
                  <span className="text-slate-700 font-medium">AC-01 · Compressor</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600">45%</span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPmAsset({ name: 'ETP-01 · Effluent pumps', compliance: 48, task: 'Impeller wear clearance check & mechanical seal greasing', cycle: 'Every 30 days', overdue: '12 days overdue' })}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                >
                  <span className="text-slate-700 font-medium">ETP-01 · Effluent pumps</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600">48%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Modal 1: Live SCADA Telemetry Stream Drawer/Modal */}
      {showTelemetryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  SCADA Live Telemetry Stream · PLC-104.2
                </h3>
              </div>
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Line Throughput</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">{liveLineRate} t/h</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Target: {tph} t/h (98.2% OEE)</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Extruder Screw RPM</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">284 RPM</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Twin-Screw Sync: Nominal</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Melt Temperature</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">278.4 °C</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Zone 7 Barrel (±1.2°C)</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Die Head Pressure</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">142.5 bar</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Screen Pack Differential: Normal</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
                ✓ PLC Modbus TCP/IP connection active. Receiving 1 Hz polling telemetry from Coperion Extruder 1 & 2, Herbold washing line, and SSP reactor.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="px-4 py-2 bg-[#143a72] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close SCADA Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Open Job Quick Action Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedJob.a}
                </span>
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Incident Action Center
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <div className="font-bold text-slate-900">{selectedJob.w}</div>
                <div className="text-slate-500 text-[11px] mt-1">Cause: {selectedJob.cause} · Priority: {selectedJob.crit ? 'P1 CRITICAL' : 'Standard'}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold text-slate-800">{selectedJob.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Tech:</span>
                  <span className="font-bold text-[#143a72]">{selectedJob.tech}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resin Held Value:</span>
                  <span className="font-bold text-rose-600">{formatResinHeld(selectedJob.sinceHoursAgo || 1.2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-600 uppercase font-mono">Supervisor Actions:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateJobState(selectedJob.id, 'IN_PROGRESS');
                      setSelectedJob(null);
                    }}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold rounded-lg text-xs border border-blue-200 cursor-pointer"
                  >
                    ▶ Set In Progress
                  </button>
                  <button
                    onClick={() => {
                      updateJobState(selectedJob.id, 'RESOLVED');
                      setSelectedJob(null);
                    }}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-lg text-xs border border-emerald-200 cursor-pointer"
                  >
                    ✓ Mark Resolved
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    navigate('/rpet/plan');
                  }}
                  className="w-full p-2 bg-[#143a72] hover:bg-[#0c2347] text-white font-bold rounded-lg text-xs cursor-pointer shadow-2xs text-center"
                >
                  Dispatch via WhatsApp on Daily Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: PM Asset Action Modal */}
      {selectedPmAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-sm text-slate-900">
                {selectedPmAsset.name} · PM Schedule
              </h3>
              <button
                onClick={() => setSelectedPmAsset(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900">Compliance Rate:</span>
                <span className="font-mono text-lg font-bold text-rose-600">{selectedPmAsset.compliance}%</span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Scheduled Preventive Maintenance:</span>
                <p className="text-slate-600">{selectedPmAsset.task}</p>
                <div className="font-mono text-[11px] text-rose-600 font-bold mt-1">Status: {selectedPmAsset.overdue}</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedPmAsset(null);
                    navigate('/rpet/plan');
                  }}
                  className="w-full py-2.5 bg-[#143a72] hover:bg-[#0c2347] text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
                >
                  Add to Today's Shift Plan Board
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
};
