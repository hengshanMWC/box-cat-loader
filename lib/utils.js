const fs = require('fs')
const path = require('path')
function isFile (filePath) {
  return /\.js$/.test(filePath)
}
function fileNameSupply (filePath) {
  const isF = isFile(filePath)
  // .js
  if (isF) return filePath
  try {
    fs.accessSync(filePath)
    // 如果是目录的话，默认到目录下的index.js
    if (!isF) {
      return path.resolve(filePath, 'index.js')
    }
  } catch (e) {
    // 不是目录，并且没有.js
    return filePath + '.js'
  }
}
exports.isFile = isFile
exports.fileNameSupply = fileNameSupply