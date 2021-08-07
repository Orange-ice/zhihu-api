const Topic = require('../models/topic')

class TopicController {
  // 获取所有话题列表
  async find(ctx) {
    let {size = 10, page = 1} = ctx.query
    // Math.max 是使得page， size不小于 1
    page = Math.max(Number(page), 1) - 1
    size = Math.max(Number(size), 1)
    ctx.body = await Topic.find({name: new RegExp(ctx.query.name)}).limit(size).skip(page * size)
  }

  // 根据id获取特定话题
  async findById(ctx) {
    const topic = await Topic.findById(ctx.params.id).select('+introduction')
    if (!topic) {ctx.throw(404, '话题不存在')}
    ctx.body = topic
  }

  // 创建话题
  async create(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      avatar: {type: 'string', required: false},
      introduction: {type: 'string', required: false}
    })
    ctx.body = await new Topic(ctx.request.body).save()
  }

  // 修改话题
  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: false},
      avatar: {type: 'string', required: false},
      introduction: {type: 'string', required: false}
    })
    ctx.body = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true, // 返回修改后的对象
      useFindAndModify: false
    })
  }
}

module.exports = new TopicController()