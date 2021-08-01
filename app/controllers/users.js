const User = require('../models/users')

class UsersController {
  // 查询用户列表
  async find(ctx) {
    ctx.body = await User.find()
  }

  // 查询特定用户
  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  // 新建用户
  async create(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true}
    })
    ctx.body = await new User(ctx.request.body).save()
  }

  // 更新用户
  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  }

  // 删除用户
  async remove(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.status = 204
  }
}

module.exports = new UsersController()