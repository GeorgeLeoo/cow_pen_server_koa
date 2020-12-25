import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import {
  getWrongSubject,
  getWrongKnowledgePoint, getWrongs, createWrong
} from '../db/moduels/WrongDB'
import { getKnowledgePointList } from '../db/moduels/WrongDB'

class WrongController {
  /**
   * 获取错题
   * @param ctx
   * @returns {Promise<void>}
   */
  async getWrongs (ctx) {
    const response = new Response(ctx)
    const { type } = ctx.request.query
    
    // 查询条件，默认是没有被删除的
    const query = { isDelete: 0 }
    if (type === 'SUBJECT') {
      let { code, msg, data } = await getWrongSubject(query)
      response.send(code, msg, data)
    } else if (type === 'KNOWLEDGE_POINT') {
      let { code, msg, data } = await getWrongKnowledgePoint(query)
      response.send(code, msg, data)
    } else {
      response.send(ResponseCode.CLIENT_ERROR, '客户端参数错误')
    }
  }
  
  async getWrongsByType (ctx) {
    const response = new Response(ctx)
    const { type, searchKey, limit, page } = ctx.request.query
    if (!searchKey) {
      response.send(ResponseCode.CLIENT_ERROR, 'searchKey必须存在')
      return
    }
    if (!limit && limit > 0) {
      response.send(ResponseCode.CLIENT_ERROR, '页面大小必须大于0')
      return
    }
    if (!page) {
      response.send(ResponseCode.CLIENT_ERROR, '当前页面必须大于0')
      return
    }
    
    // 查询条件，默认是没有被删除的
    const query = { isDelete: 0 }
    query.page = { page, limit }
    if (type === 'SUBJECT') {
      query.condition = { subject: searchKey }
      let { code, msg, data } = await getWrongs(query)
      response.send(code, msg, data)
    } else if (type === 'KNOWLEDGE_POINT') {
      query.condition = { knowledgePoint: searchKey }
      let { code, msg, data } = await getWrongs(query)
      response.send(code, msg, data)
    } else {
      response.send(ResponseCode.CLIENT_ERROR, '客户端参数错误')
    }
  }
  async createWrong (ctx) {
    const response = new Response(ctx)
    const body = ctx.request.body
    let { code, msg, data } = await createWrong(body)
    response.send(code, msg, data)
  }
  
  async getKnowledgePointList (ctx) {
    const response = new Response(ctx)
    let { code, msg, data } = await getKnowledgePointList()
    response.send(code, msg, data)
  }
}

const wrongController = new WrongController()

export default wrongController
