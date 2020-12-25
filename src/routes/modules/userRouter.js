import Router from 'koa-router'
import userController from '../../api/UserController'

const router = new Router()

router.prefix('/user')

// 登录
router.post('/login', userController.login)

// 注册
router.post('/register', userController.register)

// 忘记密码
router.post('/forget', userController.forget)

// 获取某用户信息
router.get('/info', userController.info)

// 获取全部用户信息
router.get('/infos', userController.getUserInfos)

// 创建用户
router.post('/info', userController.createUser)

// 用户状态【开启、关闭】
router.put('/status', userController.openOrCloseUser)

// 更新用户
router.patch('/info', userController.updateUser)

export default router
