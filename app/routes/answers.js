const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/questions/:questionId/answers'}) // 设置路由前缀
const {
  find,
  findById,
  create,
  update,
  checkAnswerOwner,
  checkAnswerExist,
  remove
} = require('../controllers/answer')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find)
router.get('/:id', checkAnswerExist, findById)
router.post('/', auth, create)
router.put('/:id', auth, checkAnswerExist, checkAnswerOwner, update)
router.delete('/:id', auth, checkAnswerExist, checkAnswerOwner, remove)

module.exports = router