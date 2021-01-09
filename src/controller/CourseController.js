import Response from '../lib/Response'
import validatorForm from '../utils/validatorForm'
import service from '../service/index'
import Utils from '../utils/Utils'

const CourseController = {
	/**
	 * @summary 添加一级科目
	 */
	async createCourse(ctx) {
		const response = new Response(ctx)

		let { courseName, level, levelOneId, levelTwoId } = ctx.request.body

		let rules = [{ value: courseName, errorMsg: '课程名不能为空', rule: 'empty' }]

		level = Number(level)

		if (level === 2) {
			rules = rules.concat([{ value: levelOneId, errorMsg: '一级课程id不能为空', rule: 'empty' }])
		} else if (level === 3) {
			rules = rules.concat([
				{ value: levelOneId, errorMsg: '一级课程id不能为空', rule: 'empty' },
				{ value: levelTwoId, errorMsg: '二级课程id不能为空', rule: 'empty' },
			])
		} else {
			rules = [{ value: level, errorMsg: 'level不能为空', rule: 'empty' }]
		}

		const validator = validatorForm(rules)

		if (!validator) {
			response.failClient(validatorForm.getError())
			return
		}

		const uid = await Utils.getRedisUid(ctx)

		if (!uid) {
			response.failClient('请先登录')
		}

		const findCourse = await service.courseService.findByCourseName(courseName)

		if (Utils.isEmptyArray(findCourse)) {
			await service.courseService.createCourse(
				courseName,
				level,
				levelOneId,
				levelTwoId,
				uid
			)
			response.success([], '')
			return
		}

		response.failClient('课程名已存在')
	},

	/**
	 * @summary 查询所有课程
	 */
	async findAllCourse(ctx, next, body) {
		const response = new Response(ctx)

		let { level } = ctx.request.query

		if (!level) {
			level = body.level
		}

		level = Number(level)

		const rules = [{ value: level, errorMsg: 'level不能为空', rule: 'empty' }]

		const validator = validatorForm(rules)

		if (!validator) {
			response.failClient(validatorForm.getError())
			return
		}

		const findCourse = await service.courseService.findAllCourse(level)

		response.success(findCourse, '')

		return response.getResponse()
	},

	/**
	 * @summary app 查询所有课程
	 */
	async findAllCourseList(ctx, next) {
		const response = new Response(ctx)

		const courseOne = await CourseController.findAllCourse(ctx, next, {
			level: 1,
		})
		const courseTwo = await CourseController.findAllCourse(ctx, next, {
			level: 2,
		})
		const courseThree = await CourseController.findAllCourse(ctx, next, {
			level: 3,
    })
    
    const twoFinal = []
    courseTwo.forEach(v => {
      const item = {
				courseName: v.courseName,
				_id: v._id,
				level: v.level,
				levelOneId: v.levelOneId,
				children: [],
			}
			twoFinal.push(item)
    })

    twoFinal.forEach((item) => {
			courseThree.forEach((v) => {
				if (item._id.toString() === v.levelTwoId.toString()) {
					const levelTwo = {
						courseName: v.courseName,
						_id: v._id,
						level: v.level,
						levelOneId: v.levelOneId,
						levelTwoId: v.levelTwoId,
						children: [],
          }
          item.children.push(levelTwo)
				}
			})
    })
    

		const res = []

		courseOne.forEach((v) => {
			const levelOne = {
				courseName: v.courseName,
				_id: v._id,
				level: v.level,
				children: [],
			}
			res.push(levelOne)
		})

		res.forEach((resItem) => {
			twoFinal.forEach((two) => {
				if (resItem._id.toString() === two.levelOneId) {
          resItem.children.push(two)
				}
			})
		})

		response.success(res, '')
	},

	/**
	 * @summary 删除一级课程
	 * @router delete /course/one
	 * @request query string id 课程id
	 * @response 200 courseEmptyResponse
	 */
	async deleteCourseById(ctx) {
		const response = new Response(ctx)

		const { id } = ctx.request.query

		const rules = [{ value: id, errorMsg: 'id不能为空', rule: 'empty' }]

		const validator = validatorForm(rules)

		if (!validator) {
			response.failClient(validatorForm.getError())
			return
		}

		const findCourse = await service.courseService.deleteCourseById(id)

		if (findCourse.n === 1 && findCourse.nModified === 1) {
			response.success('', '')
		} else {
			response.fail('删除失败')
		}
	},

	/**
	 * @summary 修改课程
	 */
	async updateCourseById(ctx) {
		const response = new Response(ctx)

		let { id, courseName, level, levelOneId, levelTwoId } = ctx.request.body

		let rules = []

		level = Number(level)

		if (level === 1) {
			rules = [
				{ value: id, errorMsg: '课程ID不能为空', rule: 'empty' },
				{ value: courseName, errorMsg: '课程名不能为空', rule: 'empty' },
			]
		} else if (level === 2) {
			rules = [
				{ value: id, errorMsg: '课程ID不能为空', rule: 'empty' },
				{ value: courseName, errorMsg: '课程名不能为空', rule: 'empty' },
				{ value: levelOneId, errorMsg: '一级课程id不能为空', rule: 'empty' },
			]
		} else if (level === 3) {
			rules = [
				{ value: id, errorMsg: '课程ID不能为空', rule: 'empty' },
				{ value: courseName, errorMsg: '课程名不能为空', rule: 'empty' },
				{ value: levelOneId, errorMsg: '一级课程id不能为空', rule: 'empty' },
				{ value: levelTwoId, errorMsg: '二级课程id不能为空', rule: 'empty' },
			]
		} else {
			rules = [{ value: level, errorMsg: 'level不能为空', rule: 'empty' }]
		}

		const validator = validatorForm(rules)

		if (!validator) {
			response.failClient(validatorForm.getError())
			return
		}

		const findCourse = await service.courseService.updateCourseById(
			id,
			courseName,
			levelOneId,
			levelTwoId
		)

		if (findCourse.n === 1 && findCourse.nModified === 1) {
			response.success('', '')
		} else {
			response.fail('更新失败')
		}
	},
}

export default CourseController
