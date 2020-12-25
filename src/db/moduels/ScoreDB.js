import Scores from "../../model/scores";
import ResponseCode from "../../utils/ResponseCode";

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Scores.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}
/**
 * 查询分数
 * @param query
 * @returns {Promise<unknown>}
 */
export const getScores = function (query) {
	return new Promise(async (resolve) => {
    const count = await getCount(query.condition)
    let select = { isDelete: 0, __v: 0 }
    Scores.find(query.condition, select)
      .populate([
        { path: 'user', select: { username: 1, _id: 0 } },
        { path: 'answer', select: { isDelete: 0 } },
        { path: 'paper' },
      ])
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, papers) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: papers,
            total: count
          }
        })
      })
  })
};

/**
 * 创建分数
 * @param body
 * @returns {Promise<unknown>}
 */
export const createScore = function (body) {
	return new Promise((resolve) => {
		Scores.insertMany(body, (err, scores) => {
			if (err) {
				resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
			}
			resolve({ code: ResponseCode.SUCCESS, msg: "添加成功", data: [] });
		});
	});
};

/**
 * 更新分数
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateScore = function (body) {
	return new Promise((resolve) => {
    console.log(body)
		Scores.updateOne(body.query, { $set: body.update }, (err, scores) => {
			if (err) {
				resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
			}
			if (scores.nModified === 1) {
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
 * 删除分数
 * @param query
 * @returns {Promise<unknown>}
 */
export const deleteScore = function (query) {
	return new Promise((resolve) => {
		Scores.updateOne(
			{ _id: query._id },
			{ $set: { isDelete: 1 } },
			(err, scores) => {
				if (err) {
					resolve({ code: ResponseCode.SERVICE_ERROR, msg: err });
				}
				if (scores.nModified === 1) {
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
