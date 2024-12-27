import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pottery-website_V5_WebBuild/', // Replace with your repository name
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});