# Features
一个自动添加export的插件与[box-cat]('https://github.com/hengshanMWC/film)绝配
# Scene
[强行震惊！竟然解决了请求接口中的冗余]('https://juejin.cn/post/6850418120830976007')

**box-cat**是一个接口工厂函数，通过object的形似生成接口函数
```js
// apis/index.js
import { createApis } from 'box-cat'
import axios from 'axios'
import data from './data'
const http = createApis(data, axios)
export default http
```
我们是通过整一个export default导出去。但是有时候我们希望export这种按需加载并且来源明确的引用，但是如果我们通过工厂生成后再一个个export出去，未免也太low了。所以想着写一个loader来在编译时自动export出去

# Introduction
通过include指定出口文件
```js
// 例子
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'apis/index.js')
        ],
        use: 'box-cat-loader'
      }
    ]
  },
}
```
```js
// box-cat-loader的默认options
module.exports =  {
  data: 'data', // 数据变量名
  http: 'http' // 需要export的变量名
}
```
# Rule
数据只能通过默认导出或者声明变量，而且值的格式只能是object{},还是不清楚的，可以倒test目录下查看demo
```js
// 例子
// 声明变量
const data = {} // let,var也可以
// data.js
export default {}
// index.js
import data from 'data'
```

# End

这个不止是配合box-cat的，一些同类型的工厂也可以使用，数据 + 工厂 = 产品。然后通过loader来进行编译时export
