import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectTsConfig = path.resolve(__dirname, 'tsconfig.json');

const baseLanguageOptions = {
  ...js.configs.recommended.languageOptions,
  parser: typescriptParser,
  parserOptions: {
    ...(js.configs.recommended.languageOptions?.parserOptions ?? {}),
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    ...(js.configs.recommended.languageOptions?.globals ?? {}),
    console: 'readonly',
    process: 'readonly',
    Buffer: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
  },
};

const nextRecommended = nextPlugin.configs?.recommended ?? { rules: {} };
const nextCoreWebVitals = nextPlugin.configs?.['core-web-vitals'] ?? { rules: {} };

export default [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'public/assets/**',
      '**/*.d.ts',
      '**/*.map',
      'next-env.d.ts',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: baseLanguageOptions,
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: projectTsConfig,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...nextRecommended.rules,
      ...nextCoreWebVitals.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...baseLanguageOptions,
      parserOptions: {
        ...baseLanguageOptions.parserOptions,
        project: [projectTsConfig],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...typescriptPlugin.configs['recommended-requiring-type-checking'].rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', 'test/**/*.{js,ts}'],
    languageOptions: {
      ...baseLanguageOptions,
      parserOptions: {
        ...baseLanguageOptions.parserOptions,
        project: [projectTsConfig],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...baseLanguageOptions.globals,
        document: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
];
