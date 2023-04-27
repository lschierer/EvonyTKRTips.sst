// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */

import merge from 'deepmerge';
import path from 'path';
import { createMpaConfig } from '@open-wc/building-rollup';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import packageJson from './package.json' assert { type: 'json' };

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import summary from 'rollup-plugin-summary';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';


export default {
  input: '**/*.html',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
		html({
			minify: false,
			injectServiceWorker: false,
			strictCSPInlineScripts: true,
		}),
    replace({'Reflect.decorate': 'undefined'}),
    resolve(),
    summary(),
  ],
};

