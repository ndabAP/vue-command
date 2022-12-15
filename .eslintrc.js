module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: [
    'modules-newline'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'modules-newline/import-declaration-newline': 'error',

    'vue/no-mutating-props': 'off',
    'no-unused-vars': 'off',

    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],

    'vue/max-attributes-per-line': ['error', {
      singleline: 1,
      multiline: 1
    }],

    'vue/attributes-order': 'error',
    'vue/order-in-components': 'error',
    'vue/html-indent': 'error',
    quotes: ['error', 'single']
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
