import BoxCat from 'box-cat'
import response from '../../response'
import commodity from './commodity'
import userInfo from './userInfo'
const data =  {
  ...commodity,
  ...userInfo
}
const http = new BoxCat(data, response)
export default http