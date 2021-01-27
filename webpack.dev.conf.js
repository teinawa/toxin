const webpack =  require('webpack')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')


const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev


const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  devtool: isProd ? false : 'source-map',
  devServer: {
    inline: false,
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    }
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
