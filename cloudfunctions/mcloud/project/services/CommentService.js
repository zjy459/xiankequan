const Comment = require('../models/Comment')

class CommentService {
  constructor() {
    this.comment = new Comment()
  }

  async getByPost(postId, parentId = null, rootId = null, limit = 10) {
    const res = await this.comment.getByPost(postId, parentId, rootId, limit)
    return res.data
  }

  async addComment(data) {
    return this.comment.add(data)
  }

  async incReplyCount(commentId, inc = 1) {
    return this.comment.incReplyCount(commentId, inc)
  }

  async incLikeCount(commentId, inc = 1) {
    return this.comment.incLikeCount(commentId, inc)
  }
}

module.exports = CommentService