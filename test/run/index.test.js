import path from 'path';
import compiler from './compiler'
const webpackOptions = require('../build/options.js')
test('index', async () => {
  const ITEM_PATH = '../apis/index'
  const options = webpackOptions(ITEM_PATH, {
    loader: path.resolve(__dirname, '../../lib/index.js'),
    options: {
      data: 'values',
      http: 'https'
    }
  })
  options.resolve = {
    alias: {
      test: path.resolve(__dirname, '../../test'),
    }
  }
  const stats = await compiler(options)
  // 导出去的值
  const data = stats.toJson().modules[0].providedExports
  expect(data).toEqual([
    "default",
    "deleteComment",
    "deteleCommodity",
    "getComment",
    "getCommentList",
    "getCommodity",
    "getCommodityList",
    "getLive",
    "getOrder",
    "getUserInfo",
    "postComment",
    "postCommodity",
    "postLive",
    "postOrder",
    "putComment",
    "putCommodity",
    "putUserInfo",
  ])
})
test('default', async () => {
  const ITEM_PATH = '../apis/default'
  const options = webpackOptions(ITEM_PATH, {
    loader: path.resolve(__dirname, '../../lib/index.js')
  })
  const stats = await compiler(options)
  // 导出去的值
  const data = stats.toJson().modules[0].providedExports
  expect(data).toEqual([
    "default",
    "deteleCommodity",
    "getCommodity",
    "getCommodityList",
    "postCommodity",
    "putCommodity",
  ])
})