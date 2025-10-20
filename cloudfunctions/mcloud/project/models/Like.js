const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

class Like {
  constructor() {
    this.collection = db.collection('likes')
  }

  async exists(userId, targetType, targetId) {
    return this.collection.where({ userId, targetType, targetId }).count()
  }

  async add(data) {
    return this.collection.add({ data })
  }
}

module.exports = Like