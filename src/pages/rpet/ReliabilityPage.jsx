import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { Card } from '../../components/ui/Card';
import { HorizontalBarChart } from '../../components/ui/HorizontalBarChart';
import { useSettingsStore } from '../../store/useSettingsStore';

// Predefined 8 assets with verified 90-day telemetry metrics & incident chronologies
const ASSET_RELIABILITY_DATA = {
  'EX-02': {
    a: 'EX-02',
    name: 'Coperion Extruder 2',
    h: 34.5,
    ev: 6,
    flag: true,
    mtbf: 310,
    mttr: 4.6,
    trend: 'MTTR rising · 2.5 h to 5.0 h',
    bad: true,
    incidents: [
      {
        id: 'BD-EX02-06',
        date: '11 Sep',
        description: 'Gearbox bearing over temperature & thermal trip',
        cause: 'gearbox',
        downtimeHours: 7.5,
        technician: 'Sunil',
        shift: 'C',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      },
      {
        id: 'BD-EX02-05',
        date: '01 Sep',
        description: 'Gearbox abnormal vibration & heat alarm',
        cause: 'gearbox',
        downtimeHours: 6.5,
        technician: 'Ramesh',
        shift: 'B',
        spare: 'gearbox oil 20L',
        status: 'RESOLVED'
      },
      {
        id: 'BD-EX02-04',
        date: '24 Aug',
        description: 'Gearbox bearing temperature escalation',
        cause: 'gearbox',
        downtimeHours: 6.0,
        technician: 'Prakash',
        shift: 'A',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      },
      {
        id: 'BD-EX02-03',
        date: '21 Jul',
        description: 'Main drive coupling & bearing vibration',
        cause: 'gearbox',
        downtimeHours: 5.5,
        technician: 'Sunil',
        shift: 'C',
        spare: 'coupling spider',
        status: 'RESOLVED'
      },
      {
        id: 'BD-EX02-02',
        date: '04 Jul',
        description: 'Thrust bearing thermal escalation',
        cause: 'gearbox',
        downtimeHours: 5.0,
        technician: 'Ramesh',
        shift: 'B',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      },
      {
        id: 'BD-EX02-01',
        date: '16 Jun',
        description: 'Gearbox input shaft bearing wear',
        cause: 'gearbox',
        downtimeHours: 4.0,
        technician: 'Prakash',
        shift: 'A',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      }
    ]
  },
  'WL-01': {
    a: 'WL-01',
    name: 'Herbold Washing Line',
    h: 21.0,
    ev: 7,
    flag: true,
    mtbf: 265,
    mttr: 3.0,
    trend: '5 of 7 failures in shift C',
    bad: true,
    incidents: [
      {
        id: 'BD-WL01-07',
        date: '10 Sep',
        description: 'Friction washer 2 abnormal vibration',
        cause: 'bearing failure',
        downtimeHours: 3.5,
        technician: 'Sunil',
        shift: 'C',
        spare: 'bearing SKF 6308',
        status: 'RESOLVED'
      },
      {
        id: 'BD-WL01-06',
        date: '03 Sep',
        description: 'Friction washer bearing overheating',
        cause: 'bearing failure',
        downtimeHours: 3.2,
        technician: 'Sunil',
        shift: 'C',
        spare: 'bearing SKF 6308',
        status: 'RESOLVED'
      },
      {
        id: 'BD-WL01-05',
        date: '27 Aug',
        description: 'Washing line friction washer vibration',
        cause: 'bearing failure',
        downtimeHours: 2.8,
        technician: 'Prakash',
        shift: 'C',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      },
      {
        id: 'BD-WL01-04',
        date: '18 Aug',
        description: 'Friction washer 1 bearing seizure',
        cause: 'bearing failure',
        downtimeHours: 4.0,
        technician: 'Ramesh',
        shift: 'C',
        spare: 'bearing SKF 6308',
        status: 'RESOLVED'
      },
      {
        id: 'BD-WL01-03',
        date: '11 Aug',
        description: 'Friction washer bearing lubrication fault',
        cause: 'bearing failure',
        downtimeHours: 2.5,
        technician: 'Sunil',
        shift: 'C',
        spare: 'gearbox oil 20L',
        status: 'RESOLVED'
      },
      {
        id: 'BD-WL01-02',
        date: '24 Jul',
        description: 'Pre-wash screen bearing vibration',
        cause: 'bearing failure',
        downtimeHours: 2.5,
        technician: 'Prakash',
        shift: 'A',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      },
      {
        id: 'BD-WL01-01',
        date: '08 Jul',
        description: 'Float-sink tank agitator bearing wear',
        cause: 'bearing failure',
        downtimeHours: 2.5,
        technician: 'Ramesh',
        shift: 'B',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      }
    ]
  },
  'SSP-01': {
    a: 'SSP-01',
    name: 'SSP Reactor',
    h: 9.5,
    ev: 2,
    flag: false,
    mtbf: 980,
    mttr: 4.8,
    trend: 'stable',
    bad: false,
    incidents: [
      {
        id: 'BD-SSP01-01',
        date: '03 Sep',
        description: 'Rotary valve seal & bearing resistance',
        cause: 'bearing failure',
        downtimeHours: 5.5,
        technician: 'Sunil',
        shift: 'B',
        spare: 'gearbox oil 20L',
        status: 'RESOLVED'
      },
      {
        id: 'BD-SSP01-02',
        date: '18 Jul',
        description: 'Vacuum pump mechanical valve trip',
        cause: 'hydraulic leak',
        downtimeHours: 4.0,
        technician: 'Prakash',
        shift: 'A',
        spare: 'hydraulic seal kit',
        status: 'RESOLVED'
      }
    ]
  },
  'DR-02': {
    a: 'DR-02',
    name: 'Flake Dryer 2',
    h: 7.0,
    ev: 3,
    flag: false,
    mtbf: 640,
    mttr: 2.3,
    trend: 'stable',
    bad: false,
    incidents: [
      {
        id: 'BD-DR02-01',
        date: '10 Sep',
        description: 'Outlet temperature sensor erratic',
        cause: 'sensor fault',
        downtimeHours: 2.8,
        technician: 'Joydeep',
        shift: 'C',
        spare: 'proximity sensor',
        status: 'RESOLVED'
      },
      {
        id: 'BD-DR02-02',
        date: '04 Aug',
        description: 'Dryer exhaust blower motor trip',
        cause: 'electrical trip',
        downtimeHours: 2.4,
        technician: 'Bikash',
        shift: 'B',
        spare: 'contactor 40A',
        status: 'RESOLVED'
      },
      {
        id: 'BD-DR02-03',
        date: '25 Jun',
        description: 'Dryer air filter differential pressure high',
        cause: 'blockage',
        downtimeHours: 1.8,
        technician: 'Amit',
        shift: 'A',
        spare: 'filter cartridge',
        status: 'RESOLVED'
      }
    ]
  },
  'CH-01': {
    a: 'CH-01',
    name: 'Main Chiller',
    h: 5.5,
    ev: 2,
    flag: false,
    mtbf: 1050,
    mttr: 2.8,
    trend: 'stable',
    bad: false,
    incidents: [
      {
        id: 'BD-CH01-01',
        date: '24 Aug',
        description: 'Refrigerant low pressure cut-out',
        cause: 'hydraulic leak',
        downtimeHours: 3.2,
        technician: 'Manoj',
        shift: 'A',
        spare: 'hydraulic seal kit',
        status: 'RESOLVED'
      },
      {
        id: 'BD-CH01-02',
        date: '02 Jul',
        description: 'Condenser pump motor overload trip',
        cause: 'electrical trip',
        downtimeHours: 2.3,
        technician: 'Debashis',
        shift: 'C',
        spare: 'contactor 40A',
        status: 'RESOLVED'
      }
    ]
  },
  'BO-01': {
    a: 'BO-01',
    name: 'Bale Opener',
    h: 4.0,
    ev: 2,
    flag: false,
    mtbf: 1200,
    mttr: 2.0,
    trend: 'stable',
    bad: false,
    incidents: [
      {
        id: 'BD-BO01-01',
        date: '23 Aug',
        description: 'Hydraulic cutter arm cylinder pressure drop',
        cause: 'hydraulic leak',
        downtimeHours: 2.5,
        technician: 'Prakash',
        shift: 'B',
        spare: 'hydraulic seal kit',
        status: 'RESOLVED'
      },
      {
        id: 'BD-BO01-02',
        date: '29 Jun',
        description: 'Infeed conveyor chain jam',
        cause: 'belt damage',
        downtimeHours: 1.5,
        technician: 'Ramesh',
        shift: 'A',
        spare: 'V-belt B68',
        status: 'RESOLVED'
      }
    ]
  },
  'CV-03': {
    a: 'CV-03',
    name: 'Conveyor 3',
    h: 3.5,
    ev: 3,
    flag: false,
    mtbf: 1350,
    mttr: 1.2,
    trend: 'stable',
    bad: false,
    incidents: [
      {
        id: 'BD-CV03-01',
        date: '10 Sep',
        description: 'Conveyor belt edge damage & misalignment',
        cause: 'belt damage',
        downtimeHours: 1.5,
        technician: 'Bikash',
        shift: 'C',
        spare: 'V-belt B68',
        status: 'RESOLVED'
      },
      {
        id: 'BD-CV03-02',
        date: '02 Aug',
        description: 'Drive roller bearing noise',
        cause: 'bearing failure',
        downtimeHours: 1.2,
        technician: 'Ramesh',
        shift: 'B',
        spare: 'bearing SKF 6205',
        status: 'RESOLVED'
      },
      {
        id: 'BD-CV03-03',
        date: '18 Jun',
        description: 'Emergency pull-cord switch fault',
        cause: 'sensor fault',
        downtimeHours: 0.8,
        technician: 'Joydeep',
        shift: 'A',
        spare: 'proximity sensor',
        status: 'RESOLVED'
      }
    ]
  },
  'Others': {
    a: 'Others',
    name: 'Utilities & Conveyors',
    h: 6.0,
    ev: 5,
    flag: false,
    mtbf: 900,
    mttr: 1.2,
    trend: 'stable',
    bad: false,
    incidents: [
      {
        id: 'BD-OTH-01',
        date: '10 Sep',
        description: 'ETP-01 Effluent pump cavitation',
        cause: 'blockage',
        downtimeHours: 1.8,
        technician: 'Manoj',
        shift: 'C',
        spare: 'filter cartridge',
        status: 'RESOLVED'
      },
      {
        id: 'BD-OTH-02',
        date: '28 Aug',
        description: 'AC-01 Air compressor filter blockage',
        cause: 'blockage',
        downtimeHours: 1.4,
        technician: 'Debashis',
        shift: 'A',
        spare: 'filter cartridge',
        status: 'RESOLVED'
      },
      {
        id: 'BD-OTH-03',
        date: '02 Aug',
        description: 'CV-01 Conveyor belt tracking drift',
        cause: 'belt damage',
        downtimeHours: 1.1,
        technician: 'Prakash',
        shift: 'B',
        spare: 'V-belt B68',
        status: 'RESOLVED'
      },
      {
        id: 'BD-OTH-04',
        date: '15 Jul',
        description: 'MS-01 Metal separator optical sensor dust',
        cause: 'sensor fault',
        downtimeHours: 0.9,
        technician: 'Amit',
        shift: 'A',
        spare: 'proximity sensor',
        status: 'RESOLVED'
      },
      {
        id: 'BD-OTH-05',
        date: '24 Jun',
        description: 'GR-01 Granulator screen mesh tear',
        cause: 'blockage',
        downtimeHours: 0.8,
        technician: 'Ramesh',
        shift: 'B',
        spare: 'screen mesh 80',
        status: 'RESOLVED'
      }
    ]
  }
};

