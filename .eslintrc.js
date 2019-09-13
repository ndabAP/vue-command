module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never',
      'multiline': 'nerver'
    }],
    'vue/attributes-order': 'error',
    'vue/order-in-components': 'error',
    'vue/html-indent': 'error'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
