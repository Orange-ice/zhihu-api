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
  checkUserExist,
  followTopic,
  unfollowTopic,
  listFollowingTopics
} = require('../controllers/users')

const {checkTopicExist} = require('../controllers/topic')
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

router.put('/followingTopics/:id', auth, checkTopicExist,followTopic) // 关注话题
router.delete('/followingTopics/:id', auth, checkTopicExist,unfollowTopic) // 取消话题关注
router.get('/:id/followingTopics', listFollowingTopics) // 获取某个用户关注的话题列表

module.exports = router