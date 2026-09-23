import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useBrandStore } from '../../store/useBrandStore';
import { useThemeStore } from '../../store/useThemeStore';

export const Topbar = () => {
  const location = useLocation();
  const { logoUrl } = useBrandStore();
  const { isDark, toggleTheme } = useThemeStore();
  const currentPath = location.pathname;

  const mainTabs = [
    { to: '/', label: 'Home', active: currentPath === '/' },
    { to: '/rpet', label: 'Kharagpur · rPET', active: currentPath.startsWith('/rpet') },
    { to: '/preform', label: 'Hooghly · Preforms', active: currentPath.startsWith('/preform') },
    { to: '/settings', label: 'Settings', active: currentPath === '/settings' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">

        {/* Brand Wordmark / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Magpet"
              className="h-8 w-auto object-contain bg-white rounded p-0.5 border border-slate-100 dark:border-slate-700"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
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
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Action Group: Theme Toggle & POC Demo Pill Badge */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-hidden cursor-pointer flex items-center justify-center shadow-2xs"
          >
            {isDark ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
            )}
            <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <div className="hidden sm:flex items-center">
            <span className="font-mono text-xs tracking-widest uppercase font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700/60 px-2.5 py-1 rounded-md">
              POC Demo
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
export default Topbar;
