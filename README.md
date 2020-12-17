# Features
一个自动添加export的插件与[box-cat]('https://github.com/hengshanMWC/film)绝配
# Scene
[强行震惊！竟然解决了请求接口中的冗余]('https://juejin.cn/post/6850418120830976007')

对于同类型的工厂产出来的object，如果每次手动export出去会很low，所以按这个思路写的一个自动添加epxort的loader

**box-cat**是一个接口工厂函数，通过data数据(object)加工成产品http
```js
// apis/index.js
import { createApis } from 'box-cat'
import axios from 'axios'
import data from './data'
const http = createApis(data, axios)
export default http
```
我们是通过export default一整个导出去。但是有时候我们更希望用export这种按需加载并且来源明确去引用，但是如果我们通过工厂生成后再一个个export出去，未免也太low了。所以想着写一个loader来在编译时自动export出去
```js
// apis/data.js
export default {
  getUserInfo: 'userInfo',
  putUserInfo: 'userInfo'
} 
// apis/index.js
import { createApis } from 'box-cat'
import axios from 'axios'
import data from './data'
const http = createApis(data, axios)
export default http
// box-cat-loader就会根据data来添加export
export const getUserInfo = http.getUserInfo
export const putUserInfo = http.putUserInfo
```
数据太多的话，可以按模块拆分成目录，loader会根据你的import路径去找数据，规定模块数据源为export default {}
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
          path.resolve(__dirname, ITEM_PATH, 'index.js')
        ],
        use: {
          loader: path.resolve(__dirname, '../../lib/index.js'),
          options: { // 默认的options如下
            data: 'data', // 数据变量名
            http: 'http' // 产品变量名
          }
        }
      }
    ]
  },
}
```

# Rule
数据只能通过默认导出或者声明变量，而且值的格式只能是{}。
支持数据别名引入
还是不清楚的，可以到test目录下查看demo
```js
// 例子1
// 声明变量
const data = {} // let,var也可以

// 例子2
// data.js
export default {}
// index.js
import data from 'data'
```

# End

这个不止是配合box-cat的，一些同类型的工厂也可以使用，数据 + 工厂 = 产品。然后通过loader来进行编译时export
