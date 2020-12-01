const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ITEM_PATH = '../apis/default'
module.exports = {
  mode: 'development',
  devtool:'source-map',
  entry: path.join(__dirname, ITEM_PATH, 'index.js'),
  output: {
    path: path.join(__dirname, ITEM_PATH, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: path.join(__dirname, '../../lib/index.js')
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, ITEM_PATH, 'dist')]
    }),
  ]
}