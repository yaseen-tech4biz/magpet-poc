import React from 'react';
import { motion } from 'framer-motion';

export const KpiCard = ({ value, unit, label, trendText, trendType = 'neutral', colorTheme = 'default' }) => {
  const colorMap = {
    green: 'text-emerald-700',
    red: 'text-rose-600',
    amber: 'text-amber-600',
    blue: 'text-[#143a72]',
    default: 'text-slate-900'
  };

  const trendMap = {
    up: 'text-rose-600 font-medium',
    down: 'text-emerald-700 font-medium',
    neutral: 'text-slate-500',
    amber: 'text-amber-600 font-medium'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-slate-200 p-5 card-shadow hover:border-slate-300 transition-colors"
    >
      <div className="flex items-baseline">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`font-mono text-3xl font-bold tracking-tight ${colorMap[colorTheme] || colorMap.default}`}
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-sm font-medium text-slate-500 ml-1.5 font-mono">
            {unit}
          </span>
        )}
      </div>

      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-2 font-heading">
        {label}
      </div>

      {trendText && (
        <div className={`font-mono text-xs mt-1.5 flex items-center gap-1 ${trendMap[trendType] || trendMap.neutral}`}>
          {trendText}
        </div>
      )}
    </motion.div>
  );
};
