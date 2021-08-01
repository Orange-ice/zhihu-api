const Koa = require('koa')
const chalk = require('chalk')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const app = new Koa()

const registerRoute = require('./app/routes/index')

// 根据不同环境输出不同的错误处理信息
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, rest}
  }
))
app.use(bodyparser())
app.use(parameter(app))
registerRoute(app)

app.listen(3000, () => {
  console.log(chalk.cyan('app is listening 3000...'))
})