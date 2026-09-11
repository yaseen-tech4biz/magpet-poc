import React from 'react';

export const Card = ({ title, subtitle, rightElement, children, className = '', highlightBorder = false }) => {
  return (
    <div className={`bg-white rounded-xl border ${highlightBorder ? 'border-amber-300' : 'border-slate-200'} p-5 card-shadow transition-all ${className}`}>
      {(title || rightElement) && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-slate-800 font-heading tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {rightElement && (
            <div>{rightElement}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
