const { parse } = require('@babel/parser');
const { default: traverse}  = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const defaultOptions = require('./options')
const { createNodeMap } = require('./ast')
let a = 0
module.exports = function (source, options = defaultOptions) {
  const originAST = parse(source, {
    sourceType: 'module'
  })
  originASTBody = originAST.program.body
  traverse(originAST, {
    VariableDeclarator (path) {
      const { node } = path
      if (node && node.id.name === options.data) {
        const newNodes = createNodeMap(node, options)
        originASTBody.push(...newNodes)
        path.stop()
      }
    },
  })
  const { code } = generate(originAST, {
    sourceType: 'module'
  })
  console.log(a++)
  return code
}