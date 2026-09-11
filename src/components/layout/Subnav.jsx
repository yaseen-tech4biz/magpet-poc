import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Subnav = ({ moduleType }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const rpetTabs = [
    { to: '/rpet', label: 'Dashboard', exact: true },
    { to: '/rpet/plan', label: 'Daily plan' },
    { to: '/rpet/breakdowns', label: 'Breakdowns' },
    { to: '/rpet/reliability', label: 'Reliability' },
    { to: '/rpet/ask', label: 'Ask' }
  ];

  const preformTabs = [
    { to: '/preform', label: 'Overview', exact: true },
    { to: '/preform/machine', label: 'Machine drilldown' },
    { to: '/preform/cavity', label: 'Cavity heatmap' }
  ];

  const tabs = moduleType === 'A' ? rpetTabs : moduleType === 'B' ? preformTabs : null;

  if (!tabs) return null;

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar py-1 sm:py-0 -mb-px">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? currentPath === tab.to
              : currentPath === tab.to || currentPath.startsWith(tab.to + '/');

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`py-2 sm:py-3 px-2.5 sm:px-1 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-[#143a72] text-[#143a72] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
