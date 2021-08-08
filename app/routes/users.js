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
  listFollowingTopics,
  listQuestions,
  listLikingAnswers, likeAnswer, unlikeAnswer,
  dislikeAnswer, unDislikeAnswer, listDisLikingAnswers
} = require('../controllers/users')

const {checkTopicExist} = require('../controllers/topic')
const {checkAnswerExist} = require('../controllers/answer')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.put('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, remove)
router.post('/login', login) // 登录
router.get('/:id/following', listFollowing) // 获取关注列表
router.put('/following/:id', auth, checkUserExist, follow) // 关注别人
router.delete('/following/:id', auth, checkUserExist, unfollow) // 取消关注
router.get('/:id/followers', listFollowers) // 获取粉丝列表

router.put('/followingTopics/:id', auth, checkTopicExist, followTopic) // 关注话题
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic) // 取消话题关注
router.get('/:id/followingTopics', listFollowingTopics) // 获取某个用户关注的话题列表
router.get('/:id/questions', checkUserExist, listQuestions) // 获取用户的发表的问题列表

router.patch('/likingAnswer/:id', auth, checkAnswerExist, likeAnswer, unDislikeAnswer) // 赞某个回答(同时取消踩)
router.delete('/likingAnswer/:id', auth, checkAnswerExist, unlikeAnswer) // 取消赞某个回答
router.get('/:id/likingAnswers', listLikingAnswers) // 获取某个用户赞过的回答
router.patch('/dislikingAnswer/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer) // 踩某个回答（同时取消赞）
router.delete('/dislikingAnswer/:id', auth, checkAnswerExist, unDislikeAnswer) // 取消踩某个回答
router.get('/:id/dislikingAnswers', listDisLikingAnswers) // 获取某个用户踩过的回答


module.exports = router