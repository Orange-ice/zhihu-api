const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa()

const registerRoute = require('./app/routes/index')

app.use(bodyparser())
registerRoute(app)

app.listen(3000, () => {
  console.log('app is listening 3000...')
})