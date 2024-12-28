import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: 'src',
  base: '/pottery-website/', // Ensure this matches your GitHub Pages repository
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html', // Ensure main entry point is correct
        glitter: 'src/js/glitter.js', // Include glitter.js explicitly
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/images/*', // Copy all image files
          dest: 'assets/images', // Destination in the dist folder
        },
      ],
    }),
  ],
});