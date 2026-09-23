import React, { useState } from 'react';
import { Shell } from '../../components/layout/Shell';
import { TaskCard } from '../../components/features/plan/TaskCard';
import { PhoneMock } from '../../components/features/plan/PhoneMock';
import { usePlanStore } from '../../store/usePlanStore';

export const DailyPlanPage = () => {
  const { plan, assignTask } = usePlanStore();
  const [activeShiftFilter, setActiveShiftFilter] = useState('ALL'); // 'ALL', 'A', 'B', 'C'

  const shifts = [
    { key: 'A', name: 'Shift A', timing: '06:00–14:00', badge: 'Morning' },
    { key: 'B', name: 'Shift B', timing: '14:00–22:00', badge: 'Evening' },
    { key: 'C', name: 'Shift C', timing: '22:00–06:00', badge: 'Night' }
  ];

  const totalTasks = (plan.A?.length || 0) + (plan.B?.length || 0) + (plan.C?.length || 0);

  const filteredShifts = activeShiftFilter === 'ALL'
    ? shifts
    : shifts.filter((s) => s.key === activeShiftFilter);

  return (
    <Shell
      moduleType="A"
      crumb={<span><b>Kharagpur Unit 3</b> · Daily Maintenance Plan & WhatsApp Dispatch</span>}
    >
      <div className="space-y-5">

        {/* Top Summary & Quick Actions Navigation Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                Daily Maintenance Plan & WhatsApp Hub
              </h1>
              <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80 font-semibold hidden sm:inline">
                Live 2-Way Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              3 operational shifts · 8 active technicians dispatched in real-time via WhatsApp Business API alongside SAP Business One.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 whitespace-nowrap font-medium transition-colors">
              <b>{totalTasks}</b> Work Orders
            </span>
            <span className="font-mono text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span><b>8</b> Techs Connected</span>
            </span>
          </div>
        </div>

        {/* Shift Filter Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-mono mr-1">Filter:</span>
            {['ALL', 'A', 'B', 'C'].map((sKey) => (
              <button
                key={sKey}
                onClick={() => setActiveShiftFilter(sKey)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${activeShiftFilter === sKey
                    ? 'bg-[#143a72] text-white font-bold shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
              >
                {sKey === 'ALL' ? 'All Shifts (3)' : `Shift ${sKey}`}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
            Showing {filteredShifts.length} {filteredShifts.length === 1 ? 'shift' : 'shifts'}
          </span>
        </div>

        {/* Responsive Grid: Phone is TOP for Mobile (order-first), and FIXED/STICKY for Desktop (order-last lg:sticky) */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">

          {/* WhatsApp Simulator: TOP on Mobile (order-first), FIXED on Desktop (order-last lg:sticky) */}
          <div className="w-full lg:w-auto order-first lg:order-last lg:col-span-4 xl:col-span-4 2xl:col-span-3 flex justify-center lg:sticky lg:top-20 self-start">
            <PhoneMock />
          </div>

          {/* 3-Shift Maintenance Board: Below Phone on Mobile, Left Column on Desktop */}
          <div className="w-full order-last lg:order-first lg:col-span-8 xl:col-span-8 2xl:col-span-9">
            <div className={`grid grid-cols-1 ${filteredShifts.length > 1 ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-5`}>
              {filteredShifts.map((s) => (
                <div key={s.key} className="bg-slate-100/70 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#143a72] dark:bg-blue-400"></span>
                      <span className="text-slate-900 dark:text-slate-100 font-heading">{s.name}</span>
                    </div>
                    <span className="text-[10.5px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-full font-medium">
                      {s.timing}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {plan[s.key].map((task, idx) => (
                      <TaskCard
                        key={task.id || idx}
                        task={task}
                        shift={s.key}
                        taskIndex={idx}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </Shell>
  );
};
export default DailyPlanPage;
