import Router from 'koa-router'
import controller from '../../controller/index'

const router = new Router()

router.prefix('/course')

router.get('/', controller.CourseController.findAllCourse)

router.get('/list', controller.CourseController.findAllCourseList)

router.post('/', controller.CourseController.createCourse)

router.patch('/', controller.CourseController.updateCourseById)

router.delete('/', controller.CourseController.deleteCourseById)

export default router