import merge from 'deepmerge';
import path from 'path';
import { createMpaConfig } from '@open-wc/building-rollup';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

const baseConfig = createMpaConfig({
  html: {
    flattenOutput: false,
    strictCSPInlineScripts: true,
  },
  developmentMode: true,
  injectServiceWorker: false,
  rootDir: process.cwd(),
  outputDir: path.join(process.cwd(), 'dist'),


});

export default merge(baseConfig, {
    input: '*.html',
    plugins: [

    ],
  });

