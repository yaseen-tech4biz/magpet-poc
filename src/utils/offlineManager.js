/**
 * Magpet Offline Manager
 * Integrates with Vite PWA & Workbox for automatic cache prefetching,
 * lifecycle management, and offline diagnostics.
 */
import { registerSW } from 'virtual:pwa-register';

const CRITICAL_ROUTES = [
  '/',
  '/rpet',
  '/rpet/plan',
  '/rpet/breakdowns',
  '/rpet/reliability',
  '/rpet/ask',
  '/preform',
  '/preform/machine',
  '/preform/cavity',
  '/settings'
];

/**
 * Register Service Worker via Vite PWA and native fallback
 */
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  // Register via Vite PWA virtual module
  try {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        updateSW(true);
      },
      onOfflineReady() {
        console.log('[PWA] Application is fully cached and ready for offline usage.');
      }
    });

    if (navigator.onLine) {
      warmOfflineCache();
    }

    return updateSW;
  } catch (error) {
    console.warn('[OfflineManager] PWA register error, falling back to native registration:', error);
    
    // Native fallback registration
    try {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] ServiceWorker registered with native fallback:', registration.scope);
          if (navigator.onLine) {
            warmOfflineCache();
          }
        })
        .catch((err) => {
          console.warn('[OfflineManager] Native SW register failed:', err);
        });
    } catch {
      // Ignore
    }
    return null;
  }
};

/**
 * Warm the offline cache by pre-fetching critical application routes
 */
export const warmOfflineCache = async () => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cache = await caches.open('magpet-runtime-v1');
    await Promise.all(
      CRITICAL_ROUTES.map(async (route) => {
        try {
          const res = await fetch(route, { cache: 'no-cache' });
          if (res.ok) {
            await cache.put(route, res);
          }
        } catch {
          // Gracefully ignore individual warm failures
        }
      })
    );
  } catch {
    // Gracefully ignore warm errors
  }
};

/**
 * Check if offline features and CacheStorage are supported
 */
export const isOfflineSupported = () => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'caches' in window;
};

/**
 * Get offline storage estimates
 */
export const getOfflineStorageEstimate = async () => {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usageMb = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2);
      const quotaMb = ((estimate.quota || 0) / (1024 * 1024)).toFixed(2);
      return { usageMb, quotaMb, supported: true };
    } catch {
      return { usageMb: '0.00', quotaMb: '0.00', supported: false };
    }
  }
  return { usageMb: '0.00', quotaMb: '0.00', supported: false };
};

/**
 * Clear all offline caches (used when user wants to reset cache)
 */
export const clearOfflineCache = async () => {
  if (typeof window !== 'undefined' && 'caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    return true;
  }
  return false;
};
