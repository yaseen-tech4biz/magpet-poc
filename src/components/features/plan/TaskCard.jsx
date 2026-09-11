import React, { useState } from 'react';
import { StatusPill } from '../../ui/StatusPill';
import { usePlanStore } from '../../../store/usePlanStore';

export const TaskCard = ({ task, shift, taskIndex }) => {
  const { technicians, assignTask, reassignTask, holdTask, releaseTask, resolveTask } = usePlanStore();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdReasonInput, setHoldReasonInput] = useState('Waiting for spare parts / temperature cool-down');
  const [techSearch, setTechSearch] = useState('');

  const isGap = task.st === 'gap';

  const filteredTechs = technicians.filter((t) => {
    if (!techSearch.trim()) return true;
    const query = techSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      (t.fullName && t.fullName.toLowerCase().includes(query)) ||
      (t.trade && t.trade.toLowerCase().includes(query)) ||
      `shift ${t.shift}`.toLowerCase().includes(query) ||
      t.shift.toLowerCase() === query.trim()
    );
  });

  return (
    <div className={`bg-white rounded-lg border p-3.5 mb-3 transition-all ${
      isGap
        ? 'border-rose-300 bg-rose-50/30 border-dashed'
        : task.st === 'hold'
        ? 'border-amber-300 bg-amber-50/20'
        : task.st === 'completed'
        ? 'border-emerald-200 bg-emerald-50/20'
        : 'border-slate-200 card-shadow hover:border-slate-300'
    }`}>
      {/* Header: Asset Code and Priority Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#143a72] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {task.a}
          </span>
          {task.st === 'hold' && (
            <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              ON HOLD
            </span>
          )}
          {task.st === 'completed' && (
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              RESOLVED
            </span>
          )}
        </div>
        <StatusPill type={task.p}>{task.p}</StatusPill>
      </div>

      {/* Work Order Description */}
      <div className={`text-xs font-semibold mt-2.5 mb-1 ${isGap ? 'text-rose-900' : 'text-slate-800'}`}>
        {task.w}
      </div>

      {/* Trigger Reason */}
      <div className="font-mono text-[11px] text-slate-500">
        {task.why}
      </div>

      {/* Hold Reason Banner if On Hold */}
      {task.st === 'hold' && task.holdReason && (
        <div className="mt-2 text-[11px] text-amber-800 bg-amber-100/60 p-1.5 rounded border border-amber-200 font-mono">
          Hold: {task.holdReason}
        </div>
      )}

      {/* Footer: Technician Assignment and Action CTAs */}
      <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-2">
        {/* Row 1: Technician Info & Status Pill */}
        <div className="flex items-center justify-between text-xs min-h-[22px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-400 text-[11px] font-medium">Tech:</span>
            {task.tech ? (
              <span className="font-semibold text-slate-900 truncate">
                {task.tech}
              </span>
            ) : isGap ? (
              <span className="text-rose-600 font-semibold text-[11px]">
                No technician available
              </span>
            ) : (
              <span className="text-slate-400 italic">Unassigned</span>
            )}
          </div>

          {/* Status Pill Indicator */}
          {task.st === 'assigned' && (
            <span className="font-mono text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">
              Assigned
            </span>
          )}
          {task.st === 'ip' && (
            <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
              In Progress
            </span>
          )}
          {task.st === 'hold' && (
            <span className="font-mono text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded shrink-0">
              On Hold
            </span>
          )}
          {task.st === 'completed' && (
            <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
              ✓ Done
            </span>
          )}
        </div>

        {/* Row 2: Aligned Full-Width Action Button Grid */}
        <div className="w-full pt-0.5">
          {task.st === 'open' || task.st === 'gap' ? (
            <button
              onClick={() => setShowAssignModal(!showAssignModal)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-1.5 px-3 rounded shadow-2xs transition-colors cursor-pointer text-center"
            >
              Assign Technician
            </button>
          ) : task.st === 'assigned' ? (
            <div className="grid grid-cols-2 gap-1.5 w-full">
              <button
                onClick={() => assignTask(shift, taskIndex, task.tech)}
                className="bg-[#143a72] hover:bg-[#0c2347] text-white text-xs py-1.5 px-2 rounded font-medium cursor-pointer shadow-2xs text-center transition-colors flex items-center justify-center gap-1"
                title="Dispatch WhatsApp work order"
              >
                <span>Dispatch</span>
              </button>
              <button
                onClick={() => setShowAssignModal(!showAssignModal)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 px-2 rounded font-medium cursor-pointer border border-slate-200 text-center transition-colors"
                title="Transfer to another technician"
              >
                Transfer
              </button>
            </div>
          ) : task.st === 'ip' ? (
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <button
                onClick={() => resolveTask(shift, taskIndex)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs py-1 rounded font-medium cursor-pointer text-center shadow-2xs"
                title="Mark as completed in SAP B1"
              >
                ✓ Done
              </button>
              <button
                onClick={() => setShowHoldModal(!showHoldModal)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs py-1 rounded cursor-pointer text-center font-medium border border-amber-200"
                title="Place on hold"
              >
                Hold
              </button>
              <button
                onClick={() => setShowAssignModal(!showAssignModal)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1 rounded cursor-pointer text-center border border-slate-200"
                title="Reassign to another technician"
              >
                Transfer
              </button>
            </div>
          ) : task.st === 'hold' ? (
            <button
              onClick={() => releaseTask(shift, taskIndex)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 rounded shadow-2xs transition-colors cursor-pointer text-center"
            >
              Resume / Release Hold
            </button>
          ) : (
            <div className="w-full text-center py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
              ✓ Signed Off in SAP B1
            </div>
          )}
        </div>
      </div>

      {/* Technician Assignment / Reassignment Dropdown Selector */}
      {showAssignModal && (
        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 shadow-xs">
          {/* Dropdown Header */}
          <div className="font-semibold text-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold">Select Technician:</span>
              <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-full">
                {filteredTechs.length} available
              </span>
            </div>
            <button
              onClick={() => {
                setShowAssignModal(false);
                setTechSearch('');
              }}
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 font-bold transition-colors"
              title="Close dropdown"
            >
              ✕
            </button>
          </div>

          {/* Quick Filter Search for Fast Access across 199+ Technicians */}
          <div className="relative">
            <input
              type="text"
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              placeholder="Search name, designation, shift..."
              className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#143a72] focus:ring-1 focus:ring-[#143a72] transition-colors"
            />
            {techSearch && (
              <button
                onClick={() => setTechSearch('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          {/* Fixed-Height Scrollable Dropdown List with Scroller */}
          <div className="max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white divide-y divide-slate-100 shadow-inner">
            {filteredTechs.length === 0 ? (
              <div className="p-3.5 text-center text-slate-400 text-xs">
                No technician found matching "{techSearch}"
              </div>
            ) : (
              filteredTechs.map((t) => {
                const isCurrent = task.tech === t.name;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (task.st === 'open' || task.st === 'gap') {
                        assignTask(shift, taskIndex, t.name);
                      } else {
                        reassignTask(shift, taskIndex, t.name);
                      }
                      setShowAssignModal(false);
                      setTechSearch('');
                    }}
                    className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between gap-2.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50/80 border-l-2 border-l-[#143a72]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs ${isCurrent ? 'text-[#143a72]' : 'text-slate-900'}`}>
                          {t.name}
                        </span>
                        {t.fullName && (
                          <span className="text-[11px] text-slate-500 font-normal truncate hidden sm:inline">
                            ({t.fullName})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {t.trade}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        t.shift === 'A'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : t.shift === 'B'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        Shift {t.shift}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Hold Reason Prompt Modal */}
      {showHoldModal && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-2">
          <div className="font-semibold text-amber-900 flex justify-between items-center">
            <span>Specify Reason to Place On Hold:</span>
            <button
              onClick={() => setShowHoldModal(false)}
              className="text-amber-600 hover:text-amber-800"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            value={holdReasonInput}
            onChange={(e) => setHoldReasonInput(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-hidden"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowHoldModal(false)}
              className="px-2 py-0.5 rounded text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                holdTask(shift, taskIndex, holdReasonInput);
                setShowHoldModal(false);
              }}
              className="px-3 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              Confirm Hold
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
