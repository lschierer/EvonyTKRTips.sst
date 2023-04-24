import {nodeResolve} from '@rollup/plugin-node-resolve';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import css from 'rollup-plugin-import-css';
import esbuild from 'rollup-plugin-esbuild';
import path from 'path';

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[name]-[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: false,
      injectServiceWorker: false,
      strictCSPInlineScripts: true,
      extractAssets: false,
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS, compile JS to a lower language target */
    esbuild({
      minify: false,
      target: ['esnext','chrome64', 'firefox67', 'safari11.1'],
    }),
    /** Bundle assets references via import.meta.url */
    css({
      output: path.join(process.cwd(),'/dist/bundle.css'),
      minify: false,
      alwaysOutput: true,
    }),
    importMetaAssets(),


  ],
};
