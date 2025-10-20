const CommentService = require('../services/CommentService')
const PostService = require('../services/PostService')
const Comment = require('../models/Comment')

class CommentController {
  async getByPost(event) {
    const { postId, parentId, rootId, limit } = event
    if (!postId) {
      return { code: 400, msg: 'postId参数缺失' }
    }
    const commentModel = new Comment()
    const res = await commentModel.getByPost(postId, parentId, rootId, limit)
    return { code: 0, data: res.data }
  }

  async addComment(event) {
    const { postId, userId, content, parentId, rootId, replyToUserId } = event
    if (!postId || !userId || !content) {
      return { code: 400, msg: '参数缺失' }
    }
    const commentService = new CommentService()
    const postService = new PostService()

    const data = {
      postId,
      userId,
      content,
      createTime: new Date(),
      parentId: parentId || null,
      rootId: rootId || null,
      replyToUserId: replyToUserId || null,
      likeCount: 0,
      replyCount: 0
    }

    const addRes = await commentService.addComment(data)
    await postService.updateCommentCount(postId, 1)
    if (parentId) {
      await commentService.incReplyCount(parentId, 1)
    }
    return { code: 0, id: addRes._id }
  }
}

module.exports = new CommentController()