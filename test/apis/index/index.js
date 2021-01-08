import { createProxy } from 'box-cat'
import response from 'test/response'
import values from 'test/apis/index/data'
// import commodity from './commodity'
// import comment from './comment'
// import user from './user'
// const values =  {
//   ...commodity,
//   ...user,
//   ...comment,
//   postOrder: 'order',
//   getOrder: 'order/:id'
// }
const https = createProxy(values, response)
export default https