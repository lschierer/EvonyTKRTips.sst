module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        "@typescript-eslint/no-unused-vars": [
          "error"
        ],
        "import/no-unresolved": "off",
        "import/extensions": [
            "error",
            "always",
            {
                "ignorePackages": true
            }
        ]
    },
    parserOptions: {
        project: [
            "./tsconfig.json"
        ],
        tsconfigRootDir: __dirname,
    },
    root: true,
};