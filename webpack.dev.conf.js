const webpack = require('webpack')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: isProd ? false : 'source-map',
  output: {
    filename: `js/[name].min.js`,
    path: baseWebpackConfig.externals.paths.dist,
    publicPath: '/'
  },
  devServer: {
    inline: false,
    open: true,
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})