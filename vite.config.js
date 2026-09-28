import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      includeAssets: [
        'favicon.png',
        'favicon.svg',
        'icons.svg',
        'magpet-logo.png',
        'magnumgroup-logo.png',
        'assets/favicon.png',
        'assets/magpet-logo.png',
        'assets/magnumgroup-logo.png'
      ],
      manifest: {
        name: 'Magpet Operations Intelligence',
        short_name: 'Magpet Copilot',
        description: 'Unified Operations Intelligence and Maintenance Copilot for Magpet / Magnum Group',
        theme_color: '#143a72',
        background_color: '#090d16',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/assets/favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/assets/favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/assets/magpet-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // Google Fonts stylesheets (fonts.googleapis.com)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Google Fonts webfont files (fonts.gstatic.com)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Static images & icons
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-image-assets',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    allowedHosts: [
      'snowy-gong-frequency.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000,
  },
})
