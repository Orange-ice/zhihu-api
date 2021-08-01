const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const app = new Koa()

const registerRoute = require('./app/routes/index')

// 根据不同环境输出不同的错误处理信息
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, rest}
  }
))
app.use(bodyparser())
registerRoute(app)

app.listen(3000, () => {
  console.log('app is listening 3000...')
})