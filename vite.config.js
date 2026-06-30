import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Don't precache hashed JS/CSS bundles eagerly beyond Vite's own
      // output -- and explicitly exclude API/WS traffic from any runtime
      // caching strategy below. Stale cached prices/balances would be a
      // real correctness bug for a live trading app, not just cosmetic.
      workbox: {
        navigateFallbackDenylist: [/^\/api\//, /^\/ws\//],
        runtimeCaching: [
          {
            // Never cache API responses -- always go to network.
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // WebSocket upgrade requests are never cacheable anyway, but
            // make the exclusion explicit so nobody "fixes" this later by
            // adding a catch-all cache rule.
            urlPattern: /\/ws\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
      manifest: {
        name: 'FortuneX',
        short_name: 'FortuneX',
        description: 'Trade synthetic indices in real time.',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#0a0a12',
        theme_color: '#0a0a12',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})