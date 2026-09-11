import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ title, message, type = 'info', duration = 4000 }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast = { id, title, message, type };

    set({ toasts: [...get().toasts, newToast] });

    if (duration > 0) {
      setTimeout(() => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      }, duration);
    }
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  }
}));
