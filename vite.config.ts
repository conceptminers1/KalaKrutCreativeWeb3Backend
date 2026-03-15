import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['framer-motion'],
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    exclude: ['server'],
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: '9000-firebase-kalakrutcreativekg1-1769075240619.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    allowedHosts: ['.cloudworkstations.dev'],
  },
});
