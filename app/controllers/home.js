class HomeController {
  index(ctx){
    ctx.body = '这是用户列表'
  }
}

module.exports = new HomeController()