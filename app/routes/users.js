const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/users'}) // 设置路由前缀
const {find, findById, create, update, remove, login, checkOwner} = require('../controllers/users')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.put('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, remove)
router.post('/login', login)

module.exports = router