const fs = require('fs')
const path = require('path')
function isFile (filePath) {
  return /\.js$/.test(filePath)
}
function fileNameSupply (filePath) {
  const isF = isFile(filePath)
  // .js
  if (isF) return { filePath, isPeer: true }
  try {
    fs.accessSync(filePath)
    // 如果是目录的话，默认到目录下的index.js
    if (!isF) {
      return {
        filePath: path.resolve(filePath, 'index.js'),
        isPeer: false
      }
    }
  } catch (e) {
    // 不是目录，并且没有.js
    return {
      filePath: filePath + '.js',
      isPeer: true
    }
  }
}
exports.isFile = isFile
exports.fileNameSupply = fileNameSupply