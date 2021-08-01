const Router = require('koa-router')
const router = new Router({prefix: '/users'}) // 设置路由前缀
const {gainList} = require('../controllers/users')

router.get('/', gainList)

module.exports = router