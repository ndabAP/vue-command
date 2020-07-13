module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
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

  parserOptions: {
    parser: 'babel-eslint'
  }
}
