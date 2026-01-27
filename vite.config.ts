import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group heavy SDKs and UI libraries
            if (id.includes('@supabase') || id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'vendor-core'; 
            }
            // Keep framework core separate
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-framework';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  server: {
    host: true, // Listen on all local IPs
  },
})
