const { parse } = require('@babel/parser');
const { default: traverse}  = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const loaderUtils = require('loader-utils');
const defaultOptions = require('./options')
const LoadDemand = require('./LoadDemand')
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
        const loadDemand = new LoadDemand(this, this.context, _options)
        const nodes = loadDemand.getNodes(node.init.properties, originAST)
        originAST.program.body.push(...nodes.map(node => loadDemand.createExport(node)))
        nodePath.stop()
      }
    },
    ImportDeclaration: nodePath => {
      const { node } = nodePath
      if (node && node.specifiers[0].local.name === _options.data) {
        const loadDemand = new LoadDemand(this, this.context, _options)
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