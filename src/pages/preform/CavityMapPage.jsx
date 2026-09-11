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
            <span className="text-xs font-mono text-slate-700 whitespace-nowrap">
              <strong className="text-slate-900 font-bold">Hooghly Unit 1</strong> · Cavity Weight Matrix · {machineInfo.code}
            </span>
            <span className="font-mono text-xs text-slate-500 whitespace-nowrap hidden md:inline">
              Target: {machineInfo.productWeight}g ({machineInfo.product})
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-sans font-medium whitespace-nowrap">Select Machine:</span>
            <select
              value={selectedMachine}
              onChange={handleMachineChange}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-mono font-bold text-[#143a72] outline-none shadow-2xs cursor-pointer focus:border-[#143a72] focus:ring-1 focus:ring-[#143a72]"
            >
              {machines.map((m) => (
                <option key={m.code} value={m.code}>
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
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Cavities</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{machineInfo.product}</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Nominal Toleranced</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">{stats.nominal}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Within ±0.15g band</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Warning Drift</div>
          <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{stats.warning}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">0.15g to 0.25g drift</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Critical Action</div>
          <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">{stats.critical}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
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
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
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
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
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
