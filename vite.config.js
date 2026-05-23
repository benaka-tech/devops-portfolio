import { defineConfig } from 'vite';

export default defineConfig({
  base: '/devops-portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});
