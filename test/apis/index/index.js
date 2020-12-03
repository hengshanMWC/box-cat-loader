import BoxCat from 'box-cat'
import response from '../../response'
import commodity from './commodity'
import user from './user'
const data =  {
  ...commodity,
  ...user,
  postOrder: 'order',
  getOrder: 'order/:id'
}
const http = new BoxCat(data, response)
export default http