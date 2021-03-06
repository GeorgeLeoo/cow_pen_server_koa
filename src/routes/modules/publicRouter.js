import Router from 'koa-router'

import publicController from '../../controller/PublicController'

const router = new Router()

router.prefix('public')

router.get('/test', publicController.test)
router.get('/getCaptcha', publicController.getCaptcha)

export default router
