import commodity from './commodity'
import BoxCat from 'box-cat'
import response from '../../response'
const data =  {
  ...commodity
}
const http = new BoxCat(data, response)
export default http