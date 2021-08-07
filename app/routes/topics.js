const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/topics'}) // 设置路由前缀
const {
  find,
  findById,
  create,
  update,
} = require('../controllers/topic')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find)
router.get('/:id', findById)
router.post('/', auth,create)
router.put('/:id', auth, update)

module.exports = router