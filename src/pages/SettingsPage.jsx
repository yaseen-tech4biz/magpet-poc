import React from 'react';
import { Shell } from '../components/layout/Shell';
import { Card } from '../components/ui/Card';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBrandStore } from '../store/useBrandStore';

export const SettingsPage = () => {
  const {
    tph,
    resin,
    contrib,
    setTph,
    setResin,
    setContrib,
    formatResinHeld,
    formatRejBill,
    formatRejBillAnnual,
    machineWeights,
    setMachineWeight
  } = useSettingsStore();

  const { logoUrl, setLogoUrl, accentColor, setAccentColor } = useBrandStore();

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
        
        {/* 4 Financial Assumption Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-heading">
                Average Preform Weight
              </label>
              <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                6 Machines Active
              </span>
            </div>
            <div className="w-full font-mono text-base font-bold text-[#143a72] dark:text-blue-400 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between transition-colors">
              <span>Configured per machine</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">19.5g to 680g</span>
            </div>
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
                  { code: 'H-01', vendor: 'Husky Fully Automatic', cavities: 96, product: 'Water preforms (19.5 g)', defaultW: 19.5 },
                  { code: 'H-02', vendor: 'Husky Fully Automatic', cavities: 96, product: 'Water preforms (19.5 g)', defaultW: 19.5 },
                  { code: 'H-03', vendor: 'Husky Fully Automatic', cavities: 72, product: 'CSD preforms (26.0 g) · S5', defaultW: 26.0 },
                  { code: 'H-04', vendor: 'Husky Fully Automatic', cavities: 72, product: 'CSD preforms (26.0 g)', defaultW: 26.0 },
                  { code: 'S-01', vendor: 'ABS Semi Automatic', cavities: 4, product: '20 Litre jar preforms (680 g)', defaultW: 680.0 },
                  { code: 'S-02', vendor: 'ABS Semi Automatic', cavities: 4, product: '20 Litre jar preforms (680 g)', defaultW: 680.0 }
                ].map((m) => (
                  <tr key={m.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#143a72] dark:text-blue-400">{m.code}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{m.vendor}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{m.cavities}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{m.product}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <input
                          type="number"
                          step="0.1"
                          value={machineWeights?.[m.code] ?? m.defaultW}
                          onChange={(e) => setMachineWeight(m.code, e.target.value)}
                          className="w-24 text-right font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 focus:border-[#143a72] dark:focus:border-blue-400 focus:outline-hidden transition-colors"
                        />
                        <span className="text-[11px] text-slate-400 font-sans">g</span>
                      </div>
                    </td>
                  </tr>
                ))}
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

      </div>
    </Shell>
  );
};
export default SettingsPage;
