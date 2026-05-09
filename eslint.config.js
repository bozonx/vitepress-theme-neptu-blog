import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default tseslint.config(
  { linterOptions: { reportUnusedDisableDirectives: true } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['tests/**'],
    languageOptions: { globals: globals.vitest },
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },

  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        __VUE_OPTIONS_API__: 'readonly',
        __VUE_PROD_DEVTOOLS__: 'readonly',
      },
    },
  },
  eslintConfigPrettier,
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/example/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/docs/**',
      '**/coverage/**',
      '**/.temp/**',
    ],
  }
)
