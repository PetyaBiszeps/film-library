import stylistic from '@stylistic/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [{
  ignores: ['node_modules/**', 'public/**', 'dist/**'],
}, ...tseslint.configs.recommended, ...pluginVue.configs['flat/recommended'], {
  files: ['**/*.vue', '**/*.ts', '**/*.js'],
  plugins: {
    '@stylistic': stylistic
  },
  rules: {
    'no-console': 'warn',
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'never'],

    '@stylistic/indent': ['error', 2],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/quote-props': ['error', 'consistent-as-needed'],
    '@stylistic/brace-style': ['error', '1tbs', {
      allowSingleLine: true
    }],

    'vue/multi-word-component-names': 'off',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/attributes-order': ['error', {
      order: [
        'CONDITIONALS',                     // v-if, v-else
        'LIST_RENDERING',                   // v-for
        'TWO_WAY_BINDING',                  // v-model
        'OTHER_DIRECTIVES',                 // v-click-outside
        'RENDER_MODIFIERS',                 // v-once
        'CONTENT',                          // v-html, v-text
        'DEFINITION',                       // :is
        'UNIQUE',                           // :ref, :key
        'GLOBAL',                           // :id
        'OTHER_ATTR',                       // :name, :type, :placeholder, :disabled, :readonly, :autocomplete, :model-value, :class, :style
        'EVENTS'                            // @click, @focus
      ]
    }]
  },
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser,
      extraFileExtensions: ['.vue'],
    },
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
}]