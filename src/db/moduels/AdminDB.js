/**
 * 查询 query
 * 更新 body = {query, update}
 * 插入 insert
 * 真删除 body = { query, remove }
 */
import Admins from '../../model/admins'
import ResponseCode from '../../utils/ResponseCode'
import Utils from '../../utils/Utils'
import MongoCode from '../../utils/MongoCode'
import StatusCode from './../../utils/StatusCode'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Admins.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}

/**
 * 登录
 * @param query
 * @returns {Promise<{code, msg. data}>}
 */
export const login = function (query) {
  return new Promise((resolve => {
      const { _id, username, password } = query
      Admins.findOne({ username, password }, (err, admins) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (Utils.isEmptyObject(admins)) {
          resolve({ code: ResponseCode.CLIENT_ERROR, msg: '账号或密码不正确' })
        }
        if (admins.state === 1) {
          resolve({ code: ResponseCode.SUCCESS, msg: '该账号已锁定' })
        }
        const data = {
          uid: admins._id,
          token: Utils.getToken(_id)
        }
        resolve({ code: ResponseCode.SUCCESS, data })
      })
    }
  ))
}

/**
 * 注册
 * @param insert
 * @returns {Promise<{code, msg. data}>}
 */
export const register = function (insert) {
  return new Promise((resolve => {
    Admins.insertMany(insert, (err, admins) => {
      if (err) {
        if (err.code === MongoCode.UNIQUE) {
          resolve({ code: ResponseCode.CLIENT_ERROR, msg: '用户名已存在' })
        } else {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
      }
      resolve({ code: ResponseCode.SUCCESS, data: [] })
    })
  }))
}

/**
 * 查询账号是否存在
 * @param username
 * @returns {Promise<{code, msg. data}>}
 */
export const hasAdminUsername = function (username) {
  return new Promise((resolve => {
    Admins.findOne({ username }, (err, admins) => {
      if (err) {
        resolve(false)
      }
      if (Utils.isEmptyObject(admins)) {
        resolve(false)
      }
      resolve(true)
    })
  }))
}

/**
 *
 * 查询是否有邮箱
 * @param email
 * @returns {Promise<{code, msg. data}>}
 */
export const hasAdminEmail = function (email) {
  return new Promise((resolve => {
    Admins.findOne({ email }, (err, admins) => {
      if (err) {
        resolve(false)
      }
      if (Utils.isEmptyObject(admins)) {
        resolve(false)
      }
      resolve(true)
    })
  }))
}

/**
 * 获取管理员信息
 * @param uid
 * @returns {Promise<unknown>}
 */
export const getAdminUserInfo = function (uid) {
  return new Promise(resolve => {
    Admins.findById(uid, { __v: 0, isDelete: 0, password: 0 }, (err, admins) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({ code: ResponseCode.SUCCESS, data: { user: admins } })
      }
    )
  })
}

/**
 * 获取所有管理员信息
 * @param query
 * @returns {Promise<unknown>}
 */
export const getAdminUserInfos = function (query) {
  return new Promise(async resolve => {
    const count = await getCount(query.condition)
    Admins.find(query.condition, { isDelete: 0, __v: 0, password: 0 })
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, admins) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: admins,
            total: count
          }
        })
      })
  })
}
/**
 * 获取所有管理员信息
 * @param query
 * @returns {Promise<unknown>}
 */
export const getAdminAllUser = function (query) {
  return new Promise(async resolve => {
    Admins.find(query.condition, { isDelete: 0, __v: 0, password: 0 })
      .sort({ _id: -1 })
      .exec((err, admins) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: admins
          }
        })
      })
  })
}
/**
 * 通过用户名获取管理员信息
 * @returns {Promise<unknown>}
 */
export const getAdminInfoByUsername = function (username) {
  return new Promise(resolve => {
    Admins.findOne({ username }, { _id: 1}, (err, admins) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      resolve({ code: ResponseCode.SUCCESS, data: admins })
    })
  })
}

/**
 * 启动或关闭账号
 * @param query
 * @returns {Promise<unknown>}
 */
export const openOrCloseAdminUser = function (query) {
  return new Promise((resolve => {
      Admins.updateOne({ _id: query._id }, { $set: { state: query.state } }, (err, admins) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({ code: ResponseCode.SUCCESS, msg: StatusCode[query.state] + '成功', data: [] })
      })
    }
  ))
}

/**
 * 更新用户
 * @param body
 * @returns {Promise<unknown>}
 */
export const updateAdminUser = function (body) {
  return new Promise((resolve => {
      Admins.updateOne(body.query, { $set: body.update }, (err, admins) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (admins.nModified === 1) {
          resolve({ code: ResponseCode.SUCCESS, msg: '更新成功', data: [] })
        } else {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: '更新失败', data: [] })
        }
      })
    }
  ))
}
