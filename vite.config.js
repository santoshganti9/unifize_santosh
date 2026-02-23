import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (id.includes('@reduxjs') || id.includes('react-redux') || id.includes('redux')) {
            return 'redux-vendor';
          }

          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
});
