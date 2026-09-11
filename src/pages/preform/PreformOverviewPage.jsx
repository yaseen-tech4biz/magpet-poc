import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { Card } from '../../components/ui/Card';
import { KpiCard } from '../../components/ui/KpiCard';
import { LineChart } from '../../components/ui/LineChart';
import { SapFeed } from '../../components/features/sap/SapFeed';
import { useSettingsStore } from '../../store/useSettingsStore';
import qualityHistoryData from '../../data/qualityHistory.json';
import machinesData from '../../data/machines.json';
import alertsData from '../../data/alerts.json';

export const PreformOverviewPage = () => {
  const { rejPct, outT, machineWeights, formatRejBill, formatRejBillAnnual } = useSettingsStore();

  // 60-day daily rejection % trend data computed dynamically from qualityHistory.json
  const trendData = useMemo(() => {
    const dates = [...new Set(qualityHistoryData.map((r) => r.date))].sort();
    return dates.map((d) => {
      const dayRecords = qualityHistoryData.filter((r) => r.date === d);
      const totalOut = dayRecords.reduce((sum, r) => sum + r.output, 0);
      const totalRej = dayRecords.reduce((sum, r) => sum + r.totalRejects, 0);
      return totalOut ? Number(((totalRej / totalOut) * 100).toFixed(2)) : 1.7;
    });
  }, []);

  // Today's machine metrics computed dynamically
  const { todayPreforms, todayTonnes, machineSummaries } = useMemo(() => {
    const todayRecords = qualityHistoryData.filter((r) => r.date === '2026-09-11');
    let totalPcs = 0;
    let totalT = 0;

    const summaries = machinesData.map((mach) => {
      const recs = todayRecords.filter((r) => r.machine === mach.code);
      const output = recs.reduce((sum, r) => sum + r.output, 0);
      const rejects = recs.reduce((sum, r) => sum + r.totalRejects, 0);
      const rate = output ? Number(((rejects / output) * 100).toFixed(2)) : 0;
      
      // Use reactive weight from settings store if customized, otherwise productWeight
      const weight = machineWeights[mach.code] || mach.productWeight;
      const tonnes = Number(((output * weight) / 1e6).toFixed(2));

      totalPcs += output;
      totalT += (output * weight) / 1e6;

      return {
        code: mach.code,
        name: mach.name,
        product: mach.product,
        cavities: mach.cavities,
        output,
        tonnes,
        rate,
        hasAlert: mach.code === 'H-03'
      };
    });

    return {
      todayPreforms: totalPcs,
      todayTonnes: Number(totalT.toFixed(1)),
      machineSummaries: summaries
    };
  }, [machineWeights]);

  // Scaled daily plant run-rate tonnage based on MTD setting (3,120 tonnes / 30 days = 104 t/day)
  const dailyRunRateTonnes = Number((outT / 30).toFixed(1));

  return (
    <Shell
      moduleType="B"
      crumb={<span><b>Hooghly Unit 1</b> · PET Preforms · Plant Overview</span>}
    >
      {/* 4 Standard KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          value={dailyRunRateTonnes.toString()}
          unit="t/d"
          label="Output run rate"
          trendText={`${(todayPreforms / 1000).toFixed(1)}k preforms · ${todayTonnes}t shift total`}
          trendType="neutral"
          colorTheme="default"
        />
        <KpiCard
          value={`${rejPct}%`}
          label="Rejection MTD"
          trendText="was 1.7% three weeks ago"
          trendType="amber"
          colorTheme="amber"
        />
        <KpiCard
          value={formatRejBill()}
          label="Rejection bill MTD"
          trendText={`${formatRejBillAnnual()} run rate / yr`}
          trendType="up"
          colorTheme="red"
        />
        <KpiCard
          value={alertsData.length.toString()}
          label="Active alerts"
          trendText="2 on H-03 (Cavities 41, 42)"
          trendType="up"
          colorTheme="red"
        />
      </div>

      {/* Replaces Excel Reporting: All 6 Machines Status at a Glance */}
      <div className="mb-6">
        <Card
          title="Machine Quality & Output Status · Hooghly Unit 1"
          subtitle="Replacing manual Excel quality reports with real-time shift analytics"
          rightElement={
            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
              6 Active Injection Systems
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3 font-semibold">Machine</th>
                  <th className="py-2.5 px-3 font-semibold">Preform Line</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Cavities</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Output Today</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Rejection %</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {machineSummaries.map((m) => (
                  <tr key={m.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#143a72]">
                      {m.code}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      <div>{m.name}</div>
                      <div className="text-[11px] text-slate-400">{m.product}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800">
                      {m.cavities}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <div className="font-bold text-slate-900">{m.output.toLocaleString()} pcs</div>
                      <div className="text-[11px] text-slate-500">{m.tonnes} t</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        m.rate >= 2.3
                          ? 'bg-rose-100 text-rose-800'
                          : m.rate > 1.9
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {m.rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {m.hasAlert ? (
                        <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          Alerts Active
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/preform/machine/${m.code}`}
                          className="font-semibold text-xs text-[#143a72] hover:text-[#0c2347] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded transition-colors"
                        >
                          Drilldown
                        </Link>
                        <Link
                          to={`/preform/cavity/${m.code}`}
                          className="font-semibold text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded transition-colors"
                        >
                          Cavity Map
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Grid: 60-Day Trend Chart & Live Alerts with SAP Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rejection % Trend (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="Plant Rejection Trend · Last 60 Days"
            subtitle="Target operational band: 1.5% – 1.8%"
            rightElement={
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                All 6 Machines Aggregate
              </span>
            }
          >
            <div className="py-2">
              <LineChart
                data={trendData}
                width={600}
                height={220}
                color="#d97706"
                band={[1.5, 1.8]}
                unit="%"
                dp={1}
                minVal={1.4}
                maxVal={2.4}
                xl={['60 d ago', 'today']}
              />
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0" />
              <span>
                <b>Planted Finding:</b> 3-week upward drift from 1.7% baseline to 2.16%. Driven primarily by weight variation rejects on H-03 (Cavities 41 &amp; 42).
              </span>
            </div>
          </Card>
        </div>

        {/* Live Quality Alerts & SAP Sync (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Alerts */}
          <Card
            title="Active Quality Alerts"
            rightElement={
              <span className="font-mono text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-pulse" />
                {alertsData.length} LIVE
              </span>
            }
          >
            <div className="space-y-3">
              {alertsData.map((alt) => {
                const isRed = alt.severity === 'red';
                return (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-lg border ${
                      isRed ? 'border-rose-200 bg-rose-50/40' : 'border-amber-200 bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{alt.time}</span>
                      <span className={`font-bold uppercase ${isRed ? 'text-rose-600' : 'text-amber-700'}`}>
                        {alt.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {alt.title}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {alt.detail}
                    </div>
                    {alt.link && (
                      <Link
                        to={alt.link}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#143a72] hover:underline mt-2"
                      >
                        Open diagnostic view
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SAP Business One Integration Tile */}
          <Card
            title="SAP Business One"
            subtitle="Sits beside SAP B1 · Does not replace it"
            rightElement={
              <span className="font-mono text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                Active Sync
              </span>
            }
          >
            <SapFeed />
          </Card>

        </div>

      </div>
    </Shell>
  );
};
