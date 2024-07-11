import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from 'eslint-config-prettier';
import tseslint from "typescript-eslint";


export default [
  {
    ignores: [
      "coverage",
      "public",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "**/node_modules/**",
      "**/bower_components/**",
      "eslint.config.js",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
    ],
  },
  {
    files: [
      "**/*.{js,mjs,cjs,ts}"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];