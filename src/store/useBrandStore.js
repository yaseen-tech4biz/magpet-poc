import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBrandStore = create(
  persist(
    (set) => ({
      logoUrl: '/assets/magpet-logo.png',
      parentLogoUrl: '/assets/magnumgroup-logo.png',
      accentColor: '#143a72',

      setLogoUrl: (url) => set({ logoUrl: url }),
      setParentLogoUrl: (url) => set({ parentLogoUrl: url }),
      setAccentColor: (color) => {
        set({ accentColor: color });
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--themeColor', color);
        }
      },
      resetBrand: () => set({
        logoUrl: '/assets/magpet-logo.png',
        parentLogoUrl: '/assets/magnumgroup-logo.png',
        accentColor: '#143a72'
      })
    }),
    {
      name: 'magpet_brand_storage_v1',
      partialize: (state) => ({
        logoUrl: state.logoUrl,
        parentLogoUrl: state.parentLogoUrl,
        accentColor: state.accentColor
      })
    }
  )
);
