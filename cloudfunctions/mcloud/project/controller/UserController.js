const UserService = require('../services/UserService')

class UserController {
  async getUsers(event) {
    const { userIds } = event
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return { code: 400, msg: 'userIds参数缺失' }
    }
    const service = new UserService()
    const users = await service.getByIds(userIds)
    return { code: 0, data: users }
  }
}

module.exports = new UserController()