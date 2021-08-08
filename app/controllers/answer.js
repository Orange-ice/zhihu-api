const Answer = require('../models/answers')

class AnswerController {
  // 获取所有回答列表
  async find(ctx) {
    let {size = 10, page = 1} = ctx.query
    // Math.max 是使得page， size不小于 1
    page = Math.max(Number(page), 1) - 1
    size = Math.max(Number(size), 1)
    ctx.body = await Answer.find({questionId: ctx.params.questionId}).limit(size).skip(page * size)
  }

  // 根据id获取特定答案
  async findById(ctx) {
    const answer = await Answer.findById(ctx.params.id).populate('answerer')
    if (!answer) {ctx.throw(404, '回答不存在')}
    ctx.body = answer
  }

  // 创建回答
  async create(ctx) {
    ctx.verifyParams({
      content: {type: 'string', required: true},
    })
    ctx.body = await new Answer({
      ...ctx.request.body,
      answerer: ctx.state.user._id,
      questionId: ctx.params.questionId
    }).save()
  }

  // 修改回答
  async update(ctx) {
    ctx.verifyParams({
      content: {type: 'string', required: false},
    })
    ctx.body = await Answer.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true, // 返回修改后的对象
      useFindAndModify: false
    })
  }

  // 检查回答是否存在
  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) {ctx.throw(404, '回答不存在')}
    if(answer.questionId !== ctx.params.questionId){ctx.throw(404, '该问题下没有此答案')}
    ctx.state.answer = answer
    await next()
  }

  // 检查回答的owner
  async checkAnswerOwner (ctx, next) {
    const {answer} = ctx.state
    if(answer.answerer.toString() !== ctx.state.user._id){
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  //删除回答
  async remove(ctx){
    await Answer.findByIdAndRemove(ctx.params.id, {
      useFindAndModify: false
    })
    ctx.status = 204
  }

}

module.exports = new AnswerController()