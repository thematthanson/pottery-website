import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Root directory
  base: '/pottery-website/', // Replace with your repository name
  build: {
    outDir: '../dist', // Output directory
    assetsDir: 'assets', // Assets directory
    emptyOutDir: true, // Clean output directory before building
  },
});