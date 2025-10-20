const Post = require('../models/Post')

class PostService {
  constructor() {
    this.post = new Post()
  }

  async getAll() {
    const res = await this.post.getAll()
    return res.data
  }

  async updateLikeCount(postId, inc = 1) {
    return this.post.updateLikeCount(postId, inc)
  }

  async updateCommentCount(postId, inc = 1) {
    return this.post.updateCommentCount(postId, inc)
  }
}

module.exports = PostService