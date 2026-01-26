import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit (optional, but good for large vendors)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI Libraries (heavy)
          'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-label', '@radix-ui/react-radio-group', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-toast', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
          // Animation (very heavy)
          'vendor-motion': ['framer-motion'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
