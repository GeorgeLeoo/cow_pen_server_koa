import Notices from '../../model/notices'
import ResponseCode from '../../utils/ResponseCode'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Notices.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}

/**
 * 查询公告
 * @param query
 * @returns {Promise<unknown>}
 */
export const getNotices = function (query) {
  return new Promise(async (resolve) => {
    const count = await getCount(query.condition)
    Notices.find(query.condition, { isDelete: 0, __v: 0 })
      .populate({ path: 'admin', select: { username: 1, _id: 0 } })
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, notices) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: notices,
            total: count
          }
        })
      })
    
  })
}

/**
 * 创建公告
 * @param body
 * @returns {Promise<unknown>}
 */
export const createNotice = function (body) {
  return new Promise((resolve) => {
    Notices.insertMany(body, (err, notices) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      resolve({ code: ResponseCode.SUCCESS, msg: '添加成功', data: [] })
    })
  })
}

/**
 * 更新公告
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateNotice = function (body) {
  return new Promise((resolve) => {
    Notices.updateOne(body.query, { $set: body.update }, (err, notices) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (notices.nModified === 1) {
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
 * 删除公告
 * @param query
 * @returns {Promise<unknown>}
 */
export const deleteNotice = function (query) {
  return new Promise((resolve) => {
    Notices.updateOne(
      { _id: query._id },
      { $set: { isDelete: 1 } },
      (err, notices) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (notices.nModified === 1) {
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
