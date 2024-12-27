import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Set the source directory
  base: '/',   // Use '/' for local development
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});