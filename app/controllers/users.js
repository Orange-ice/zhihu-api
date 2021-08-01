class UsersController {
  gainList(ctx) {
    ctx.body = '这是用户列表'
  }
  create(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true}
    })
    ctx.body = {message: 'success'}
  }
}

module.exports = new UsersController()