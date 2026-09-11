import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBrandStore } from '../../store/useBrandStore';

export const Topbar = () => {
  const location = useLocation();
  const { logoUrl } = useBrandStore();
  const currentPath = location.pathname;

  const mainTabs = [
    { to: '/', label: 'Home', active: currentPath === '/' },
    { to: '/rpet', label: 'Kharagpur · rPET', active: currentPath.startsWith('/rpet') },
    { to: '/preform', label: 'Hooghly · Preforms', active: currentPath.startsWith('/preform') },
    { to: '/settings', label: 'Settings', active: currentPath === '/settings' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">

        {/* Brand Wordmark / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Magpet"
              className="h-8 w-auto object-contain bg-white rounded p-0.5 border border-slate-100"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-slate-500 tracking-wider uppercase">
                Operations Intelligence
              </span>
            </div>
          </div>
        </Link>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {mainTabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${tab.active
                ? 'bg-[#143a72] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Action Group: Ask & POC Demo Pill Badge */}
        <div className="flex items-center gap-2">


          <div className="hidden sm:flex items-center">
            <span className="font-mono text-xs tracking-widest uppercase font-semibold text-amber-700 bg-amber-50 border border-amber-300/80 px-2.5 py-1 rounded-md">
              POC Demo
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
