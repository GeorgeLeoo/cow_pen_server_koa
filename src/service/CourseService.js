'use strict'

import Course from '../model/course'

// 编写业务逻辑层

/**
 * CourseService
 */
export default class CourseService {
	/**
	 * 查询所有一级课程
	 */
	async findAllCourse(level) {
		return await Course.find({ level, isDelete: 1 }).populate([
			{ path: 'operator', select: { username: 1, _id: 1 } },
		])
	}

	/**
	 * 删除一级课程
	 */
	async deleteCourseById(_id) {
		return await Course.updateMany({ _id }, { isDelete: -1 })
	}

	/**
	 * 修改一级课程
	 */
	async updateCourseById(_id, courseName, levelOneId, levelTwoId) {
		return await Course.updateMany(
			{ _id },
			{ courseName, levelOneId, levelTwoId }
		)
	}

	/**
	 * 通过 课程名 查找一级课程信息
	 * *@return user
	 * @param courseName
	 */
	async findByCourseName(courseName) {
		return await Course.find({ courseName })
	}

	/**
	 * 创建课程
	 * @param courseName
	 * @param operatorId
	 */
	async createCourse(courseName, level, levelOneId, levelTwoId, operatorId) {
		return await Course.create({
			courseName,
			level,
			levelOneId,
			levelTwoId,
			operator: operatorId,
		})
	}
}
