const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getFiles = (dir, fileType) => {
  return dir.map(folder => {
    const folderPath = `${PAGES_DIR}/${folder}`;
    const folderFiles = fs.readdirSync(folderPath);
    const pageFile = folderFiles.find(fileName => fileName.endsWith(`.${fileType}`));
    return pageFile;
  });
}

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pages`;
const PAGE_FOLDERS = fs.readdirSync(PAGES_DIR);
const PAGES = getFiles(PAGE_FOLDERS, 'pug');
const ENTRY_FILES = getFiles(PAGE_FOLDERS, 'js');
const ENTRYS = {};

ENTRY_FILES.forEach((entryFile, index) => {
  const fileName = entryFile.split('.')[0];
  ENTRYS[fileName] = `${PAGES_DIR}/${PAGE_FOLDERS[index]}/${entryFile}`
})

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: ENTRYS,
  output: {
    filename: `js/[name].min.js`,
    path: PATHS.dist,
    publicPath: './'
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
        {
          use: ['pug-loader']
        }
      ]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }, {
      test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
      use: [
        {
          loader: 'file-loader?name=./assets/fonts/[name].[ext]'
        },
      ],
    }, 
    {
      test: /(\.(png|jpe?g|gif)$|^((?!font).)*\.svg$)/,
      rules: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/img',
          }
        },
      ],
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
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
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, 
        {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
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
      '~': PATHS.src,
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].min.css`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
        { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
        { from: `${PATHS.src}/favicons`, to: 'favicons' }
      ]
    }),
    ...PAGES.map((page, index) => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${PAGE_FOLDERS[index]}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    })),
  ],
}