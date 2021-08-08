const Question = require('../models/questions')

class QuestionController {
  // 获取所有问题列表
  async find(ctx) {
    let {size = 10, page = 1} = ctx.query
    // Math.max 是使得page， size不小于 1
    page = Math.max(Number(page), 1) - 1
    size = Math.max(Number(size), 1)
    ctx.body = await Question.find({title: new RegExp(ctx.query.title)}).limit(size).skip(page * size)
  }

  // 根据id获取特定问题
  async findById(ctx) {
    const question = await Question.findById(ctx.params.id).select('+questioner').populate('questioner')
    if (!question) {ctx.throw(404, '问题不存在')}
    ctx.body = question
  }

  // 创建问题
  async create(ctx) {
    ctx.verifyParams({
      title: {type: 'string', required: true},
      description: {type: 'string', required: false},
      questioner: {type: 'string', required: false}
    })
    ctx.body = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save()
  }

  // 修改问题
  async update(ctx) {
    ctx.verifyParams({
      title: {type: 'string', required: false},
      description: {type: 'string', required: false},
    })
    ctx.body = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true, // 返回修改后的对象
      useFindAndModify: false
    })
  }

  // 检查问题是否存在
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) {ctx.throw(404, '话题不存在')}
    ctx.state.question = question
    await next()
  }

  // 检查问题的owner
  async checkQuestionOwner (ctx, next) {
    const {question} = ctx.state
    if(question.questioner.toString() !== ctx.state.user._id){
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  //删除问题
  async remove(ctx){
    await Question.findByIdAndRemove(ctx.params.id, {
      useFindAndModify: false
    })
    ctx.status = 204
  }

}

module.exports = new QuestionController()