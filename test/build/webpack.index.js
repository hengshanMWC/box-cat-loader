const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpackOptions = require('./options.js')
const ITEM_PATH = '../apis/index'
const options = webpackOptions(ITEM_PATH, {
  loader: path.resolve(__dirname, '../../lib/index.js'),
  options: {
    data: 'values',
    http: 'https'
  }
})
options.resolve = {
  alias: {
    test: path.resolve(__dirname, '../../test'),
  }
}
options.plugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, ITEM_PATH, 'dist')]
  })
]
module.exports = options