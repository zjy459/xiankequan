const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

class Post {
  constructor() {
    this.collection = db.collection('posts')
  }

  async getAll() {
    return this.collection.orderBy('createTime', 'desc').get()
  }

  async updateLikeCount(postId, inc = 1) {
    return this.collection.doc(postId).update({
      data: { likeCount: db.command.inc(inc) }
    })
  }

  async updateCommentCount(postId, inc = 1) {
    return this.collection.doc(postId).update({
      data: { commentCount: db.command.inc(inc) }
    })
  }
}

module.exports = Post