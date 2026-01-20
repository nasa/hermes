import globals from "globals";
import eslint from '@eslint/js';
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            "**/node_modules/",
            ".git",
            "**/out/",
            "**/*.d.ts",
            "**/*.js",
            "src/fallback/**/*.ts",
            "src/internal/**/*.ts",
            "src/modules/rpc/src/proto/**/*.ts"
        ]
    },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-explicit-any": "off",
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            'no-array-constructor': 'off',
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-base-to-string': 'error',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            '@typescript-eslint/no-duplicate-type-constituents': 'error',
            '@typescript-eslint/no-extra-non-null-assertion': 'error',
            '@typescript-eslint/no-for-in-array': 'error',
            'no-implied-eval': 'off',
            '@typescript-eslint/no-implied-eval': 'error',
            'no-loss-of-precision': 'off',
            '@typescript-eslint/no-loss-of-precision': 'error',
            '@typescript-eslint/no-misused-new': 'error',
            'no-async-promise-executor': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/restrict-plus-operands': 'error',
            'semi': 'error',
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ]
        }
    }
];