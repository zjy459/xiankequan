const User = require('../models/User')

class UserService {
  constructor() {
    this.user = new User()
  }

  async getByIds(userIds) {
    const res = await this.user.getByIds(userIds)
    return res.data
  }
}

module.exports = UserService