const PARETO_KEYS = ['EX-02', 'WL-01', 'SSP-01', 'DR-02', 'CH-01', 'BO-01', 'CV-03', 'Others'];
const MTBF_KEYS = ['EX-02', 'WL-01', 'SSP-01', 'DR-02', 'CH-01'];

export const ReliabilityPage = () => {
  const navigate = useNavigate();
  const { formatResinHeld } = useSettingsStore();
  const [selectedAsset, setSelectedAsset] = useState(null);

  const paretoData = PARETO_KEYS.map((k) => ASSET_RELIABILITY_DATA[k]);

  const paretoRows = paretoData.map((p) => ({
    l: p.a,
    v: p.h,
    t: `${p.h.toFixed(1)} h · ${formatResinHeld(p.h)}${p.flag ? ' · ⚑' : ''}`,
    c: p.flag ? '#dc2626' : '#143a72'
  }));

  const mtbfData = MTBF_KEYS.map((k) => ASSET_RELIABILITY_DATA[k]);

  const handleSelectAsset = (assetCode) => {
    const data = ASSET_RELIABILITY_DATA[assetCode] || {
      a: assetCode,
      name: assetCode,
      h: 0,
      ev: 0,
      incidents: []
    };
    setSelectedAsset(data);
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
                  <span>
                    Cumulative Downtime: 34.5 h ({formatResinHeld(34.5)})
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    Inspect 6 Events
                  </span>
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
                  <span>
                    Cumulative Downtime: 21.0 h ({formatResinHeld(21.0)})
                  </span>
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
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedAsset.h.toFixed(1)} Hours
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Resin Value Held</div>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {formatResinHeld(selectedAsset.h)}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Breakdown Events</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {selectedAsset.ev} Incident{selectedAsset.ev !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {selectedAsset.incidents && selectedAsset.incidents.length > 0 ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center justify-between">
                    <span>Incident Timeline ({selectedAsset.a})</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Showing all {selectedAsset.incidents.length} recorded event{selectedAsset.incidents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {selectedAsset.incidents.map((inc) => (
                      <div key={inc.id} className="p-2.5 flex items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                            {inc.date && (
                              <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                                {inc.date}
                              </span>
                            )}
                            <span className="truncate">{inc.description}</span>
                            {inc.status === 'IN_PROGRESS' && (
                              <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 dark:text-slate-500 text-[11px] font-mono mt-1">
                            Cause: <span className="text-slate-700 dark:text-slate-300 font-bold">{inc.cause}</span> · Tech: {inc.technician || 'Unassigned'} (Shift {inc.shift}) · Spare: {inc.spare || 'None'}
                          </div>
                        </div>
                        <div className="text-right shrink-0 font-mono">
                          <div className="font-bold text-rose-700 dark:text-rose-400 text-xs">
                            {inc.downtimeHours != null ? `${Number(inc.downtimeHours).toFixed(1)} h` : 'Live'}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            {inc.downtimeHours != null ? formatResinHeld(inc.downtimeHours) : 'In Progress'}
                          </div>
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
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
};
export default ReliabilityPage;
