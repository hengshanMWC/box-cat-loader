const path = require('path')
module.exports = function (ITEM_PATH, use) {
  return {
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
          use
        }
      ]
    },
  }
}