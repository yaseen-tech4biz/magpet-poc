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
            className="text-xs font-bold text-[#143a72] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
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
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
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
              <span className="font-mono text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                2 Active Flags
              </span>
            }
          >
            <div className="space-y-3.5">
              <div
                onClick={() => handleSelectAsset('EX-02')}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      EX-02
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-rose-900">
                      Gearbox Bearing Thermal Escalation
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 font-mono">⚑ S1 Flag</span>
                </div>
                <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                  6 events recorded. Repair MTTR is escalating from 2.5 h to 5.0 h. Pattern strongly indicates progressive mechanical wear of the main gearbox bearing.
                </div>
                <div className="mt-2.5 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] font-medium text-rose-700">
                  <span>Cumulative Downtime: 34.5 h ({formatResinHeld(34.5)})</span>
                  <span className="group-hover:translate-x-1 transition-transform">Inspect 6 Events</span>
                </div>
              </div>

              <div
                onClick={() => handleSelectAsset('WL-01')}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      WL-01
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-rose-900">
                      Friction Washer Bearings (Shift C Cluster)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 font-mono">⚑ S3 Flag</span>
                </div>
                <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                  7 events recorded. 5 out of 7 failures concentrated exclusively in Shift C. Signature indicates night operational procedure/lubrication deviation rather than component defect.
                </div>
                <div className="mt-2.5 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] font-medium text-rose-700">
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
              <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">MTBF (h)</th>
                <th className="py-2.5 px-3">MTTR (h)</th>
                <th className="py-2.5 px-3">Events</th>
                <th className="py-2.5 px-3">Pattern & Diagnostics</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {mtbfData.map((m) => (
                <tr
                  key={m.a}
                  onClick={() => handleSelectAsset(m.a)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-bold text-[#143a72] group-hover:underline">{m.a}</td>
                  <td className="py-3 px-3 text-slate-700">{m.mtbf}</td>
                  <td className="py-3 px-3 text-slate-700">{m.mttr.toFixed(1)}</td>
                  <td className="py-3 px-3 text-slate-700">{m.ev}</td>
                  <td className="py-3 px-3 font-body">
                    {m.bad ? (
                      <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {m.trend}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">
                        {m.trend}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 group-hover:text-[#143a72] font-body text-xs font-semibold">
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-[#143a72] bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                  {selectedAsset.a}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {selectedAsset.name || selectedAsset.a} · Reliability Diagnostics
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    90-Day Telemetry Breakdown Log
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Total Downtime</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedAsset.h || 0} Hours</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Resin Value Held</div>
                  <div className="text-lg font-bold text-rose-600 mt-0.5">{formatResinHeld(selectedAsset.h || 0)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Breakdown Events</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedAsset.ev || selectedAsset.incidents?.length || 0} Incidents</div>
                </div>
              </div>

              {selectedAsset.incidents && selectedAsset.incidents.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 font-mono text-[11px] font-bold text-slate-600 uppercase">
                    Incident Timeline ({selectedAsset.a})
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {selectedAsset.incidents.map((inc) => (
                      <div key={inc.id} className="p-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-800">{inc.description}</div>
                          <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                            Cause: <span className="text-slate-700 font-bold">{inc.cause}</span> · Tech: {inc.technician} (Shift {inc.shift}) · Spare: {inc.spare || 'None'}
                          </div>
                        </div>
                        <div className="text-right shrink-0 font-mono">
                          <div className="font-bold text-rose-700">{inc.downtimeHours} h</div>
                          <div className="text-[10px] text-slate-400">{formatResinHeld(inc.downtimeHours)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                  No critical incidents recorded on this asset in the last 90 days.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  navigate('/rpet/ask');
                }}
                className="text-xs font-bold text-[#143a72] hover:underline cursor-pointer"
              >
                Ask "Why does {selectedAsset.a} keep failing?"
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
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
