const Comment = require('../models/comments')

class CommentController {
  // 获取某个回答下的所有评论列表
  async find(ctx) {
    let {size = 10, page = 1} = ctx.query
    // Math.max 是使得page， size不小于 1
    page = Math.max(Number(page), 1) - 1
    size = Math.max(Number(size), 1)
    ctx.body = await Comment.find({
      questionId: ctx.params.questionId,
      answerId: ctx.params.answerId
    }).limit(size).skip(page * size).populate('commentator')
  }

  // 检查评论是否存在
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) {ctx.throw(404, '评论不存在')}
    // 删改查时才检查此逻辑， 赞、踩答案时不需检查
    if(ctx.params.questionId && comment.questionId !== ctx.params.questionId){
      ctx.throw(404, '该问题下没有此评论')
    }
    if(ctx.params.answerId && comment.answerId !== ctx.params.answerId){
      ctx.throw(404, '该回答下没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }

  // 查找特定评论
  async findById(ctx) {
    const comment = await Comment.findById(ctx.params.id).populate('commentator')
    if (!comment) {ctx.throw(404, '评论不存在')}
    ctx.body = comment
  }

  // 创建评论
  async create(ctx) {
    ctx.verifyParams({
      content: {type: 'string', required: true},
    })
    ctx.body = await new Comment({
      ...ctx.request.body,
      commentator: ctx.state.user._id,
      questionId: ctx.params.questionId,
      answerId: ctx.params.answerId
    }).save()
  }

  // 修改回答
  async update(ctx) {
    ctx.verifyParams({
      content: {type: 'string', required: false},
    })
    ctx.body = await Comment.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true, // 返回修改后的对象
      useFindAndModify: false
    })
  }

  // 检查回答的owner
  async checkCommentOwner (ctx, next) {
    const {comment} = ctx.state
    if(comment.commentator.toString() !== ctx.state.user._id){
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  //删除回答
  async remove(ctx){
    await Comment.findByIdAndRemove(ctx.params.id, {
      useFindAndModify: false
    })
    ctx.status = 204
  }

}

module.exports = new CommentController()