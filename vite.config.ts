import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react';
          if (id.includes('lucide-react')) return 'icons';
        },
      },
    },
  },
})
