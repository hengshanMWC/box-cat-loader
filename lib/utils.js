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
function getResolvingAliasUrl (alias, url) {
  const strPatt
    = Object.keys(alias)
        .map(key => `(${key})`)
        .join('|')
  const patt = new RegExp('^' + strPatt)
  const execResult = patt.exec(url)
  if (execResult) {
    return url.replace(new RegExp(execResult[0]), alias[execResult[0]])
  } else {
    return url
  }
}
exports.isFile = isFile
exports.fileNameSupply = fileNameSupply
exports.getResolvingAliasUrl = getResolvingAliasUrl