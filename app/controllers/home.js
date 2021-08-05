const path = require('path')

class HomeController {
  index(ctx) {
    ctx.body = '这是用户列表'
  }

  upload(ctx) {
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    ctx.body = {url: `${ctx.origin}/uploads/${basename}`}
  }
}

module.exports = new HomeController()