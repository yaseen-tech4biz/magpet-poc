import { create } from 'zustand';

export const useBrandStore = create((set) => ({
  logoUrl: '/assets/magpet-logo.png',
  parentLogoUrl: '/assets/magnumgroup-logo.png',
  accentColor: '#143a72',

  setLogoUrl: (url) => set({ logoUrl: url }),
  setAccentColor: (color) => {
    set({ accentColor: color });
    document.documentElement.style.setProperty('--themeColor', color);
  }
}));
