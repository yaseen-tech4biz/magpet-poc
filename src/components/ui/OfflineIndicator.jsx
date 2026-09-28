import React, { useState } from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Wifi, WifiOff, CheckCircle2, Database, ShieldCheck, X } from 'lucide-react';

export const OfflineIndicator = ({ showModalOnClick = true, className = '' }) => {
  const { isOnline, offlineSince } = useNetworkStatus();
  const [showModal, setShowModal] = useState(false);

  const getOfflineDuration = () => {
    if (!offlineSince) return 'Just now';
    const seconds = Math.floor((Date.now() - offlineSince) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => showModalOnClick && setShowModal(true)}
        title={
          isOnline
            ? 'Online · Connected to live SCADA & SAP B1 telemetry'
            : 'Working Offline · Local engine, cache & storage 100% active'
        }
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all duration-200 cursor-pointer border ${
          isOnline
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
            : 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/60 animate-pulse'
        } ${className}`}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        <span className="hidden sm:inline">
          {isOnline ? 'Live Sync' : 'Offline Mode'}
        </span>
        <span className="sm:hidden">
          {isOnline ? 'Live' : 'Offline'}
        </span>
      </button>

      {/* Offline Diagnostics Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    isOnline
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    {isOnline ? 'System Online & Synchronized' : 'Autonomous Offline Mode'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {isOnline ? 'SCADA & SAP Data Layer: Connected' : `Offline since: ${getOfflineDuration()}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offline Engine Checklist */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white font-heading">
                    App Shell & Static Assets Cached
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Service Worker ensures all scripts, styles, fonts, and images are stored locally in CacheStorage.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <Database className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white font-heading">
                    Local State Persistence Active
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Work order dispatches, Kanban moves, breakdowns, and money calculations persist locally.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white font-heading">
                    Zero-Interruption Resilience
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculations use absolute timestamps. Prolonged offline sessions will never drift or crash.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#143a72] text-white hover:bg-[#1e529d] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineIndicator;
