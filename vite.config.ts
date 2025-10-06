// ai-resume-analyzer/vite.config.ts (FINAL FIX)
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); 
    return {
      // 🚨 CRITICAL FIX: Set the base path to your subdirectory
      base: '/jdvscv/', 
      // This tells Vite to prepend '/jdvscv/' to all asset URLs (e.g., /jdvscv/index.css)
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});