import { createProxy } from 'box-cat'
import response from '../../response'
import commodity from './commodity'
import userInfo from './userInfo'
const data =  {
  ...commodity,
  ...userInfo
}
const http = createProxy(data, response)
export default http