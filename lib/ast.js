const t = require('@babel/types');
exports.createNodeMap = function (node, options) {
  return node.init.properties.map(item => {
    return t.exportNamedDeclaration( // export
      t.variableDeclaration( // 变量声明
        'const',
        [
          t.variableDeclarator( // 变量声明符
            t.identifier(item.key.name), // 标识符
            t.memberExpression( // 标识符.property
              t.identifier(options.http), // 标识符
              t.identifier(item.key.name), // 标识符
            )
          )
        ]
      )
    )
  })
} 