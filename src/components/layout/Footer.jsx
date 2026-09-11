import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/95 backdrop-blur-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-slate-500 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Magpet Operations Intelligence · POC</span>
      </div>
      <div className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 text-[9px] sm:text-[10px]">
        Demonstration build · simulated data
      </div>
      <div className="text-slate-500 hidden xs:inline">Tech4Biz Solutions</div>
    </footer>
  );
};
