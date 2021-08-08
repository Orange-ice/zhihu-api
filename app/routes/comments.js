const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/questions/:questionId/answers/:answerId/comments'}) // 设置路由前缀
const {
  find,
  findById,
  create,
  update,
  checkCommentExist,
  checkCommentOwner,
  remove
} = require('../controllers/comment')
const {secret} = require('../config')
const auth = jwt({secret})

router.get('/', find)
router.get('/:id', checkCommentExist, findById)
router.post('/', auth, create)
router.patch('/:id', auth, checkCommentExist, checkCommentOwner, update)
router.delete('/:id', auth, checkCommentExist, checkCommentOwner, remove)

module.exports = router