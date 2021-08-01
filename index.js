const Koa = require('koa')
const chalk = require('chalk')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')

const registerRoute = require('./app/routes/index')
const {connectionStr} = require('./app/config')
const app = new Koa()

// 连接mongoDB
mongoose.connect(connectionStr, {useUnifiedTopology: true,  useNewUrlParser: true}, () => {
  console.log(chalk.magenta('mongoDB is connected successfully!'))
})
// 连接mongoDB的错误处理
mongoose.connection.on('error', console.error)

// 根据不同环境输出不同的错误处理信息
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, rest}
  }
))
app.use(bodyparser())
app.use(parameter(app))
registerRoute(app)

app.listen(3000, () => {
  console.log(chalk.magenta('app is listening 3000...'))
})