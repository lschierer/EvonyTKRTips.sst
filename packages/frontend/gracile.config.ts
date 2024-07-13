import { defineConfig } from '@gracile/gracile';
const path = require('path');

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  vite: {
    resolve: {
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      },
    },
  },
  port: 4567,
});
