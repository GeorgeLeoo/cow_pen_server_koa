import Answers from "../../model/answers";
import ResponseCode from "../../utils/ResponseCode";

/**
 * 查询考生答案
 * @param query
 * @returns {Promise<unknown>}
 */
export const getAnswers = function (query) {
	return new Promise((resolve) => {
		Answers.find(query.condition, (err, answers) => {
			if (err) {
				resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
			}
			resolve({ code: ResponseCode.SUCCESS, data: answers });
		})
			.limit(parseInt(query.page.limit))
			.skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
			.sort({ _id: -1 });
	});
};

/**
 * 创建考生答案
 * @param body
 * @returns {Promise<unknown>}
 */
export const createAnswer = function (body) {
	return new Promise((resolve) => {
		Answers.insertMany(body, (err, answers) => {
			if (err) {
				resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
			}
			resolve({ code: ResponseCode.SUCCESS, msg: "交卷成功", data: { _id: answers[0]._id } });
		});
	});
};

/**
 * 更新考生答案
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateAnswer = function (body) {
	return new Promise((resolve) => {
		Answers.updateOne(body.query, { $set: body.update }, (err, answers) => {
			if (err) {
				resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
			}
			if (answers.nModified === 1) {
				resolve({
					code: ResponseCode.SUCCESS,
					msg: "更新成功",
					data: [],
				});
			} else {
				resolve({
					code: ResponseCode.SERVICE_ERROR,
					msg: "更新失败",
					data: [],
				});
			}
		});
	});
};

/**
 * 删除考生答案
 * @param query
 * @returns {Promise<unknown>}
 */
export const deleteAnswer = function (query) {
	return new Promise((resolve) => {
		Answers.updateOne(
			{ _id: query._id },
			{ $set: { isDelete: 1 } },
			(err, answers) => {
				if (err) {
					resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
				}
				if (answers.nModified === 1) {
					resolve({
						code: ResponseCode.SUCCESS,
						msg: "删除成功",
						data: [],
					});
				} else {
					resolve({
						code: ResponseCode.SERVICE_ERROR,
						msg: "删除失败",
						data: [],
					});
				}
			}
		);
	});
};
