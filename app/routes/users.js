const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/users'}) // 设置路由前缀
const {
  find,
  findById,
  create,
  update,
  remove,
  login,
  checkOwner,
  listFollowing,
  follow,
  unfollow,
  listFollowers,
  checkUserExist
} = require('../controllers/users')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.put('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, remove)
router.post('/login', login) // 登录
router.get('/:id/following', listFollowing) // 获取关注列表
router.put('/following/:id', auth, checkUserExist,follow) // 关注别人
router.delete('/following/:id', auth, checkUserExist,unfollow) // 取消关注
router.get('/:id/followers', listFollowers) // 获取粉丝列表

module.exports = router