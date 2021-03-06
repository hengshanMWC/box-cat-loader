const { parse } = require('@babel/parser');
const { default: traverse}  = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const loaderUtils = require('loader-utils');
const defaultOptions = require('./options')
const LoadDemand = require('./loadDemand')
module.exports = function (source) {
  const _options = {
    ...defaultOptions,
    ...loaderUtils.getOptions(this)
  }
  const originAST = parse(source, {
    sourceType: 'module'
  })
  traverse(originAST, {
    // 变量定义
    VariableDeclarator: nodePath => {
      const { node } = nodePath
      if (node && node.id.name === _options.data) {
        const loadDemand = new LoadDemand(this, _options, this.context)
        const nodes = loadDemand.getNodes(node.init.properties, originAST)
        originAST.program.body.push(...nodes.map(node => loadDemand.createExport(node)))
        nodePath.stop()
      }
    },
    // 导入
    ImportDeclaration: nodePath => {
      const { node } = nodePath
      if (node && node.specifiers[0].local.name === _options.data) {
        const loadDemand = new LoadDemand(this, _options, this.context)
        const nodes = loadDemand.handleImportDeclaration(node)
        originAST.program.body.push(...nodes.map(node => loadDemand.createExport(node)))
        nodePath.stop()
      }
    }
  })
  const data = generate(originAST, {
    sourceType: 'module'
  })
  return data.code
}