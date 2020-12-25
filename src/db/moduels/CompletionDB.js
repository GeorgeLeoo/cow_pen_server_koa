import Completions from '../../model/completions'
import ResponseCode from '../../utils/ResponseCode'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Completions.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}
const getCountByAggregate = function (condition) {
  return new Promise(resolve => {
    Completions.aggregate([{ $match: condition }, { $group: { _id: '$knowledgePoint', total: { $sum: 1 } }}])
      .exec((err, count) => {
        resolve(count.length)
      })
  })
}
/**
 * 查询解答题
 * @param query
 * @returns {Promise<unknown>}
 */
export const getCompletions = function (query) {
  return new Promise(async (resolve) => {
    const count = await getCount(query.condition)
    Completions.find(query.condition, { isDelete: 0, __v: 0 })
      .populate([{ path: 'admin', select: { username: 1, _id: 0 } }, {
        path: 'subjectId',
        select: { name: 1, _id: 1 }
      }])
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, completions) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: completions,
            total: count
          }
        })
      })
  })
}

/**
 * 创建解答题
 * @param body
 * @returns {Promise<unknown>}
 */
export const createCompletion = function (body) {
  return new Promise((resolve) => {
    Completions.insertMany(body, (err, completions) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      resolve({ code: ResponseCode.SUCCESS, msg: '添加成功', data: [] })
    })
  })
}

/**
 * 更新解答题
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateCompletion = function (body) {
  return new Promise((resolve) => {
    Completions.updateOne(body.query, { $set: body.update }, (err, completions) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (completions.nModified === 1) {
        resolve({
          code: ResponseCode.SUCCESS,
          msg: '更新成功',
          data: [],
        })
      } else {
        resolve({
          code: ResponseCode.SERVICE_ERROR,
          msg: '更新失败',
          data: [],
        })
      }
    })
  })
}

/**
 * 删除解答题
 * @param query
 * @returns {Promise<unknown>}
 */
export const deleteCompletion = function (query) {
  return new Promise((resolve) => {
    Completions.updateOne(
      { _id: query._id },
      { $set: { isDelete: 1 } },
      (err, completions) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (completions.nModified === 1) {
          resolve({
            code: ResponseCode.SUCCESS,
            msg: '删除成功',
            data: [],
          })
        } else {
          resolve({
            code: ResponseCode.SERVICE_ERROR,
            msg: '删除失败',
            data: [],
          })
        }
      }
    )
  })
}

/**
 * 考点查询
 * @param query
 * @returns {Promise<unknown>}
 */
export const getKnowledgePointFromCompletion = function (query) {
  return new Promise(async (resolve) => {
    const count = await getCountByAggregate(query.condition)
    Completions.aggregate([{ $match: query.condition }, { $group: { _id: '$knowledgePoint', total: { $sum: 1 } }} ])
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, knowledgePoints) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err, data: { list: [], total: 0 } })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: knowledgePoints,
            total: count
          }
        })
      })
  })
}
