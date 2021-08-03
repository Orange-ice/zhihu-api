const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const router = new Router({prefix: '/users'}) // 设置路由前缀
const {find, findById, create, update, remove, login, checkOwner} = require('../controllers/users')
const {secret} = require('../config')

const auth = async (ctx, next) => {
  const {authorization = ''} = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  try {
    const user = jsonwebtoken.verify(token, secret)
    ctx.state.user = user
  } catch (error) {
    ctx.throw(401, error.message)
  }
  await next()
}

router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.put('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, remove)
router.post('/login', login)

module.exports = router