import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/layout/Shell';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBrandStore } from '../store/useBrandStore';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { formatResinHeld, formatRejBill } = useSettingsStore();
  const { logoUrl, parentLogoUrl } = useBrandStore();

  const plantStats = [
    { num: '40+', label: 'Years of Excellence' },
    { num: '5', label: 'Manufacturing Units' },
    { num: '45,000', label: 'MTPA rPET Resin' },
    { num: '50,000', label: 'MTPA PET Processing' }
  ];

  return (
    <Shell>
      {/* Hero Section */}
      <div className="text-center py-6 sm:py-6">
        {(parentLogoUrl || logoUrl) && (
          <div className="flex items-center justify-center gap-3 mb-4">
            {parentLogoUrl && (
              <img
                src={parentLogoUrl}
                alt="Magnum Group Logo"
                className="h-14 w-auto object-contain bg-white rounded-lg p-2 border border-slate-200 shadow-xs"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Magpet Logo"
                className="h-14 w-auto object-contain bg-white rounded-lg p-2 border border-slate-200 shadow-xs"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#143a72] tracking-tight font-heading">
          Magpet <span className="text-slate-700 font-light">Operations Intelligence</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl mx-auto">
          One unified live operational cockpit across plants, engineered alongside SAP Business One.
        </p>

      </div>

      {/* Two Flagship Plant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

        {/* Plant 1: Kharagpur Unit 3 (rPET Resin) */}
        <div
          onClick={() => navigate('/rpet')}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow card-shadow-hover transition-all cursor-pointer group hover:border-[#143a72] flex flex-col justify-between"
        >
          {/* Plain Dark Typography Hero Panel (Spec Line 66) */}
          <div className="bg-[#0c2347] text-white p-5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Kharagpur · Unit 3
              </span>
              <span className="text-[10px] font-mono text-slate-400">Module A</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2 mb-0.5 font-heading group-hover:text-emerald-300 transition-colors">
              rPET Resin Plant
            </h2>
            <div className="text-[11px] font-mono text-slate-300 tracking-tight">
              45,000 MTPA · Bottle-to-Bottle Recycling
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-3">
                Herbold Meckesheim washing line, Coperion twin-screw extrusion, and SSP reactor.
              </p>

              {/* Product Catalogue Vocabulary (Spec Line 65) */}
              <div className="mb-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Catalogue:</span>
                <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  rPET Flakes
                </span>
                <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  rPET Pellets
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Food-Grade Resin
                </span>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <div className="font-mono text-lg font-bold text-rose-600">3</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-heading">Open Jobs</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-amber-600">62%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-heading">PM Compliance</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900">{formatResinHeld(31.5)}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-heading">Downtime Cost</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#143a72] group-hover:translate-x-1 transition-transform">
                <span>Open Maintenance Copilot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plant 2: Hooghly Unit 1 (PET Preforms) */}
        <div
          onClick={() => navigate('/preform')}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow card-shadow-hover transition-all cursor-pointer group hover:border-[#143a72] flex flex-col justify-between"
        >
          {/* Plain Dark Typography Hero Panel (Spec Line 66) */}
          <div className="bg-[#143a72] text-white p-5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                Hooghly · Unit 1
              </span>
              <span className="text-[10px] font-mono text-slate-400">Module B</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2 mb-0.5 font-heading group-hover:text-cyan-300 transition-colors">
              PET Preforms Plant
            </h2>
            <div className="text-[11px] font-mono text-slate-300 tracking-tight">
              50,000 MTPA · High-Speed Injection Systems
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-3">
                Husky fully automatic injection molding lines and ABS semi-automatic jar lines.
              </p>

              {/* Product Catalogue Vocabulary (Spec Line 65) */}
              <div className="mb-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Catalogue:</span>
                <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  PET Preforms
                </span>
                <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  PET Bottles
                </span>
                <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  20 Litre Jars
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Caps & Closures
                </span>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <div className="font-mono text-lg font-bold text-amber-600">2.1%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-heading">Rejection MTD</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-rose-600">{formatRejBill()}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-heading">Rejection Bill</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-rose-600">3</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-heading">Active Alerts</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#143a72] group-hover:translate-x-1 transition-transform">
                <span>Open Quality Intelligence</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Shell>
  );
};
