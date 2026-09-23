import React from 'react';

export const Card = ({ title, subtitle, rightElement, children, className = '', highlightBorder = false }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border ${highlightBorder ? 'border-amber-300 dark:border-amber-600/80' : 'border-slate-200 dark:border-slate-800'} p-5 card-shadow transition-all ${className}`}>
      {(title || rightElement) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-heading tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
export default Card;
