import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://neha123-uwym.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/search': {
        target: 'https://neha123-uwym.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/sample-image': {
        target: 'https://neha123-uwym.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'https://neha123-uwym.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/register': {
        target: 'https://neha123-uwym.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'https://neha123-uwym.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
