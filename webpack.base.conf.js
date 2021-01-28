const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const PATHS = {
  src: path.join(__dirname, '/src'),
  dist: path.join(__dirname, '/dist'),
  config: path.join(__dirname, '/'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  // BASE config
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.pug$/,
      oneOf: [
        // this applies to pug imports inside JavaScript
        {
          use: ['pug-loader']
        }
      ]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    },{
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        // MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            esModule: false,
            sourceMap: true 
            }
        }, 
        {
            loader: 'postcss-loader',
            'options': {
                // All postcss options is now under `postcssOptions`
                'postcssOptions': {
                  'config': path.resolve(PATHS.config, 'postcss.config.js'),
                },
                'sourceMap': true,
              },
          }, 
        {
          loader: 'resolve-url-loader',
          options: {
            root: `${PATHS.src}/${PATHS.assets}/styles`,
          }
        }, 
        {
          loader: 'sass-loader',
          options: { sourceMap: true }
        },
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        // MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            esModule: false,
            sourceMap: true 
            }
        }, 
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          'loader': 'postcss-loader',
          'options': {
            // All postcss options is now under `postcssOptions`
            'postcssOptions': {
              'config': path.resolve(PATHS.config, 'postcss.config.js'),
            },
            'sourceMap': true,
          },
        },
        {
          loader: 'resolve-url-loader',
          options: {
            root: path.join(__dirname, 'src')
          }
        }, 
      ]
    }]
  },
  resolve: {
    alias: {
      '~': PATHS.src
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin({
      patterns: [
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` ,
       from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` }
      ]
    }),

    // Automatic creation any html pages (Don't forget to RERUN dev server)
    // see more: https://github.com/vedees/webpack-template/blob/master/README.md#create-another-html-files
    // best way to create pages: https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
    ...PAGES.map(page => new HtmlWebpackPlugin({
      minify: false,
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
  ],
}