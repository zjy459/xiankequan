const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

class User {
  constructor() {
    this.collection = db.collection('users')
  }

  async getByIds(userIds) {
    return this.collection.where({
      _id: db.command.in(userIds)
    }).get()
  }
}

module.exports = User