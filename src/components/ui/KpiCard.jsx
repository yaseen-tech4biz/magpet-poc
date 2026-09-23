import React from 'react';
import { motion } from 'framer-motion';

export const KpiCard = ({ value, unit, label, trendText, trendType = 'neutral', colorTheme = 'default' }) => {
  const colorMap = {
    green: 'text-emerald-700 dark:text-emerald-400',
    red: 'text-rose-600 dark:text-rose-400',
    amber: 'text-amber-600 dark:text-amber-400',
    blue: 'text-[#143a72] dark:text-blue-400',
    default: 'text-slate-900 dark:text-slate-100'
  };

  const trendMap = {
    up: 'text-rose-600 dark:text-rose-400 font-medium',
    down: 'text-emerald-700 dark:text-emerald-400 font-medium',
    neutral: 'text-slate-500 dark:text-slate-400',
    amber: 'text-amber-600 dark:text-amber-400 font-medium'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 card-shadow hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
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
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1.5 font-mono">
            {unit}
          </span>
        )}
      </div>

      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-2 font-heading">
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
export default KpiCard;
