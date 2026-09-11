import React from 'react';
import { Topbar } from './Topbar';
import { Subnav } from './Subnav';
import { Footer } from './Footer';

export const Shell = ({ moduleType, crumb, title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Topbar />
      {moduleType && <Subnav moduleType={moduleType} />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {crumb && (
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
            {crumb}
          </div>
        )}

        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </main>

      <Footer />
    </div>
  );
};
