import { createProxy } from 'box-cat'
import response from '../../response'
import values from './data'
const https = createProxy(values, response)
export default https