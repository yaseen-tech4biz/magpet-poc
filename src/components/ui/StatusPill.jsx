import React from 'react';

export const StatusPill = ({ type = 'default', children, className = '' }) => {
  const styles = {
    p1: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    p2: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
    p3: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    red: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
    green: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/60',
    grey: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  };

  const chosenStyle = styles[type.toLowerCase()] || styles.default;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider border ${chosenStyle} ${className}`}>
      {children}
    </span>
  );
};

export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all rounded-md focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#143a72] hover:bg-[#0c2347] text-white shadow-xs',
    green: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs',
    secondary: 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-base px-5 py-2.5'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </button>
  );
};
export default StatusPill;
