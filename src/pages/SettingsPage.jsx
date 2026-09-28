import React, { useState, useEffect } from 'react';
import { Shell } from '../components/layout/Shell';
import { Card } from '../components/ui/Card';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBrandStore } from '../store/useBrandStore';
import { usePlanStore } from '../store/usePlanStore';
import { useBreakdownStore } from '../store/useBreakdownStore';
import { useDemoStore } from '../store/useDemoStore';
import { useToastStore } from '../store/useToastStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { warmOfflineCache, getOfflineStorageEstimate, isOfflineSupported } from '../utils/offlineManager';

export const SettingsPage = () => {
  const {
    tph,
    resin,
    contrib,
    outT,
    rejPct,
    setTph,
    setResin,
    setContrib,
    setOutT,
    setRejPct,
    formatResinHeld,
    formatRejBill,
    formatRejBillAnnual,
    machineWeights,
    setMachineWeight
  } = useSettingsStore();

  const { logoUrl, setLogoUrl, accentColor, setAccentColor } = useBrandStore();
  const { isOnline } = useNetworkStatus();
  const [storageEstimate, setStorageEstimate] = useState(null);
  const [isWarming, setIsWarming] = useState(false);

  useEffect(() => {
    getOfflineStorageEstimate().then(setStorageEstimate);
  }, []);

  const handleWarmCache = async () => {
    setIsWarming(true);
    await warmOfflineCache();
    setTimeout(() => {
      setIsWarming(false);
      useToastStore.getState().addToast({
        title: 'Offline Cache Verified',
        message: 'All application bundles, routes, fonts, and assets are cached locally.',
        type: 'success'
      });
      getOfflineStorageEstimate().then(setStorageEstimate);
    }, 600);
  };

  const handleResetAllData = () => {
    usePlanStore.getState().resetToDemo();
    useBreakdownStore.getState().resetBreakdowns();
    useSettingsStore.getState().resetSettings();
    useBrandStore.getState().resetBrand();
    useDemoStore.getState().restartGuide();
    useToastStore.getState().addToast({
      title: 'Demo Environment Reset',
      message: 'All stores and offline persistent state restored to original clean defaults.',
      type: 'info'
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Shell
      crumb={<span><b>Settings</b> · every rupee figure in the app recomputes from these</span>}
      title="Money Assumptions"
      subtitle="Defaults come from Magpet's published capacity. Edit these numbers and watch every KPI and financial figure across the app recompute dynamically in real time."
    >
      <div className="space-y-8 max-w-4xl">
        
        {/* Financial & Capacity Assumption Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Card>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
              rPET Line Rate · Tonnes / Hour
            </label>
            <input
              type="number"
              step="0.1"
              value={tph}
              onChange={(e) => setTph(e.target.value)}
              className="w-full font-mono text-xl font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-hidden focus:border-[#143a72] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              45,000 MTPA over roughly 8,000 running hours.
            </p>
          </Card>

          <Card>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
              Resin Price · ₹ / Kg
            </label>
            <input
              type="number"
              step="1"
              value={resin}
              onChange={(e) => setResin(e.target.value)}
              className="w-full font-mono text-xl font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-hidden focus:border-[#143a72] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Indicative market price; adjust to your active contract prices.
            </p>
          </Card>

          <Card>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
              Contribution Margin · ₹ / Kg
            </label>
            <input
              type="number"
              step="1"
              value={contrib}
              onChange={(e) => setContrib(e.target.value)}
              className="w-full font-mono text-xl font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-hidden focus:border-[#143a72] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Gross margin placeholder per kg of resin processed.
            </p>
          </Card>

          <Card>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
              Hooghly Output · Tonnes / Month
            </label>
            <input
              type="number"
              step="10"
              value={outT}
              onChange={(e) => setOutT(e.target.value)}
              className="w-full font-mono text-xl font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-hidden focus:border-[#143a72] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Monthly finished preform processing volume (~{Math.round(outT / 30)} t/day).
            </p>
          </Card>

          <Card>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
              Hooghly Rejection Rate · %
            </label>
            <input
              type="number"
              step="0.1"
              value={rejPct}
              onChange={(e) => setRejPct(e.target.value)}
              className="w-full font-mono text-xl font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-hidden focus:border-[#143a72] dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Current MTD plant-wide scrap & rejection percentage.
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-heading">
                Average Preform Weight
              </label>
              <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                6 Machines Active
              </span>
            </div>
            {(() => {
              const weightValues = Object.values(machineWeights || {}).map(Number).filter((n) => !isNaN(n) && n > 0);
              const avgPreformWeight = weightValues.length
                ? (weightValues.reduce((a, b) => a + b, 0) / weightValues.length).toFixed(1)
                : '228.5';
              const minPreformWeight = weightValues.length ? Math.min(...weightValues).toFixed(1) : '19.5';
              const maxPreformWeight = weightValues.length ? Math.max(...weightValues).toFixed(1) : '680.0';
              return (
                <div className="w-full font-mono text-base font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between transition-colors">
                  <span>{avgPreformWeight}g Mean</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {minPreformWeight}g - {maxPreformWeight}g
                  </span>
                </div>
              );
            })()}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Editable individually below to simulate custom customer preform runs.
            </p>
          </Card>

        </div>

        {/* Editable Machine Registry Preform Weights (Spec Section 10) */}
        <Card
          title="Hooghly Unit 1 · Preform Weight by Machine"
          subtitle="Editable per machine table as specified in Section 10. Adjust preform weight targets live."
          rightElement={
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Spec Table 6.5 & 10
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Machine Code</th>
                  <th className="py-2.5 px-3">Vendor & System</th>
                  <th className="py-2.5 px-3">Cavities</th>
                  <th className="py-2.5 px-3">Product Catalogue</th>
                  <th className="py-2.5 px-3 text-right">Target Weight (g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {[
                  { code: 'H-01', vendor: 'Husky Fully Automatic', cavities: 96, product: 'Water preforms (19.5 g)', defaultW: 19.5, shiftPcs: 42380 },
                  { code: 'H-02', vendor: 'Husky Fully Automatic', cavities: 96, product: 'Water preforms (19.5 g)', defaultW: 19.5, shiftPcs: 41920 },
                  { code: 'H-03', vendor: 'Husky Fully Automatic', cavities: 72, product: 'CSD preforms (26.0 g) · S5', defaultW: 26.0, shiftPcs: 30450 },
                  { code: 'H-04', vendor: 'Husky Fully Automatic', cavities: 72, product: 'CSD preforms (26.0 g)', defaultW: 26.0, shiftPcs: 31200 },
                  { code: 'S-01', vendor: 'ABS Semi Automatic', cavities: 4, product: '20 Litre jar preforms (680 g)', defaultW: 680.0, shiftPcs: 1820 },
                  { code: 'S-02', vendor: 'ABS Semi Automatic', cavities: 4, product: '20 Litre jar preforms (680 g)', defaultW: 680.0, shiftPcs: 1780 }
                ].map((m) => {
                  const currentVal = machineWeights?.[m.code] ?? m.defaultW;
                  const currentNum = Number(currentVal) || m.defaultW;
                  const computedTonnes = ((m.shiftPcs * currentNum) / 1e6).toFixed(2);
                  return (
                    <tr key={m.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#143a72] dark:text-blue-400">{m.code}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{m.vendor}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{m.cavities}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">
                        <div>{m.product}</div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Live Shift Output: <span className="font-bold text-slate-800 dark:text-slate-200">{computedTonnes} t</span> ({m.shiftPcs.toLocaleString()} pcs)
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={currentVal}
                            onChange={(e) => setMachineWeight(m.code, e.target.value)}
                            className="w-24 text-right font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 focus:border-[#143a72] dark:focus:border-blue-400 focus:outline-hidden transition-colors"
                          />
                          <span className="text-[11px] text-slate-400 font-sans">g</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-heading mb-1">
            Branding & Color Adaptation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Upload custom company logos or fine-tune brand theme colors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
                Magpet Brand Logo
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-slate-400 dark:hover:border-slate-600 transition-colors bg-slate-50/50 dark:bg-slate-950/50">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-10 mx-auto mb-2 object-contain bg-white dark:bg-slate-800 p-1 rounded border border-slate-200 dark:border-slate-700"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#143a72] file:text-white hover:file:bg-[#0c2347] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Mounted automatically in the navigation header and landing hero.
              </p>
            </Card>

            <Card>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-heading">
                Accent Brand Color
              </label>
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                />
                <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {accentColor.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                Default: Deep Magpet Navy <code className="font-mono text-[#143a72] dark:text-blue-400 font-semibold">#143A72</code> from magnumgroup.in.
              </p>
            </Card>
          </div>
        </div>

        {/* Live Recomputed Financial Impact Table */}
        <Card title="What These Numbers Mean Right Now (Live Recomputed)">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">One hour of unplanned rPET stoppage (resin value)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">{formatResinHeld(1)}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Last night's EX-02 trip (3.5 hours)</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">{formatResinHeld(3.5)}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">EX-02 downtime this quarter (34.5 hours)</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">{formatResinHeld(34.5)}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Preform rejection bill (month to date)</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{formatRejBill()}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Preform rejection bill run rate (annualised)</span>
              <span className="font-mono font-bold text-rose-700 dark:text-rose-400 text-sm">{formatRejBillAnnual()}</span>
            </div>
          </div>
        </Card>

        {/* Offline Engine & Local Storage Health */}
        <Card title="Offline Resilience & Local Engine Status">
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] uppercase font-mono">Network Status</div>
                <div className="text-sm font-bold mt-1 flex items-center gap-1.5 font-heading">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className={isOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
                    {isOnline ? 'Online · Live Sync' : 'Autonomous Offline'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] uppercase font-mono">Service Worker Cache</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-heading">
                  {isOfflineSupported() ? 'Active · PWA Enabled' : 'Browser Fallback'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] uppercase font-mono">Local State Storage</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-heading">
                  {storageEstimate?.usageMb ? `${storageEstimate.usageMb} MB Cached` : 'Persistent Ready'}
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Magpet Operations Intelligence is engineered for 100% offline resilience. All application assets, SCADA telemetry models, WhatsApp dispatch threads, breakdown Kanban states, and financial calculation engines are stored locally in CacheStorage and persistent local state. The application can run offline for indefinite periods without data loss, reloads, or errors.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleWarmCache}
                disabled={isWarming}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#143a72] text-white hover:bg-[#1e529d] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isWarming ? 'Verifying Local Cache...' : '⚡ Prime & Warm Offline Cache'}
              </button>

              <button
                type="button"
                onClick={handleResetAllData}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Restore Factory Demo Defaults
              </button>
            </div>
          </div>
        </Card>

      </div>
    </Shell>
  );
};
export default SettingsPage;
