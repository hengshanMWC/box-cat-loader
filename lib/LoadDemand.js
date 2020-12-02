const fs = require('fs')
const path = require('path')
const t = require('@babel/types');
const { default: traverse}  = require('@babel/traverse');
const { parse } = require('@babel/parser');
class LoadDemand {
  constructor (loaderThis, options) {
    this.loaderThis = loaderThis
    this.options = options
  }
  /**
   * 返回export语法的node数组
   * @param {Node[]} properties 
   * @param {File} originAST 
   * @returns {Node[]}
   */
  getExportNodes (properties, originAST) {
    const result = []
    properties.forEach(item => {
      this.getNodes(item, originAST).forEach(nodeItem => {
        result.push(this.createNodeMap(nodeItem))
      })
    })
    return result
  }
  /**
   * 获得每一项的node
   * @param {Node} item 
   * @param {File} originAST 
   * @returns {Array}
   */
  getNodes (item, originAST) {
    let result = []
    // 是否...
    if (t.isSpreadElement(item)) {
      traverse(originAST, {
        ImportDeclaration: nodePath => {
          if (result.length) nodePath.stop()
          const { node } = nodePath
          // node.specifiers是一个数组，因为有可能导出多个，但是规定了export default只能导出一个
          if (node && node.specifiers[0].local.name === item.argument.name) {
            result = this.handleImportDeclaration(node, this.options)
            nodePath.stop()
          }
        },
        VariableDeclarator: nodePath => {
          if (result.length) nodePath.stop()
          const { node } = nodePath
          if (node && node.id.name === item.key.name) {
            result = this.getExportNodes(node.init.properties, originAST, this.options)
            nodePath.stop()
          }
        }
      })
    } else {
      result = [item]
    }
    return result
  }
  handleImportDeclaration (node) {
    let result = []
    const sourceAST = this.getAst(node.source.value)
    traverse(sourceAST, {
      ExportDefaultDeclaration: sourcePath => {
        const { node: defaultNode } = sourcePath
        if (defaultNode && defaultNode.declaration) {
          result = this.getExportNodes(defaultNode.declaration.properties, sourceAST, this.options)
        }
        sourcePath.stop()
      }
    })
    return result
  }
  getAst (sourcePath) {
    const code = fs.readFileSync(
      path.join(loaderThis.resourcePath, sourcePath), 
      'utf-8'
    )
    return parse(code, {
      sourceType: 'module'
    })
  }
  createNodeMap (item) {
    return t.exportNamedDeclaration( // export
      t.variableDeclaration( // 变量声明
        'const',
        [
          t.variableDeclarator( // 变量声明符
            t.identifier(item.key.name), // 标识符
            t.memberExpression( // 标识符.property
              t.identifier(this.options.http), // 标识符
              t.identifier(item.key.name), // 标识符
            )
          )
        ]
      )
    )
  }
}

module.exports = LoadDemand