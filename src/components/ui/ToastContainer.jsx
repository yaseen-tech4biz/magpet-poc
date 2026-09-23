import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <span className="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>;
      case 'warning':
        return <span className="text-amber-500 dark:text-amber-400 font-bold">⚠</span>;
      case 'error':
        return <span className="text-rose-500 dark:text-rose-400 font-bold">✕</span>;
      case 'whatsapp':
        return (
          <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold">
            W
          </span>
        );
      default:
        return <span className="text-blue-500 dark:text-blue-400 font-bold">ℹ</span>;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/95 dark:bg-emerald-950/90';
      case 'warning':
        return 'border-amber-300 dark:border-amber-800/80 bg-amber-50/95 dark:bg-amber-950/90';
      case 'error':
        return 'border-rose-300 dark:border-rose-800/80 bg-rose-50/95 dark:bg-rose-950/90';
      case 'whatsapp':
        return 'border-emerald-400 dark:border-emerald-700 bg-white dark:bg-slate-900';
      default:
        return 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900';
    }
  };

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto border rounded-xl p-3.5 shadow-xl flex items-start gap-3 backdrop-blur-md transition-colors ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-normal">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-bold px-1 cursor-pointer"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default ToastContainer;
