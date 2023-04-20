import { defineConfig } from 'vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {

      input: {
        main: path.resolve(__dirname, 'index.html'),
        generals: path.resolve(__dirname, 'generals/index.html')
      }
    },
  },
})
