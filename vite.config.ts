import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'assets/images/Icon_192x192.webp',
        'assets/images/Icon_512x512.webp'
      ],
      manifest: {
        name: 'MindEaze - Daily Mood Journal & Wellness Buddy',
        short_name: 'MindEaze',
        description: 'Track your mood, journal your thoughts, and practice mindfulness',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'assets/images/Icon_192x192.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'maskable any'
          },
          {
            src: 'assets/images/Icon_512x512.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'maskable any'
          },
          {
            src: 'assets/images/Icon_180x180.webp',
            sizes: '180x180',
            type: 'image/webp',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: 'assets/images/Picture_1.webp',
            sizes: '390x844',
            type: 'image/webp',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: process.env.NODE_ENV === 'development',
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-react': ['lucide-react']
        }
      }
    }
  }
});