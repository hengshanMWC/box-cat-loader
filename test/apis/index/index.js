import { createProxy } from 'box-cat'
import response from '../../response'
import commodity from './commodity'
import comment from './comment'
import user from './user'
const data =  {
  ...commodity,
  ...user,
  ...comment,
  postOrder: 'order',
  getOrder: 'order/:id'
}
const http = createProxy(data, response)
export default http