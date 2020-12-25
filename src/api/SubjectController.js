import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../db/moduels/SubjectDB'
import { getAdminInfoByUsername } from '../db/moduels/AdminDB'

class SubjectController {
  /**
   * 获取科目信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getSubject (ctx) {
    const response = new Response(ctx)
    const { name, desc, admin, limit, page } = ctx.request.query
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
    // 科目内容存在时，将属性添加到查询条件里
    name && (condition.name = new RegExp(name))
    desc && (condition.desc = new RegExp(desc))
    admin && (condition.admin = new RegExp(admin))
    
    const query = {
      condition,
      page: { limit, page },
    }
    // 作者存在的情况下去查询作者的 id
    if (admin) {
      const admins = await getAdminInfoByUsername(new RegExp(admin))
      if (admins.code === ResponseCode.SUCCESS) {
        // 赋值给查询条件
        query.condition.admin = admins.data._id
      } else {
        response.send(admins.code, admins.msg, {})
        return
      }
    }
    let { code, msg, data } = await getSubjects(query)
    response.send(code, msg, data)
  }
  
  /**
   * 创建科目
   * @param ctx
   * @returns {Promise<void>}
   */
  async createSubject (ctx) {
    const response = new Response(ctx)
    const { name, desc, admin } = ctx.request.body
    if (!name) {
      response.send(ResponseCode.CLIENT_ERROR, '科目名称不能为空')
      return
    }
    if (!desc) {
      response.send(ResponseCode.CLIENT_ERROR, '科目描述不能为空')
      return
    }
    if (!admin) {
      response.send(ResponseCode.CLIENT_ERROR, '您还没有登录')
      return
    }
    let { code, msg, data } = await createSubject({ name, desc, admin })
    response.send(code, msg, data)
  }
  
  /**
   * 更新科目
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateSubject (ctx) {
    const response = new Response(ctx)
    const { _id, name,desc } = ctx.request.body
    if (!name) {
      response.send(ResponseCode.CLIENT_ERROR, '科目名称不能为空')
      return
    }
    if (!desc) {
      response.send(ResponseCode.CLIENT_ERROR, '科目描述不能为空')
      return
    }
    const body = {
      query: { _id },
      update: { name, desc },
    }
    let { code, msg, data } = await updateSubject(body)
    response.send(code, msg, data)
  }
  
  /**
   * 删除科目
   * @param ctx
   * @returns {Promise<void>}
   */
  async deleteSubject (ctx) {
    const { _id } = ctx.request.query
    const response = new Response(ctx)
    let { code, msg, data } = await deleteSubject({ _id })
    response.send(code, msg, data)
  }
}

const noticeController = new SubjectController()

export default noticeController
