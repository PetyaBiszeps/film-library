import stylistic from '@stylistic/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [{
  ignores: ['node_modules/**', 'public/**', 'dist/**']
}, ...tseslint.configs.recommended, ...pluginVue.configs['flat/recommended'], {
  files: ['**/*.vue', '**/*.ts', '**/*.js'],
  rules: {
    'no-console': 'warn',
    'no-unreachable': 'error',
    'curly': ['error', 'all'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'no-implicit-coercion': 'error',
    'no-useless-assignment': 'error',
    'preserve-caught-error': 'error',
    'comma-dangle': ['error', 'never'],
    'eqeqeq': ['error', 'always', {
      null: 'ignore'
    }],

    '@stylistic/indent': ['error', 2],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/quote-props': ['error', 'consistent-as-needed'],
    '@stylistic/key-spacing': ['error', {
      beforeColon: false,
      afterColon: true
    }],
    '@stylistic/comma-spacing': ['error', {
      before: false,
      after: true
    }],
    '@stylistic/arrow-spacing': ['error', {
      before: true,
      after: true
    }],
    '@stylistic/space-before-function-paren': ['error', {
      named: 'never',
      anonymous: 'always',
      asyncArrow: 'always'
    }],

    'vue/no-v-html': 'warn',
    'vue/no-empty-component-block': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/component-api-style': ['error', ['script-setup']],
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
    }],
    'vue/block-lang': ['error', {
      script: {
        lang: 'ts'
      },
      style: {
        lang: 'scss'
      }
    }],
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/define-macros-order': ['error', {
      order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
    }],

    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }]
  },
  plugins: {
    '@stylistic': stylistic
  },
  languageOptions: {
    parserOptions: {
      parser: tseslint.parser,
      extraFileExtensions: ['.vue']
    },
    globals: {
      ...globals.browser,
      ...globals.node
    }
  }
}]
