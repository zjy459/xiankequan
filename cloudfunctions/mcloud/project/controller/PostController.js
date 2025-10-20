/** controller 只负责参数校验、业务组装和响应输出，调用对应 service 层 */
const PostService = require('../services/PostService')

class PostController {
  async getPosts(event) {
    // 可加筛选参数
    const service = new PostService()
    const posts = await service.getAll()
    console.log('getPosts result:', posts)
    return { code: 0, data: posts }
  }
}

module.exports = new PostController()