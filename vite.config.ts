import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'three': ['three'],
          'framer': ['framer-motion'],
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 443
    }
  }
})