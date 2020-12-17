const fs = require('fs')
const path = require('path')
const t = require('@babel/types');
const { default: traverse}  = require('@babel/traverse');
const { parse } = require('@babel/parser');
const { fileNameSupply, getResolvingAliasUrl } = require('./utils')
class LoadDemand {
  constructor (loaderThis, options, context) {
    this.loaderThis = loaderThis
    this.options = options
    this.context = context
    this.addDependency(loaderThis.resourcePath)
  }
  get alias () {
    return this.loaderThis._compiler.options.resolve.alias || []
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
  /**
   * ImportDeclaration
   * @param {Node} item 
   * @param {File} originAST 
   * @returns {Array}
   */
  handleImportDeclaration (node) {
    let result = []
    const value = getResolvingAliasUrl(this.alias, node.source.value)
    const sourceFilePath = path.resolve(this.context, value)
    const {
      filePath,
      isPeer 
    } = fileNameSupply(sourceFilePath)
    const sourceAST = this.getAst(filePath)
    traverse(sourceAST, {
      ExportDefaultDeclaration: sourcePath => {
        const { node: defaultNode } = sourcePath
        if (defaultNode && defaultNode.declaration) {
          // 是否同級
          if (isPeer) {
            this.addDependency(filePath)
            // 还是在当前目录上操作
            result = this.getNodes(defaultNode.declaration.properties, sourceAST)
          } else {
            // 到了其他目录
            const loadDemand = new LoadDemand(
              this.loaderThis,
              this.options,
              path.resolve(filePath, '..'),
            )
            result = loadDemand.getNodes(defaultNode.declaration.properties, sourceAST)
          }
        }
        sourcePath.stop()
      }
    })
    return result
  }
  /**
   * 
   * @param {String} filePath 路径
   * @returns {File} AST 
   */
  getAst (filePath) {
    const code = fs.readFileSync(
      filePath, 
      'utf-8'
    )
    return parse(code, {
      sourceType: 'module'
    })
  }
  addDependency (filePath) {
    if (this.loaderThis.mode !== 'development') {
      this.loaderThis.addDependency(filePath)
    }
  }
  /**
   * 
   * @param {Node} node 
   * @returns {ExportNamedDeclaration}
   */
  createExport (node) {
    return t.exportNamedDeclaration( // export
      t.variableDeclaration( // 变量声明
        'const',
        [
          t.variableDeclarator( // 变量声明符
            t.identifier(node.key.name), // 标识符
            t.memberExpression( // 标识符.property
              t.identifier(this.options.http), // 标识符
              t.identifier(node.key.name), // 标识符
            )
          )
        ]
      )
    )
  }
}

module.exports = LoadDemand