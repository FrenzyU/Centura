import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import node from 'vite-plugin-node'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), node],
  optimizeDeps: {
    include: ['@alpacahq/alpaca-trade-api'],
  },
  build: {
    rollupOptions: {
      external: ['@alpacahq/alpaca-trade-api'],
    },
  },
});

