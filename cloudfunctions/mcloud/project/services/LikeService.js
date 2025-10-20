const Like = require('../models/Like')

class LikeService {
  constructor() {
    this.like = new Like()
  }

  async exists(userId, targetType, targetId) {
    const res = await this.like.exists(userId, targetType, targetId)
    return res.total > 0
  }

  async addLike(data) {
    return this.like.add(data)
  }
}

module.exports = LikeService