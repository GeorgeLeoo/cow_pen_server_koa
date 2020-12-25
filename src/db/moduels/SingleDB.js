import Singles from '../../model/singles'
import ResponseCode from '../../utils/ResponseCode'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Singles.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}
/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCountByAggregate = function (condition) {
  return new Promise(resolve => {
    Singles.aggregate([{ $match: condition }, { $group: { _id: '$knowledgePoint', total: { $sum: 1 } }}])
      .exec((err, count) => {
        resolve(count.length)
      })
  })
}

/**
 * 查询单选题
 * @param query
 * @returns {Promise<unknown>}
 */
export const getSingles = function (query) {
  return new Promise(async (resolve) => {
    const count = await getCount(query.condition)
    Singles.find(query.condition, { isDelete: 0, __v: 0 })
      .populate([{ path: 'admin', select: { username: 1, _id: 0 } }, { path: 'subjectId', select: { name: 1, _id: 1 } }])
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, singles) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: singles,
            total: count
          }
        })
      })
  })
}

/**
 * 创建单选题
 * @param body
 * @returns {Promise<unknown>}
 */
export const createSingle = function (body) {
  return new Promise((resolve) => {
    Singles.insertMany(body, (err, singles) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      resolve({ code: ResponseCode.SUCCESS, msg: '添加成功', data: [] })
    })
  })
}

/**
 * 更新单选题
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateSingle = function (body) {
  return new Promise((resolve) => {
    Singles.updateOne(body.query, { $set: body.update }, (err, singles) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (singles.nModified === 1) {
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
 * 删除单选题
 * @param query
 * @returns {Promise<unknown>}
 */
export const deleteSingle = function (query) {
  return new Promise((resolve) => {
    Singles.updateOne(
      { _id: query._id },
      { $set: { isDelete: 1 } },
      (err, singles) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (singles.nModified === 1) {
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
export const getKnowledgePointFromSingle = function(query) {
  return new Promise(async (resolve) => {
    const count = await getCountByAggregate(query.condition)
    Singles.aggregate([{ $match: query.condition }, { $group: { _id: '$knowledgePoint', total: { $sum: 1 } }} ])
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
