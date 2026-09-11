import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useBreakdownStore } from '../../../store/useBreakdownStore';
import { StatusPill } from '../../ui/StatusPill';

export const KanbanBoard = () => {
  const { formatResinHeld, formatContribLost } = useSettingsStore();
  const { activeJobs, resolvedJobs, currentTime, tickTime, updateJobState, reportBreakdown } = useBreakdownStore();

  const [showReportModal, setShowReportModal] = useState(false);
  const [newAsset, setNewAsset] = useState('EX-02');
  const [newDesc, setNewDesc] = useState('Gearbox high vibration detected');
  const [newCause, setNewCause] = useState('bearing wear');
  const [newPriority, setNewPriority] = useState('P1');
  const [newTech, setNewTech] = useState('Ramesh');

  const [holdModalJobId, setHoldModalJobId] = useState(null);
  const [holdReason, setHoldReason] = useState('Awaiting replacement bearing from stores');

  // Timer tick for live resin cost calculation
  useEffect(() => {
    const timer = setInterval(() => {
      tickTime();
    }, 2000);
    return () => clearInterval(timer);
  }, [tickTime]);

  const [selectedShift, setSelectedShift] = useState('ALL'); // 'ALL', 'A', 'B', 'C'

  // Filter jobs by shift if selected
  const shiftFilteredActive = selectedShift === 'ALL'
    ? activeJobs
    : activeJobs.filter((j) => (j.shift || 'C') === selectedShift);

  const shiftFilteredResolved = selectedShift === 'ALL'
    ? resolvedJobs
    : resolvedJobs.filter((j) => (j.shift || 'C') === selectedShift);

  const lanes = [
    { key: 'ASSIGNED', title: 'ASSIGNED', items: shiftFilteredActive.filter((j) => j.state === 'ASSIGNED') },
    { key: 'IN_PROGRESS', title: 'IN PROGRESS', items: shiftFilteredActive.filter((j) => j.state === 'IN_PROGRESS') },
    { key: 'WAITING_SPARE', title: 'WAITING SPARE', items: shiftFilteredActive.filter((j) => j.state === 'WAITING_SPARE') },
    { key: 'RESOLVED_TODAY', title: 'RESOLVED TODAY', items: shiftFilteredResolved }
  ];

  const handleCreateReport = (e) => {
    e.preventDefault();
    reportBreakdown(newAsset, newDesc, newCause, newPriority, newTech);
    setShowReportModal(false);
  };

  const [mobileLaneFilter, setMobileLaneFilter] = useState('ALL');

  const filteredLanes = mobileLaneFilter === 'ALL'
    ? lanes
    : lanes.filter((l) => l.key === mobileLaneFilter);

  return (
    <div>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800 font-heading">
            Live Plant Breakdown Board
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time incident clock runs continuously from initial report to verified resolution.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="text-sm">+</span>
          <span>Report New Breakdown</span>
        </button>
      </div>

      {/* Shift Filter Pills (Spec Section 6.4 Story S3: Washing Line Shift C Cluster) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-mono mr-1">Shift Filter:</span>
          {[
            { key: 'ALL', label: 'All Shifts' },
            { key: 'A', label: 'Shift A (Morning)' },
            { key: 'B', label: 'Shift B (Evening)' },
            { key: 'C', label: 'Shift C (Night · S3)' }
          ].map((shift) => (
            <button
              key={shift.key}
              onClick={() => setSelectedShift(shift.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selectedShift === shift.key
                  ? 'bg-[#143a72] text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {shift.label}
            </button>
          ))}
        </div>
        {selectedShift === 'C' && (
          <span className="text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">
            Planted Story S3: Night Shift Cluster (WL-01 Friction Washers)
          </span>
        )}
      </div>

      {/* Mobile Lane Switcher (Visible on small screens) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
        <button
          onClick={() => setMobileLaneFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            mobileLaneFilter === 'ALL'
              ? 'bg-[#143a72] text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Lanes (4)
        </button>
        {lanes.map((lane) => (
          <button
            key={lane.key}
            onClick={() => setMobileLaneFilter(lane.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              mobileLaneFilter === lane.key
                ? 'bg-[#143a72] text-white font-bold shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{lane.title}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${mobileLaneFilter === lane.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {lane.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* 4 Kanban Lanes */}
      <div className={`grid grid-cols-1 ${filteredLanes.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
        {filteredLanes.map((lane) => (
          <div key={lane.key} className="bg-slate-100/70 rounded-xl p-3.5 border border-slate-200/80 flex flex-col">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 pb-3 mb-3 border-b border-slate-200 flex items-center justify-between">
              <span>{lane.title}</span>
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                {lane.items.length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {lane.items.map((job) => {
                const liveHours = job.startTime
                  ? Math.max(0.1, (currentTime - job.startTime) / 3600000)
                  : job.sinceHoursAgo || 1.0;

                return (
                  <div
                    key={job.id}
                    className={`bg-white rounded-lg p-3.5 border transition-all ${
                      job.crit && !job.isResolved
                        ? 'border-rose-300 ring-1 ring-rose-200/50 shadow-xs'
                        : 'border-slate-200 card-shadow'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#143a72] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {job.a}
                      </span>
                      <StatusPill type={job.p}>{job.p}</StatusPill>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 mt-2 mb-1">
                      {job.w}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {job.cause} · {job.tech}
                    </div>

                    {/* Hold Reason Banner */}
                    {job.state === 'WAITING_SPARE' && job.holdReason && (
                      <div className="mt-2 text-[10.5px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 font-mono">
                        Hold: {job.holdReason}
                      </div>
                    )}

                    {/* Live Ticking Cost for Ongoing Critical Jobs (Spec F-A2: Resin Value Headline + Contribution Sub-line) */}
                    {job.crit && !job.isResolved && (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-rose-200 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-rose-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-pulse" />
                            Resin held ({liveHours.toFixed(1)}h)
                          </span>
                          <span className="font-mono text-sm font-bold text-rose-600">
                            {formatResinHeld(liveHours)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between text-[10px] font-mono text-slate-500">
                          <span>Contribution lost</span>
                          <span className="font-bold text-amber-700">{formatContribLost(liveHours)}</span>
                        </div>
                      </div>
                    )}

                    {/* Final Cost for Resolved Jobs */}
                    {job.isResolved && (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                            Resin value held
                          </span>
                          <span className="font-mono text-sm font-bold text-slate-700">
                            {formatResinHeld(job.hrs)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between text-[10px] font-mono text-slate-500">
                          <span>Contribution lost</span>
                          <span className="font-bold text-amber-700">{formatContribLost(job.hrs)}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons across Lanes */}
                    {!job.isResolved && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        {job.state === 'ASSIGNED' && (
                          <button
                            onClick={() => updateJobState(job.id, 'IN_PROGRESS')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded font-medium cursor-pointer"
                          >
                            Start Repair
                          </button>
                        )}

                        {job.state === 'IN_PROGRESS' && (
                          <div className="flex items-center gap-1.5 w-full justify-between">
                            <button
                              onClick={() => setHoldModalJobId(job.id)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-0.5 rounded cursor-pointer font-medium"
                            >
                              Wait Spare
                            </button>
                            <button
                              onClick={() => updateJobState(job.id, 'RESOLVED_TODAY')}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded font-medium cursor-pointer"
                            >
                              ✓ Resolve
                            </button>
                          </div>
                        )}

                        {job.state === 'WAITING_SPARE' && (
                          <button
                            onClick={() => updateJobState(job.id, 'IN_PROGRESS')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded font-medium cursor-pointer"
                          >
                            Parts Received · Resume
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {lane.items.length === 0 && (
                <div className="p-5 text-center text-xs text-slate-400 italic">
                  No active cards in lane
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report New Breakdown Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Report Plant Breakdown Event
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset</label>
                <select
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 outline-hidden"
                >
                  <option value="EX-02">EX-02 · Coperion Extruder 2 (Critical)</option>
                  <option value="WL-01">WL-01 · Herbold Meckesheim Washing Line</option>
                  <option value="EX-01">EX-01 · Coperion Extruder 1</option>
                  <option value="SSP-01">SSP-01 · SSP Reactor</option>
                  <option value="DR-01">DR-01 · Flake Dryer 1</option>
                  <option value="CH-01">CH-01 · Chiller Line</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 outline-hidden"
                  placeholder="e.g. Gearbox bearing abnormal vibration and heat"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cause Code</label>
                  <input
                    type="text"
                    value={newCause}
                    onChange={(e) => setNewCause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 outline-hidden"
                  >
                    <option value="P1">P1 · Critical (Line Stopped)</option>
                    <option value="P2">P2 · High Risk</option>
                    <option value="P3">P3 · Medium / Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Assignee</label>
                <select
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 outline-hidden"
                >
                  <option value="Ramesh">Ramesh · Mechanical (Shift A)</option>
                  <option value="Prakash">Prakash · Mechanical (Shift B)</option>
                  <option value="Sunil">Sunil · Mechanical (Shift C)</option>
                  <option value="Bikash">Bikash · Electrical (Shift A)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  Log Breakdown & Start Cost Clock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hold Reason Modal */}
      {holdModalJobId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 font-heading">
              Place Breakdown on Hold
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Specify what spare part or authorization is required before work can resume:
            </p>
            <input
              type="text"
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900 outline-hidden mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setHoldModalJobId(null)}
                className="px-3 py-1 text-xs rounded text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateJobState(holdModalJobId, 'WAITING_SPARE', holdReason);
                  setHoldModalJobId(null);
                }}
                className="px-3 py-1 text-xs rounded bg-amber-600 hover:bg-amber-700 text-white font-medium"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
