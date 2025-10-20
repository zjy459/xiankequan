const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

class Comment {
  constructor() {
    this.collection = db.collection('comments')
  }

  async getByPost(postId, parentId = null, rootId = null, limit = 10) {
    let where = { postId }
    if (parentId !== undefined) where.parentId = parentId
    if (rootId !== undefined) where.rootId = rootId
    return this.collection.where(where).orderBy('createTime', 'asc').limit(limit).get()
  }

  async add(data) {
    return this.collection.add({ data })
  }

  async incReplyCount(commentId, inc = 1) {
    return this.collection.doc(commentId).update({
      data: { replyCount: db.command.inc(inc) }
    })
  }

  async incLikeCount(commentId, inc = 1) {
    return this.collection.doc(commentId).update({
      data: { likeCount: db.command.inc(inc) }
    })
  }
}

module.exports = Comment