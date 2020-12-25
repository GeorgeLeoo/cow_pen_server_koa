import send from './../config/MailConfig'
import moment from 'moment'
import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import {
  getAdminUserInfo,
  getAdminAllUser,
  hasAdminEmail,
  hasAdminUsername,
  login,
  register,
  getAdminUserInfos,
  openOrCloseAdminUser,
  updateAdminUser
} from '../db/moduels/AdminDB'

class AdminController {
  /**
   * 登录
   * @param ctx
   * @returns {Promise<void>}
   */
  async login (ctx) {
    const { body } = ctx.request
    const { username, password } = body
    const response = new Response(ctx)
    if (!username) {
      response.send(ResponseCode.CLIENT_ERROR, '账号不能为空')
      return
    }
    if (!password) {
      response.send(ResponseCode.CLIENT_ERROR, '密码不能为空')
      return
    }
    let { code, msg, data } = await login({ username, password })
    response.send(code, msg, data)
  }
  
  /**
   * 注册
   * @param ctx
   * @returns {Promise<void>}
   */
  async register (ctx) {
    const { body } = ctx.request
    const { username, password, rePassword, email } = body
    const response = new Response(ctx)
    if (!username) {
      response.send(ResponseCode.CLIENT_ERROR, '账号不能为空')
      return
    }
    if (!password) {
      response.send(ResponseCode.CLIENT_ERROR, '密码不能为空')
      return
    }
    if (!rePassword) {
      response.send(ResponseCode.CLIENT_ERROR, '确认密码不能为空')
      return
    }
    if (rePassword !== password) {
      response.send(ResponseCode.CLIENT_ERROR, '两次密码不一致')
      return
    }
    if (!email) {
      response.send(ResponseCode.CLIENT_ERROR, '邮箱不能为空')
      return
    }
    if (await hasAdminUsername(username)) {
      response.send(ResponseCode.CLIENT_ERROR, '用户名已存在')
      return
    }
    if (await hasAdminEmail(email)) {
      response.send(ResponseCode.CLIENT_ERROR, '邮箱已存在')
      return
    }
    let { code, msg, data } = await register({ username, password, email })
    response.send(code, msg, data)
  }
  
  /**
   * 忘记密码
   * @param ctx
   * @returns {Promise<void>}
   */
  async forget (ctx) {
    const { body } = ctx.request
    try {
      // 查询数据库有没有该邮箱
      const sendInfo = {
        code: '1234',
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'George'
      }
      let result = await send(sendInfo)
      const response = new Response(ctx)
      response.send(200, '邮件发送成功', result)
    } catch (e) {
      console.log(e)
    }
  }
  
