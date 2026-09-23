import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { Card } from '../../components/ui/Card';
import { HorizontalBarChart } from '../../components/ui/HorizontalBarChart';
import { useSettingsStore } from '../../store/useSettingsStore';
import breakdownsData from '../../data/breakdowns.json';

export const ReliabilityPage = () => {
  const navigate = useNavigate();
  const { formatResinHeld, resinBenchmarkPrice, tph } = useSettingsStore();
  const [selectedAsset, setSelectedAsset] = useState(null);

  const paretoData = [
    { a: 'EX-02', h: 34.5, ev: 6, flag: true, name: 'Coperion Extruder 2' },
    { a: 'WL-01', h: 21.0, ev: 7, flag: true, name: 'Herbold Washing Line' },
    { a: 'SSP-01', h: 9.5, ev: 2, flag: false, name: 'SSP Reactor' },
    { a: 'DR-02', h: 7.0, ev: 3, flag: false, name: 'Flake Dryer 2' },
    { a: 'CH-01', h: 5.5, ev: 2, flag: false, name: 'Main Chiller' },
    { a: 'BO-01', h: 4.0, ev: 2, flag: false, name: 'Bale Opener' },
    { a: 'CV-03', h: 3.5, ev: 3, flag: false, name: 'Conveyor 3' },
    { a: 'Others', h: 6.0, ev: 5, flag: false, name: 'Utilities & Conveyors' }
  ];

  const paretoRows = paretoData.map((p) => ({
    l: p.a,
    v: p.h,
    t: `${p.h.toFixed(1)} h · ${formatResinHeld(p.h)}${p.flag ? ' · ⚑' : ''}`,
    c: p.flag ? '#dc2626' : '#143a72'
  }));

  const mtbfData = [
    { a: 'EX-02', mtbf: 310, mttr: 4.6, ev: 6, trend: 'MTTR rising · 2.5 h to 5.0 h', bad: true },
    { a: 'WL-01', mtbf: 265, mttr: 3.0, ev: 7, trend: '5 of 7 failures in shift C', bad: true },
    { a: 'SSP-01', mtbf: 980, mttr: 4.8, ev: 2, trend: 'stable', bad: false },
    { a: 'DR-02', mtbf: 640, mttr: 2.3, ev: 3, trend: 'stable', bad: false },
    { a: 'CH-01', mtbf: 1050, mttr: 2.8, ev: 2, trend: 'stable', bad: false }
  ];

  const handleSelectAsset = (assetCode) => {
    const assetMeta = paretoData.find((p) => p.a === assetCode) || { a: assetCode, h: 0, ev: 0, name: assetCode };
    const incidents = breakdownsData.filter((b) => b.asset === assetCode).slice(0, 6);
    setSelectedAsset({ ...assetMeta, incidents });
  };

  return (
    <Shell
      moduleType="A"
      crumb={
        <div className="flex items-center justify-between gap-2">
          <span><b>Kharagpur Unit 3</b> · Reliability · last 90 days</span>
          <button
            onClick={() => navigate('/rpet/ask')}
            className="text-xs font-bold text-[#143a72] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Ask about Reliability</span>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Pareto Downtime Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="Downtime by Asset"
            subtitle="Click any asset bar to inspect 90-day incident diagnostics"
            rightElement={
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Pareto · Hours · ₹ Impact
              </span>
            }
          >
            <HorizontalBarChart
              rows={paretoRows}
              onSelectRow={(r) => handleSelectAsset(r.l)}
            />
          </Card>
        </div>

        {/* Repeat Failure Flags (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Repeat Failure Flags"
            subtitle="Triggered by 3+ same-cause incidents within 30 days"
            rightElement={
              <span className="font-mono text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                2 Active Flags
              </span>
            }
          >
            <div className="space-y-3.5">
              <div
                onClick={() => handleSelectAsset('EX-02')}
                className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded">
                      EX-02
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors">
                      Gearbox Bearing Thermal Escalation
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 font-mono">⚑ S1 Flag</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  6 events recorded. Repair MTTR is escalating from 2.5 h to 5.0 h. Pattern strongly indicates progressive mechanical wear of the main gearbox bearing.
                </div>
                <div className="mt-2.5 pt-2 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-[11px] font-medium text-rose-700 dark:text-rose-400">
                  <span>Cumulative Downtime: 34.5 h ({formatResinHeld(34.5)})</span>
                  <span className="group-hover:translate-x-1 transition-transform">Inspect 6 Events</span>
                </div>
              </div>

              <div
                onClick={() => handleSelectAsset('WL-01')}
                className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded">
                      WL-01
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors">
                      Friction Washer Bearings (Shift C Cluster)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 font-mono">⚑ S3 Flag</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  7 events recorded. 5 out of 7 failures concentrated exclusively in Shift C. Signature indicates night operational procedure/lubrication deviation rather than component defect.
                </div>
                <div className="mt-2.5 pt-2 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-[11px] font-medium text-rose-700 dark:text-rose-400">
                  <span>Cumulative Downtime: 21.0 h ({formatResinHeld(21.0)})</span>
                  <span className="group-hover:translate-x-1 transition-transform">Inspect Shift Pattern</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* MTBF and MTTR Data Table (Interactive Rows) */}
      <Card
        title="MTBF and MTTR by Asset"
        subtitle="Calculated over 90 running days. Click any row to open failure log."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">MTBF (h)</th>
                <th className="py-2.5 px-3">MTTR (h)</th>
                <th className="py-2.5 px-3">Events</th>
                <th className="py-2.5 px-3">Pattern & Diagnostics</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
              {mtbfData.map((m) => (
                <tr
                  key={m.a}
                  onClick={() => handleSelectAsset(m.a)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-bold text-[#143a72] dark:text-blue-400 group-hover:underline">{m.a}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{m.mtbf}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{m.mttr.toFixed(1)}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{m.ev}</td>
                  <td className="py-3 px-3 font-body">
                    {m.bad ? (
                      <span className="text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/80">
                        {m.trend}
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                        {m.trend}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 dark:text-slate-500 group-hover:text-[#143a72] dark:group-hover:text-blue-400 font-body text-xs font-semibold transition-colors">
                    Inspect
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Asset Reliability Diagnostics Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-[#143a72] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded border border-blue-100 dark:border-blue-900/60">
                  {selectedAsset.a}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                    {selectedAsset.name || selectedAsset.a} · Reliability Diagnostics
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    90-Day Telemetry Breakdown Log
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Total Downtime</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{selectedAsset.h || 0} Hours</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Resin Value Held</div>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">{formatResinHeld(selectedAsset.h || 0)}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Breakdown Events</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{selectedAsset.ev || selectedAsset.incidents?.length || 0} Incidents</div>
                </div>
              </div>

              {selectedAsset.incidents && selectedAsset.incidents.length > 0 ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    Incident Timeline ({selectedAsset.a})
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {selectedAsset.incidents.map((inc) => (
                      <div key={inc.id} className="p-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{inc.description}</div>
                          <div className="text-slate-400 dark:text-slate-500 text-[11px] font-mono mt-0.5">
                            Cause: <span className="text-slate-700 dark:text-slate-300 font-bold">{inc.cause}</span> · Tech: {inc.technician} (Shift {inc.shift}) · Spare: {inc.spare || 'None'}
                          </div>
                        </div>
                        <div className="text-right shrink-0 font-mono">
                          <div className="font-bold text-rose-700 dark:text-rose-400">{inc.downtimeHours} h</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">{formatResinHeld(inc.downtimeHours)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                  No critical incidents recorded on this asset in the last 90 days.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  navigate('/rpet/ask');
                }}
                className="text-xs font-bold text-[#143a72] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Ask "Why does {selectedAsset.a} keep failing?"
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedAsset(null);
                    navigate('/rpet/breakdowns');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#143a72] text-white text-xs font-bold hover:bg-[#0c2347] transition-colors cursor-pointer shadow-2xs"
                >
                  View on Breakdown Board
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
};
export default ReliabilityPage;
