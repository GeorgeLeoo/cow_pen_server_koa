import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../db/moduels/NoticeDB'
import { getAdminInfoByUsername } from '../db/moduels/AdminDB'

class NoticeController {
  /**
   * 获取公告信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getNotice (ctx) {
    const response = new Response(ctx)
    const { content, username, limit, page } = ctx.request.query
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
    content && (condition.content = new RegExp(content))
    
    const query = {
      condition,
      page: { limit, page },
    }
    // 作者存在的情况下去查询作者的 id
    if (username) {
      const admins = await getAdminInfoByUsername(new RegExp(username))
      if (admins.code === ResponseCode.SUCCESS) {
        // 赋值给查询条件
        query.condition.admin = admins.data._id
      } else {
        response.send(admins.code, admins.msg, {})
        return
      }
    }
    let { code, msg, data } = await getNotices(query)
    response.send(code, msg, data)
  }
  
  /**
   * 创建公告
   * @param ctx
   * @returns {Promise<void>}
   */
  async createNotice (ctx) {
    const response = new Response(ctx)
    const { content, admin } = ctx.request.body
    if (!content) {
      response.send(ResponseCode.CLIENT_ERROR, '公告内容不能为空')
      return
    }
    if (!admin) {
      response.send(ResponseCode.CLIENT_ERROR, '您还没有登录')
      return
    }
    let { code, msg, data } = await createNotice({ content, admin })
    response.send(code, msg, data)
  }
  
  /**
   * 更新公告
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateNotice (ctx) {
    const response = new Response(ctx)
    const { _id, content } = ctx.request.body
    if (!content) {
      response.send(ResponseCode.CLIENT_ERROR, '公告内容不能为空')
      return
    }
    const body = {
      query: { _id },
      update: { content },
    }
    let { code, msg, data } = await updateNotice(body)
    response.send(code, msg, data)
  }
  
  /**
   * 删除公告
   * @param ctx
   * @returns {Promise<void>}
   */
  async deleteNotice (ctx) {
    const { _id } = ctx.request.query
    const response = new Response(ctx)
    let { code, msg, data } = await deleteNotice({ _id })
    response.send(code, msg, data)
  }
}

const noticeController = new NoticeController()

export default noticeController
