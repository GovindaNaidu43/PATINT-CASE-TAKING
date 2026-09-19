import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for Electron
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@packages': path.resolve(__dirname, '../../packages'),
    },
  },
  server: {
    fs: {
      allow: ['..', '../../packages'],
    },
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:8000',
        rewrite: (requestPath) => requestPath.replace(/^\/api/, '') || '/',
        configure: (proxy) => {
          proxy.on('proxyReq', (request) => {
            request.setHeader('X-Kiosk-Key', process.env.KIOSK_API_KEY || 'local-development-kiosk-key');
          });
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
  },
});
