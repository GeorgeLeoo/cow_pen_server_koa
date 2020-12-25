import Users from '../../model/users'
import ResponseCode from '../../utils/ResponseCode'
import Utils from '../../utils/Utils'
import MongoCode from '../../utils/MongoCode'
import StatusCode from '../../utils/StatusCode'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Users.countDocuments(condition, function (err, count) {
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
      Users.findOne({ username, password }, (err, users) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (Utils.isEmptyObject(users)) {
          resolve({ code: ResponseCode.CLIENT_ERROR, msg: '账号或密码不正确' })
          return
        }
        if (users.state === 1) {
          resolve({ code: ResponseCode.SUCCESS, msg: '该账号已锁定' })
          return
        }
        const data = {
          uid: users._id,
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
    Users.insertMany(insert, (err, users) => {
      if (err) {
        if (err.code === MongoCode.UNIQUE) {
          resolve({ code: ResponseCode.CLIENT_ERROR, msg: '用户名已存在' })
        } else {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
      }
      resolve({ code: ResponseCode.SUCCESS, msg: '注册成功', data: [] })
    })
  }))
}

/**
 * 查询账号是否存在
 * @param username
 * @returns {Promise<{code, msg. data}>}
 */
export const hasUsername = function (username) {
  return new Promise((resolve => {
    Users.findOne({ username }, (err, users) => {
      if (err) {
        resolve(false)
      }
      if (Utils.isEmptyObject(users)) {
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
export const hasUserEmail = function (email) {
  return new Promise((resolve => {
    Users.findOne({ email }, (err, users) => {
      if (err) {
        resolve(false)
      }
      if (Utils.isEmptyObject(users)) {
        resolve(false)
      }
      resolve(true)
    })
  }))
}

/**
 * 获取考生信息
 * @param uid
 * @returns {Promise<unknown>}
 */
export const getUserInfo = function (uid) {
  return new Promise(resolve => {
    Users.findById(uid, { __v: 0, isDelete: 0, password: 0 },(err, user) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        return
      }
      resolve({ code: ResponseCode.SUCCESS, data: { user } })
    })
  })
}

/**
 * 获取所有考生信息
 * @returns {Promise<unknown>}
 */
export const getUserInfos = function (query) {
  return new Promise(async resolve => {
    const count = await getCount(query.condition)
    Users.find(query.condition, { isDelete: 0, __v: 0, password: 0 })
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, users) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: users,
            total: count
          }
        })
      })
  })
}

/**
 * 通过用户名获取管理员信息
 * @returns {Promise<unknown>}
 */
export const getUserInfoByUsername = function (username) {
  return new Promise(resolve => {
    Users.findOne({ username }, { _id: 1}, (err, admins) => {
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
export const openOrCloseUser = function (query) {
  return new Promise((resolve => {
      Users.updateOne({ _id: query._id }, { $set: { state: query.state } }, (err, users) => {
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
export const updateUser = function (body) {
  return new Promise((resolve => {
      Users.updateOne(body.query, { $set: body.update }, (err, users) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (users.nModified === 1) {
          resolve({ code: ResponseCode.SUCCESS, msg: '更新成功', data: [] })
        } else {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: '更新失败', data: [] })
        }
      })
    }
  ))
}
