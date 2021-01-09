import Router from 'koa-router'
import controller from '../../controller/index'

const router = new Router()

router.prefix('/user')

// 登录
router.post('/login', controller.UserController.login)

// 注册
router.post('/register', controller.UserController.register)

// 获取某用户信息
router.get('/', controller.UserController.findUserInfoByUID)

// 退出登录
router.patch('/logout', controller.UserController.logout)


export default router
