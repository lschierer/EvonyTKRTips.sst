// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    ignores: [
			".astro/*.js",
			".astro/*.ts",
      "astro.config.ts",
			"commitlint.config.js",
      "dist/**/*.js",
      "dist/**/*.mjs",
      "eslint.config.js",
      "node_modules/**/*.js",
      ".nx/**/*.js",
      "src/env.d.ts",
      "src/sst-env.d.ts",
      "sst-env.d.ts",
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
      ".sst/**/*.mjs",
      ".sst/**/*.ts"
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/unbound-method": "off",
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
