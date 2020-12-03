import { createProxy } from 'box-cat'
import response from '../../response'
const data = {
  postCommodity: 'commodity',
  getCommodityList: 'commodity/list',
  getCommodity: 'commodity/:id',
  putCommodity: 'commodity',
  deteleCommodity: 'commodity:id',
}
const http = createProxy(data, response)
export default http