  /**
   * 查询某一用户信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async info (ctx) {
    const response = new Response(ctx)
    const { uid } = ctx.request.query
    if (!uid) {
      response.send(ResponseCode.CLIENT_ERROR, '您还未登录')
      return
    }
    let { code, msg, data } = await getAdminUserInfo(uid)
    response.send(code, msg, data)
  }
  
  /**
   * 查询所有用户信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getAdminUserInfos (ctx) {
    const response = new Response(ctx)
    const { username, name, gender, limit, page } = ctx.request.query
    if (!limit && limit > 0) {
      response.send(ResponseCode.CLIENT_ERROR, '页面大小必须大于0')
      return
    }
    if (!page) {
      response.send(ResponseCode.CLIENT_ERROR, '当前页面必须大于0')
      return
    }
    
    // 查询条件，默认是没有被删除的
    const condition = { isDelete: 0 }
    // 公告内容存在时，将属性添加到查询条件里
    username && (condition.username = new RegExp(username))
    name && (condition.name = new RegExp(name))
    gender && (condition.gender = gender)
    
    const query = {
      condition,
      page: { limit, page },
    }
    let { code, msg, data } = await getAdminUserInfos(query)
    response.send(code, msg, data)
  }
  
  /**
   * 查询所有用户信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getAdminAllUser (ctx) {
    const response = new Response(ctx)
    
    // 查询条件，默认是没有被删除的
    const condition = { isDelete: 0 }
    
    const query = {
      condition
    }
    let { code, msg, data } = await getAdminAllUser(query)
    response.send(code, msg, data)
  }
  
  /**
   * 创建用户
   * @param ctx
   * @returns {Promise<void>}
   */
  async createAdmin (ctx) {
    const response = new Response(ctx)
    const { username, name, password, rePassword, email, gender, phone } = ctx.request.body
    if (!username) {
      response.send(ResponseCode.CLIENT_ERROR, '账号不能为空')
      return
    }
    if (!name) {
      response.send(ResponseCode.CLIENT_ERROR, '姓名不能为空')
      return
    }
    if (!password) {
      response.send(ResponseCode.CLIENT_ERROR, '密码不能为空')
      return
    }
    if (!rePassword) {
      response.send(ResponseCode.CLIENT_ERROR, '确认密码不能为空')
      return
    }
    if (rePassword !== password) {
      response.send(ResponseCode.CLIENT_ERROR, '两次密码不一致')
      return
    }
    if (!email) {
      response.send(ResponseCode.CLIENT_ERROR, '邮箱不能为空')
      return
    }
    if (!(gender === 0 || gender === 1)) {
      response.send(ResponseCode.CLIENT_ERROR, '请选择性别')
      return
    }
    if (!phone) {
      response.send(ResponseCode.CLIENT_ERROR, '手机号不能为空')
      return
    }
    if (await hasAdminUsername(username)) {
      response.send(ResponseCode.CLIENT_ERROR, '用户名已存在')
      return
    }
    if (await hasAdminEmail(email)) {
      response.send(ResponseCode.CLIENT_ERROR, '邮箱已存在')
      return
    }
    let { code, msg, data } = await register({ username, name, password, rePassword, email, gender, phone })
    response.send(code, msg, data)
  }
  
  /**
   * 修改账号状态【启动、关闭】
   * @param ctx
   * @returns {Promise<void>}
   */
  async openOrCloseAdminUser (ctx) {
    const response = new Response(ctx)
    const { _id, state } = ctx.request.body
    let { code, msg, data } = await openOrCloseAdminUser({ _id, state })
    response.send(code, msg, data)
  }
  
  /**
   * 更新用户信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateAdminUser (ctx) {
    const response = new Response(ctx)
    const { _id, username, name, password, rePassword, oldEmail, email, gender, phone } = ctx.request.body
    if (!username) {
      response.send(ResponseCode.CLIENT_ERROR, '账号不能为空')
      return
    }
    if (!name) {
      response.send(ResponseCode.CLIENT_ERROR, '姓名不能为空')
      return
    }
    if (!email) {
      response.send(ResponseCode.CLIENT_ERROR, '邮箱不能为空')
      return
    }
    if (!(gender === 0 || gender === 1)) {
      response.send(ResponseCode.CLIENT_ERROR, '请选择性别')
      return
    }
    if (!phone) {
      response.send(ResponseCode.CLIENT_ERROR, '手机号不能为空')
      return
    }
    
    if(oldEmail !== email) {
      if (await hasAdminEmail(email)) {
        response.send(ResponseCode.CLIENT_ERROR, '邮箱已存在')
        return
      }
    }
    const body = {
      query: { _id },
      update: { username, name, email, gender, phone }
    }
    if (password || rePassword) {
      if (!password) {
        response.send(ResponseCode.CLIENT_ERROR, '密码不能为空')
        return
      }
      if (!rePassword) {
        response.send(ResponseCode.CLIENT_ERROR, '确认密码不能为空')
        return
      }
      if (rePassword !== password) {
        response.send(ResponseCode.CLIENT_ERROR, '两次密码不一致')
        return
      }
      body.update.password = password
    }
    let { code, msg, data } = await updateAdminUser(body)
    response.send(code, msg, data)
  }
}

const adminController = new AdminController()

export default adminController
