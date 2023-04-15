import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import node from 'vite-plugin-node'
import EnvCompatible from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), node, EnvCompatible.default()],
  server: {
    proxy: {
      '/chat': {
        target: 'https://whispering-mesa-44331.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chat/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['@alpacahq/alpaca-trade-api'],
  },
  build: {
    rollupOptions: {
      external: ['@alpacahq/alpaca-trade-api', '@heroicons/react/outline', '@heroicons/react/solid'],
    },
  },
  alias: {
    '@heroicons/react/outline': './node_modules/@heroicons/react/outline.js',
    '@heroicons/react/solid': './node_modules/@heroicons/react/solid.js',
  },  
});
