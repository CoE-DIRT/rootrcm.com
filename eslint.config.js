import js from '@eslint/js';
import globals from 'globals';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import noDefensiveDisclaimers from './scripts/eslint/no-defensive-disclaimers.mjs';

export default [
  { ignores: ['dist', 'dist-staging', 'test-results', 'playwright-report', '.codex-qa'] },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}', '{app,components,content,lib}/**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.test.*', '**/*.spec.*'],
    plugins: { root: { rules: { 'no-defensive-disclaimers': noDefensiveDisclaimers } } },
    rules: { 'root/no-defensive-disclaimers': 'error' },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': hooks, 'react-refresh': refresh },
    rules: { ...js.configs.recommended.rules, ...hooks.configs.recommended.rules, ...refresh.configs.vite.rules },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tseslint.plugin, 'react-hooks': hooks, 'react-refresh': refresh },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      ...refresh.configs.vite.rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
];
