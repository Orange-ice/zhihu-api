const jwt = require('jsonwebtoken')
const User = require('../models/users')
const {secret} = require('../config')

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
      name: {type: 'string', required: true},
      password: {type: 'string', required: true}
    })
    // 唯一性校验
    const {name} = ctx.request.body
    const repeatUser = await User.findOne({name})
    if (repeatUser) {
      ctx.throw(409, '用户已存在') // 409---冲突
    }

    ctx.body = await new User(ctx.request.body).save()
  }

  // 更新用户
  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: false},
      password: {type: 'string', required: false}
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

  async login(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', required: true}
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {ctx.throw(401, '用户名或密码不正确')}
    const {_id, name} = user
    const token = jwt.sign({_id, name}, secret, {
      expiresIn: '7d'
    })
    ctx.body = {token}
  }

  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {ctx.throw(403, '没有权限')}
    await next()
  }
}

module.exports = new UsersController()