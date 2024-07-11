import url from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import { fixupPluginRules } from "@eslint/compat";
import eslint from '@eslint/js';
import deprecationPlugin from 'eslint-plugin-deprecation';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import eslintPluginPlugin from 'eslint-plugin-eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginJs from "@eslint/js";

import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['deprecation']: fixupPluginRules(deprecationPlugin),
      ['eslint-comments']: eslintCommentsPlugin,
      ['eslint-plugin']: eslintPluginPlugin,
      ['import']: fixupPluginRules(importPlugin),
      ['jest']: jestPlugin,
      ['jsx-a11y']: fixupPluginRules(jsxA11yPlugin),
      ['simple-import-sort']: simpleImportSortPlugin,
      ['unicorn']: unicornPlugin,
    },
  },
  {
    ignores: [
      ".astro/**",
      ".sst/**",
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
      "packages/frontend/lib/**",
    ],
  },
  eslint.configs.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals.node,
      },
      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json'
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // make sure we're not leveraging any deprecated APIs
      'deprecation/deprecation': 'error',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          peerDependencies: true,
          optionalDependencies: false,
        },
      ],

    }
  },
  {
    files: [
      "src/**/*.{js,mjs,cjs,ts}",
      "projects/frontend/src/**/*.{js,mjs,cjs,ts}"
    ]
  },
  {
    files: [
      '**/*.js'
    ],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      // turn off other type-aware rules
      'deprecation/deprecation': 'off',

      // turn off rules that don't apply to JS code
      '@typescript-eslint/explicit-function-return-type': 'off',
    }
  }
);