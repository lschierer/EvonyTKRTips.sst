import merge from 'deepmerge';
import path from 'path';
import { createMpaConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createMpaConfig({
  developmentMode: true,
  injectServiceWorker: true,
  rootDir: process.cwd(),
  outputDir: path.join(process.cwd(), 'dist'),
});

export default merge(baseConfig, {
    input: './index.html',
    plugins: [
      typescript({
        tsconfig: path.join(process.cwd(), '/tsconfig.json'),
        experimentalDecorators: true,
        target: 'esnext',
        compilerOptions:{
          jsx: 'preserve',
          outDir: path.join(process.cwd(),'dist'),
        }
      })
    ],
  });

