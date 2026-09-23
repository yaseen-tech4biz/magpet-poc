import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { Card } from '../../components/ui/Card';
import { CavityGrid } from '../../components/features/cavity/CavityGrid';
import { CavityDrift } from '../../components/features/cavity/CavityDrift';
import { useCavityStore } from '../../store/useCavityStore';

export const CavityMapPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedMachine, setSelectedMachine, machines, getCurrentMachineInfo, getCavityStats } = useCavityStore();

  useEffect(() => {
    if (id && id !== selectedMachine) {
      setSelectedMachine(id);
    }
  }, [id, selectedMachine, setSelectedMachine]);

  const machineInfo = getCurrentMachineInfo();
  const stats = getCavityStats();

  const handleMachineChange = (e) => {
    const newMachine = e.target.value;
    setSelectedMachine(newMachine);
    navigate(`/preform/cavity/${newMachine}`);
  };

  return (
    <Shell
      moduleType="B"
      crumb={
        <div className="flex items-center justify-between gap-4 w-full normal-case tracking-normal">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
              <strong className="text-slate-900 dark:text-white font-bold">Hooghly Unit 1</strong> · Cavity Weight Matrix · {machineInfo.code}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:inline">
              Target: {machineInfo.productWeight}g ({machineInfo.product})
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium whitespace-nowrap">Select Machine:</span>
            <select
              value={selectedMachine}
              onChange={handleMachineChange}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-xs font-mono font-bold text-[#143a72] dark:text-blue-300 outline-none shadow-2xs cursor-pointer focus:border-[#143a72] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#143a72] dark:focus:ring-blue-500"
            >
              {machines.map((m) => (
                <option key={m.code} value={m.code} className="dark:bg-slate-800 dark:text-slate-200">
                  {m.code} · {m.name} ({m.cavities} cav · {m.productWeight}g)
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      {/* Top Machine Cavity Health Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Total Cavities</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">{stats.total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{machineInfo.product}</div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Nominal Toleranced</div>
          <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">{stats.nominal}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Within ±0.15g band</div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Warning Drift</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">{stats.warning}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">0.15g to 0.25g drift</div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">Critical Action</div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">{stats.critical}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedMachine === 'H-03' ? 'Cavities 41, 42 flagged' : 'Exceeds tolerance'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Machine Cavity Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title={`${machineInfo.cavities} Cavities Matrix · ${machineInfo.code}`}
            subtitle={`Target: ${machineInfo.productWeight}g ±0.15g · Current Shift Sampling`}
            rightElement={
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Click Cavity to Inspect
              </span>
            }
          >
            <CavityGrid />
          </Card>
        </div>

        {/* 21-Day Cavity Drift Line Curve (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Cavity Diagnostics"
            subtitle={`${machineInfo.code} · Statistical Process Control`}
            rightElement={
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                21 Days Drift
              </span>
            }
          >
            <CavityDrift />
          </Card>
        </div>

      </div>
    </Shell>
  );
};
