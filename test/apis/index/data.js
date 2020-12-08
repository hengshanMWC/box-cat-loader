import commodity from './commodity'
import comment from './comment'
import user from './user'
export default {
  ...commodity,
  ...user,
  ...comment,
  postOrder: 'order',
  getOrder: 'order/:id'
}