/**
 * Magpet Operations Intelligence — Service Worker
 * Ensures 100% offline functionality, offline caching, and asset persistence.
 */

const APP_SHELL_CACHE = 'magpet-shell-v1';
const RUNTIME_CACHE = 'magpet-runtime-v1';
const FONT_CACHE = 'magpet-fonts-v1';

const ALL_CACHES = [APP_SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE];

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/favicon.svg',
  '/icons.svg',
  '/assets/favicon.png',
  '/assets/magpet-logo.png',
  '/assets/magnumgroup-logo.png'
];

// Install: Pre-cache core app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      // Add each asset individually to avoid failing the whole cache if one is 404
      const promises = PRECACHE_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch {
          // Ignore individual fetch errors during pre-cache
        }
      });
      await Promise.all(promises);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => !ALL_CACHES.includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Check if request is for Google Fonts
const isFontRequest = (url) => {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
};

// Helper: Check if request is a navigation (SPA route)
const isNavigationRequest = (request) => {
  return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
};

// Fetch: Custom offline-first caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Google Fonts: Cache-First strategy
  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cachedResponse || new Response('', { status: 408, statusText: 'Offline Font Not Cached' });
        }
      })
    );
    return;
  }

  // 2. Navigation Requests: Network-First with Fallback to Cached index.html
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response && response.status === 200) {
            const cache = await caches.open(APP_SHELL_CACHE);
            cache.put(request, response.clone());
            cache.put('/index.html', response.clone());
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback for any route (e.g., /rpet, /preform, /settings)
          const cache = await caches.open(APP_SHELL_CACHE);
          const cachedIndex = (await cache.match(request)) || (await cache.match('/index.html')) || (await cache.match('/'));
          if (cachedIndex) {
            return cachedIndex;
          }
          return new Response('Offline - App Shell Cached', {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Images, SVGs, Favicons): Stale-While-Revalidate / Cache-First
  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      // Fetch in background to update cache
      const fetchPromise = fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, we will return cachedResponse if available
          return cachedResponse;
        });

      // If we have cached response, return it immediately; otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

// Handle custom messages (e.g. Cache Warming or manual updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'WARM_CACHE' && Array.isArray(event.data.urls)) {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return Promise.all(
          event.data.urls.map(async (url) => {
            try {
              const res = await fetch(url, { cache: 'no-cache' });
              if (res.ok) {
                await cache.put(url, res);
              }
            } catch {
              // Ignore individual warm errors
            }
          })
        );
      })
    );
  }
});
