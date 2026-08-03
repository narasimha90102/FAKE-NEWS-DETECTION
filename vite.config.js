import { defineConfig } from 'vite';

export default defineConfig({
  root: './frontend',
  publicDir: './frontend',
  envDir: './frontend',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../dist'
  }
});
