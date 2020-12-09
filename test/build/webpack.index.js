const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ITEM_PATH = '../apis/index'
module.exports = {
  mode: 'development',
  devtool:'source-map',
  entry: path.resolve(__dirname, ITEM_PATH, 'index.js'),
  output: {
    path: path.resolve(__dirname, ITEM_PATH, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, ITEM_PATH, 'index.js')
        ],
        use: {
          loader: path.resolve(__dirname, '../../lib/index.js'),
          options: {
            data: 'values',
            http: 'https'
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, ITEM_PATH, 'dist')]
    }),
  ]
}