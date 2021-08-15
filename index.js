const Koa = require('koa')
const chalk = require('chalk')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')

const registerRoute = require('./app/routes/index')
const app = new Koa()

// 连接mongoDB
mongoose.connect('mongodb://localhost:27017/zhihu', {useUnifiedTopology: true, useNewUrlParser: true}, () => {
  console.log(chalk.magenta('mongoDB is connected successfully!'))
})
// 连接mongoDB的错误处理
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, 'app/public')))

// 根据不同环境输出不同的错误处理信息
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, rest}
  }
))

app.use(koaBody({
  // 支持文件格式
  multipart: true,
  formidable: {
    // 上传目录
    uploadDir: path.join(__dirname, '/app/public/uploads'),
    // 保留文件扩展名
    keepExtensions: true,
  }
}))

app.use(parameter(app))
registerRoute(app)

app.listen(3000, () => {
  console.log(chalk.magenta('app is listening 3000...'))
})