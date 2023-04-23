import merge from 'deepmerge';
import { createMpaConfig } from '@open-wc/building-rollup';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import styles from "rollup-plugin-styles";
import litcss from "rollup-plugin-lit-css";
import css from "rollup-plugin-import-css";
import typescript from "@rollup/plugin-typescript";
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import {visualizer}  from 'rollup-plugin-visualizer';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import * as path from 'path';

const _myRoot = path.join(process.cwd());
const plugins = [
  nodeResolve(),
];
console.log(`my root is ${_myRoot}`);

const Config = createMpaConfig({
  outputDir: 'dist',
  developmentMode: true,
  injectServiceWorker: false,
  rootDir: _myRoot,

  nodeResolve: {
    browser: true,
  },
});

export default merge(Config, [
    {
      input: [
        path.join(_myRoot,'./*.html'),
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: path.join(_myRoot,'components'),
        sourcemap: true,
        assetFileNames: '[name]-[hash][extname]',

        dir: 'dist'
      },
      external: [
        '@spectrum-web-components/**',
        /node_modules/
      ],
      preserveEntrySignatures: 'allow-extension',
      plugins: [
        ...plugins,
        html({
           rootDir: _myRoot,
           flattenOutput: false,
           extractAssets: true,
           injectServiceWorker: false,
           strictCSPInlineScripts: true,
           absoluteBaseUrl: 'https://beta.evonytkrtips.net',
           minify: false,
           include:[
             '**/*.html',
             '**/*.png',
             '**/*.svg'
           ],
           exclude:[
             '**/*.css',
           ]
        }),
        styles({
          mode: 'extract',
          modules: true,
        }),
        visualizer({
          brotliSize: true,
          gzipSize: true
        })
      ]

    },
    {
      input: './src/sw.js',
      output: {
        file: './dist/sw.js',
        format: 'iife'
      },
      plugins: [
        ...plugins,
        // This @rollup/plugin-replace instance replaces process.env.NODE_ENV
        // statements in the Workbox libraries to match your current environment.
        // This changes whether logging is enabled ('development') or disabled ('production').
        replace({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        })
      ]
    }
  ]
);
