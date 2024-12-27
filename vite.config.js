import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: 'src',
  base: '/pottery-website/', // Adjust this for your GitHub Pages repository
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/images/*', // Copy all files in the images directory
          dest: 'assets/images', // Destination in the dist folder
        },
      ],
    }),
  ],
});