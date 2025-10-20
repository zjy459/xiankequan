const LikeService = require('../services/LikeService')
const PostService = require('../services/PostService')
const CommentService = require('../services/CommentService')

class LikeController {
  async likePost(event) {
    const { postId, userId } = event
    if (!postId || !userId) {
      return { code: 400, msg: '参数缺失' }
    }
    const likeService = new LikeService()
    const postService = new PostService()
    const exists = await likeService.exists(userId, 'post', postId)
    if (exists) return { code: 1, msg: '已点赞' }
    await likeService.addLike({
      userId,
      targetType: 'post',
      targetId: postId,
      createTime: new Date()
    })
    await postService.updateLikeCount(postId, 1)
    return { code: 0, msg: '点赞成功' }
  }

  async likeComment(event) {
    const { commentId, userId } = event
    if (!commentId || !userId) {
      return { code: 400, msg: '参数缺失' }
    }
    const likeService = new LikeService()
    const commentService = new CommentService()
    const exists = await likeService.exists(userId, 'comment', commentId)
    if (exists) return { code: 1, msg: '已点赞' }
    await likeService.addLike({
      userId,
      targetType: 'comment',
      targetId: commentId,
      createTime: new Date()
    })
    await commentService.incLikeCount(commentId, 1)
    return { code: 0, msg: '点赞成功' }
  }
}

module.exports = new LikeController()