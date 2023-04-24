module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      extraFileExtensions: [
        '.html'
      ],
      project: [
        "./tsconfig.json"
      ],
      tsconfigRootDir: __dirname,
    },
    root: true,
};
