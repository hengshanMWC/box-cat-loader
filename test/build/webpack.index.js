const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ITEM_PATH = '../apis/index'
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
        include: [
          path.join(__dirname, ITEM_PATH, 'index.js')
        ],
        // extend: [
        //   path.join(__dirname, ITEM_PATH, 'index.js')
        // ],
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