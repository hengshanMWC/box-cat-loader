const { parse } = require('@babel/parser');
const { default: traverse}  = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const loaderUtils = require('loader-utils');
const defaultOptions = require('./options')
const LoadDemand = require('./LoadDemand')
let a = 0
module.exports = function (source) {
  const _options = {
    ...defaultOptions,
    ...loaderUtils.getOptions(this)
  }
  const originAST = parse(source, {
    sourceType: 'module'
  })
  traverse(originAST, {
    VariableDeclarator: nodePath => {
      const { node } = nodePath
      if (node && node.id.name === _options.data) {
        const loadDemand = new LoadDemand(this, _options)
        const newNodes = loadDemand.getExportNodes(node.init.properties, originAST)
        originAST.program.body.push(...newNodes)
        nodePath.stop()
      }
    },
  })
  const data = generate(originAST, {
    sourceType: 'module'
  })
  console.log(a++)
  return data.code
}