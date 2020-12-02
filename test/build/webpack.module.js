const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ITEM_PATH = '../apis/module'
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
          path.join(__dirname, ITEM_PATH)
        ],
        extend: [
          path.join(__dirname, ITEM_PATH, 'index.js')
        ],
        use: {
          loader: path.join(__dirname, '../../lib/index.js'),
          options: {
            httpPath: path.join(__dirname, ITEM_PATH, 'index.js')
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, ITEM_PATH, 'dist')]
    }),
  ]
}