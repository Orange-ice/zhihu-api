const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const {secret} = require('../config')

const selects = '+locations +business +employment +educations'

class UsersController {
  // 查询用户列表
  async find(ctx) {
    ctx.body = await User.find()
  }

  // 查询特定用户
  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
      .select(selects)
      .populate('following locations business employment.company employment.job educations.school educations.major')
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
      password: {type: 'string', required: false},
      avatar: {type: 'string', required: false},
      gender: {type: 'string', required: false},
      headline: {type: 'string', required: false},
      locations: {type: 'array', itemType: 'string', required: false},
      business: {type: 'string', required: false},
      employment: {type: 'array', itemType: 'object', required: false},
      educations: {type: 'array', itemType: 'object', required: false}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true, // 返回修改后的对象
      useFindAndModify: false
    }).select(selects)
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

  // 获取某个用户关注的人的列表
  async listFollowing(ctx) {
    // 获取following数组并填充用户数据
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.following
  }

  // 获取某个用户的粉丝列表
  async listFollowers(ctx) {
    const users = await User.find({following: ctx.params.id})
    ctx.body = users
  }

  // 根据id检测是否存在对应用户
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {ctx.throw(404, '用户不存在')}
    await next()
  }

  // 关注别人
  async follow(ctx) {
    const currentUser = await User.findById(ctx.state.user._id).select('+following')
    if (!currentUser.following.map(id => id.toString()).includes(ctx.params.id)) {
      currentUser.following.push(ctx.params.id)
      currentUser.save()
    }
    ctx.status = 204
  }

  // 取消关注
  async unfollow(ctx) {
    const currentUser = await User.findById(ctx.state.user._id).select('+following')
    const index = currentUser.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index !== -1) {
      currentUser.following.splice(index, 1)
      currentUser.save()
    }
    ctx.status = 204
  }

  // 关注话题
  async followTopic(ctx) {
    const currentUser = await User.findById(ctx.state.user._id).select('+followingTopics')
    if (!currentUser.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      currentUser.followingTopics.push(ctx.params.id)
      currentUser.save()
    }
    ctx.status = 204
  }

  // 取消话题关注
  async unfollowTopic(ctx) {
    const currentUser = await User.findById(ctx.state.user._id).select('+followingTopics')
    const index = currentUser.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if (index !== -1) {
      currentUser.followingTopics.splice(index, 1)
      currentUser.save()
    }
    ctx.status = 204
  }

  // 获取某个用户关注的话题的列表
  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.followingTopics
  }


  // 检查当前登录用户是否操作的是自己
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {ctx.throw(403, '没有权限')}
    await next()
  }

  // 获取用户发表的问题列表
  async listQuestions(ctx) {
    const questions = await Question.find({questioner: ctx.params.id})
    ctx.body = questions
  }

  // 赞某个回答
  async likeAnswer(ctx, next) {
    const currentUser = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if (!currentUser.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      currentUser.likingAnswers.push(ctx.params.id)
      currentUser.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: 1}})
    }
    ctx.status = 204
    await next()
  }

  // 取消赞某个回答
  async unlikeAnswer(ctx) {
    const currentUser = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = currentUser.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index !== -1) {
      currentUser.likingAnswers.splice(index, 1)
      currentUser.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: -1}})
    }
    ctx.status = 204
  }

  // 获取某个用户赞过的回答
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).populate('likingAnswers')
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.likingAnswers
  }


  // 踩某个回答
  async dislikeAnswer(ctx, next) {
    const currentUser = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    if (!currentUser.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      currentUser.dislikingAnswers.push(ctx.params.id)
      currentUser.save()
    }
    ctx.status = 204
    await next()
  }

  // 取消踩某个回答
  async unDislikeAnswer(ctx) {
    const currentUser = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    const index = currentUser.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if (index !== -1) {
      currentUser.dislikingAnswers.splice(index, 1)
      currentUser.save()
    }
    ctx.status = 204
  }

  // 获取某个用户踩过的回答
  async listDisLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).populate('dislikingAnswers')
    if (!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.dislikingAnswers
  }


}

module.exports = new UsersController()