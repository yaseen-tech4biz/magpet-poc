import React from 'react';
import { motion } from 'framer-motion';

export const HorizontalBarChart = ({ rows = [], onSelectRow }) => {
  if (!rows || rows.length === 0) return null;

  const max = Math.max(...rows.map((r) => r.v), 1);

  return (
    <div className="space-y-2.5 w-full py-1">
      {rows.map((r, i) => {
        const pct = Math.max(4, (r.v / max) * 100);
        const hasFlag = r.t && r.t.includes('⚑');
        const displayLabel = hasFlag ? r.t.replace('· ⚑', '').trim() : r.t;

        return (
          <div
            key={i}
            onClick={() => onSelectRow && onSelectRow(r)}
            className={`flex items-center gap-2.5 sm:gap-3 text-xs p-1 rounded-lg transition-all ${
              onSelectRow ? 'cursor-pointer hover:bg-slate-50 group' : ''
            }`}
            title={onSelectRow ? `Click to inspect 90-day downtime logs for ${r.l}` : undefined}
          >
            {/* Asset / Category Label */}
            <div className={`w-14 sm:w-16 font-mono font-bold text-slate-700 shrink-0 text-right text-[11px] sm:text-xs ${
              onSelectRow ? 'group-hover:text-[#143a72]' : ''
            }`}>
              {r.l}
            </div>

            {/* Bar Track & Animated Bar */}
            <div className="flex-1 h-5 sm:h-5.5 bg-slate-100 rounded-md overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.85,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`h-full rounded-md transition-opacity ${onSelectRow ? 'group-hover:opacity-90' : ''}`}
                style={{ backgroundColor: r.c || '#143a72' }}
              />
            </div>

            {/* Value & Price Tag (Dedicated right-aligned column, never clipped!) */}
            <div className="w-36 sm:w-48 text-right font-mono text-[10.5px] sm:text-xs text-slate-800 font-semibold whitespace-nowrap shrink-0 flex items-center justify-end gap-1.5">
              <span className={onSelectRow ? 'group-hover:text-[#143a72]' : ''}>{displayLabel}</span>
              {hasFlag && (
                <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-1 py-0.2 rounded text-[10px]" title="Repeat failure detected">
                  ⚑
                </span>
              )}
              {onSelectRow && (
                <span className="text-slate-400 group-hover:text-[#143a72] text-[10px] ml-0.5 font-bold">
                  View
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
