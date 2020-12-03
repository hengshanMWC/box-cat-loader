const fs = require('fs')
const path = require('path')
const t = require('@babel/types');
const { default: traverse}  = require('@babel/traverse');
const { parse } = require('@babel/parser');
const { fileNameSupply, isFile } = require('./utils')
class LoadDemand {
  constructor (context, options) {
    this.context = context
    this.options = options
  }
  /**
   * 返回export语法的node数组
   * @param {Node[]} properties 
   * @param {File} originAST 
   * @returns {Node[]}
   */
  getNodes (properties, originAST) {
    return properties
      .map(item => this.fetchNodes(item, originAST))
      .flat()
  }
  /**
   * 获得每一项的node
   * @param {Node} item 
   * @param {File} originAST 
   * @returns {Array}
   */
  fetchNodes (item, originAST) {
    let result = []
    // 是否...
    if (t.isSpreadElement(item)) {
      traverse(originAST, {
        ImportDeclaration: nodePath => {
          if (result.length) nodePath.stop()
          const { node } = nodePath
          // node.specifiers是一个数组，因为有可能导出多个，但是规定了export default只能导出一个
          if (node && node.specifiers[0].local.name === item.argument.name) {
            result = this.handleImportDeclaration(node)
            nodePath.stop()
          }
        },
        VariableDeclarator: nodePath => {
          if (result.length) nodePath.stop()
          const { node } = nodePath
          if (node && node.id.name === item.key.name) {
            result = this.getNodes(node.init.properties, originAST)
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
    const sourceFilePath = path.resolve(this.context, node.source.value)
    const sourceAST = this.getAst(sourceFilePath)
    traverse(sourceAST, {
      ExportDefaultDeclaration: sourcePath => {
        const { node: defaultNode } = sourcePath
        if (defaultNode && defaultNode.declaration) {
          if (isFile(sourceFilePath)) {
            // 还是在当前目录上操作
            result = this.getNodes(defaultNode.declaration.properties, sourceAST)
          } else {
            // 到了其他目录
            const loadDemand = new LoadDemand(sourceFilePath, this.options)
            result = loadDemand.getNodes(defaultNode.declaration.properties, sourceAST)
          }
        }
        sourcePath.stop()
      }
    })
    return result
  }
  getAst (sourcePath) {
    const filePath = fileNameSupply(sourcePath)
    console.log(filePath)
    const code = fs.readFileSync(
      filePath, 
      'utf-8'
    )
    return parse(code, {
      sourceType: 'module'
    })
  }
  createExport (item) {
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