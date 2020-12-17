import { createProxy } from 'box-cat'
import response from 'test/response'
import values from 'test/apis/index/data'
const https = createProxy(values, response)
export default https