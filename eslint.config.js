// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "astro.config.ts",
      "dist/**/*.js",
      "eslint.config.js",
      "node_modules/**/*.js",
      "src/env.d.ts",
      "src/sst-env.d.ts",
      "src/**/*.js",
      "sst.config.ts",
      "astro.config.ts",
      "eslint.config.js",
      "node_modules",
      "src/env.d.ts",
      "src/sst-env.d.ts",
      "src/**/*.js",
      "sst.config.ts",
      ".sst/**/*.js",
      ".sst/**/*.ts"
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...eslintPluginAstro.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  
);
