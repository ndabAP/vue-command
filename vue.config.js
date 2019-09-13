module.exports = {
  // See https://stackoverflow.com/questions/57916549/vue-cli-run-build-typeerror-name-undefined
  css: {
    sourceMap: true
  },

  publicPath: '',
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({ fix: true })
  }
}
