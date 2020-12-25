import Wrongs from '../../model/wrongs'
import ResponseCode from '../../utils/ResponseCode'
import util from './../../utils/Utils'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Wrongs.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}
/**
 * 查询
 * @param query
 * @returns {Promise<unknown>}
 */
export const getWrongs = function (query) {
  return new Promise(async (resolve) => {
    const count = await getCount(query.condition)
    let select = { isDelete: 0, __v: 0 }
    Wrongs.find(query.condition, select)
      .populate([
        { path: 'user', select: { username: 1, _id: 0 } },
        { path: 'paper' },
      ])
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, wrongs) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: wrongs,
            total: count
          }
        })
      })
  })
}

export const getWrongsOnlyOriginal = function (query) {
  return new Promise(async (resolve) => {
    let select = { isDelete: 0, __v: 0 }
    Wrongs.find(query.condition, select)
      .limit(query.limit)
      .skip(0)
      .sort({ count: -1 })
      .exec((err, wrongs) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        let data = []
        let copy = util.deepClone(wrongs)
        copy.map(item => {
          data.push(item._doc.original)
        })
        resolve({ code: ResponseCode.SUCCESS, data })
      })
  })
}

export const getWrongByQuestion = function (question) {
  return new Promise(async (resolve) => {
    let select = { isDelete: 0, __v: 0 }
    Wrongs.find({ question }, select, (err, wrongs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (wrongs.length > 0) {
        resolve({ code: ResponseCode.SUCCESS })
      } else {
        resolve({ code: ResponseCode.FAIL })
      }
    })
  })
}

export const getWrongSubject = function (query) {
  return new Promise(resolve => {
    Wrongs.aggregate([{ $match: query }, { $group: { _id: '$subject', total: { $sum: 1 } } }], function (err, wrongs) {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: wrongs })
      }
    })
  })
}

export const getWrongKnowledgePoint = function (query) {
  return new Promise(resolve => {
    Wrongs.aggregate([{ $match: query }, {
      $group: {
        _id: '$knowledgePoint',
        total: { $sum: 1 }
      }
    }], function (err, wrongs) {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: wrongs })
      }
    })
  })
}

/**
 * 创建
 * @param body
 * @returns {Promise<unknown>}
 */
export const createWrong = function (body) {
  return new Promise((resolve) => {
    body.map(async item => {
      let { code } = await getWrongByQuestion(item.question)
      if (code === ResponseCode.FAIL) {
        Wrongs.insertMany(item, (err, wrongs) => {
          if (err) {
            resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
          }
          resolve({ code: ResponseCode.SUCCESS, msg: '添加成功', data: [] })
        })
      } else {
        let body = {
          query: { question: item.question },
          update: { $inc: { count: 1 } }
        }
        let { code } = await updateWrong(body)
        if (code === ResponseCode.SUCCESS) {
          resolve({ code: ResponseCode.SUCCESS, msg: '添加成功' })
        } else {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: '添加失败' })
        }
      }
    })
    
  })
}

/**
 * 更新
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateWrong = function (body) {
  return new Promise((resolve) => {
    Wrongs.updateOne(body.query, body.update.$inc ? body.update : { $set: body.update }, (err, wrongs) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (wrongs.nModified === 1) {
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
 * 删除
 * @param query
 * @returns {Promise<unknown>}
 */
export const deleteWrong = function (query) {
  return new Promise((resolve) => {
    Wrongs.updateOne(
      { _id: query._id },
      { $set: { isDelete: 1 } },
      (err, wrongs) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (wrongs.nModified === 1) {
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

export const getKnowledgePointList = function() {
  return new Promise(async (resolve) => {
    Wrongs.aggregate([{ $group: { _id: '$knowledgePoint', total: { $sum: 1 } }} ])
      .sort({ _id: -1 })
      .exec((err, knowledgePoints) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err, data: { list: [], total: 0 } })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: knowledgePoints,
            total: knowledgePoints.length
          }
        })
      })
  })
}
