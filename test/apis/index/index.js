import { createProxy } from 'box-cat'
import response from '../../response'
import data from './data'
const http = createProxy(data, response)
export default http