import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
