module.exports = {
  publicPath: '',
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({ fix: true })
  }
}
