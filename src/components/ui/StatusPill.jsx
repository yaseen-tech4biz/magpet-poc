import React from 'react';

export const StatusPill = ({ type = 'default', children, className = '' }) => {
  const styles = {
    p1: 'bg-rose-50 text-rose-700 border-rose-200',
    p2: 'bg-amber-50 text-amber-700 border-amber-200',
    p3: 'bg-slate-100 text-slate-700 border-slate-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    grey: 'bg-slate-100 text-slate-700 border-slate-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200'
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
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs',
    ghost: 'hover:bg-slate-100 text-slate-600',
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
