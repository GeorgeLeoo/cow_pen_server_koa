import Router from 'koa-router'
import uploadController from '../../controller/UploadController'

const router = new Router()

// 查询文件地址
// router.get('/upload', uploadController.getNotice)

// 创建文件地址
router.post('/upload-img', uploadController.save)

export default router
