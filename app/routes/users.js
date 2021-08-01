const Router = require('koa-router')
const router = new Router({prefix: '/users'}) // 设置路由前缀
const {find, findById, create, update, remove} = require('../controllers/users')

router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router