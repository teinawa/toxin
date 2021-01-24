const {merge} = require('webpack-merge');
const fs = require('fs');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');

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

const PAGES_DIR = `${PATHS.src}/pages/`;
const PAGE_FOLDERS = fs.readdirSync(PAGES_DIR);
const PAGES = getFiles(PAGE_FOLDERS, 'pug');

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: []
})

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})