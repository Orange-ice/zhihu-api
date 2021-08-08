const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/questions'}) // 设置路由前缀
const {
  find,
  findById,
  create,
  update,
  remove,
  checkQuestionExist,
  checkQuestionOwner
} = require('../controllers/question')
const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find)
router.get('/:id', findById)
router.post('/', auth, create)
router.put('/:id', auth, checkQuestionExist, checkQuestionOwner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestionOwner, remove)

module.exports = router