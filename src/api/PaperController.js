import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import {
  getPapers,
  getPaperById,
  createPaper,
  updatePaper,
  deletePaper,
  hasPaperPassword,
  verifyPaperPassword,
  getWrongKnowledgePoint, getHotPapers
} from '../db/moduels/PaperDB'
import { getKnowledgePointFromSingle } from './../db/moduels/SingleDB'
import { getKnowledgePointFromMultiple } from './../db/moduels/MultipleDB'
import { getKnowledgePointFromJudge } from './../db/moduels/JudgeDB'
import { getKnowledgePointFromCompletion } from './../db/moduels/CompletionDB'
import { getKnowledgePointFromAFQ } from './../db/moduels/AFQDB'

class PaperController {
  /**
   * 获取试卷信息
   * ./..param ctx
   * ./..returns {Promise<void>}
   */
  async getPaper (ctx) {
    const response = new Response(ctx)
    const { paperName, subject, paperType, type, testType, limit, page } = ctx.request.query
    if (!limit && limit > 0) {
      response.send(ResponseCode.CLIENT_ERROR, '页面大小必须大于0')
      return
    }
    if (!page) {
      response.send(ResponseCode.CLIENT_ERROR, '当前页面必须大于0')
      return
    }
    const condition = { isDelete: 0 }
    type === 'SIMPLE' && (condition.testType = 0)
    paperName && (condition.paperName = new RegExp(paperName))
    subject && (condition.subject = subject)
    paperType && (condition.paperType = paperType)
    testType && (condition.testType = testType)
    let { code, msg, data } = await getPapers({
      condition,
      page: { limit, page },
      type
    })
    response.send(code, msg, data)
  }
  
  async getHotPapers (ctx) {
    const response = new Response(ctx)
    const condition = { isDelete: 0 }
    condition.testType = 0
    let { code, msg, data } = await getHotPapers({
      condition
    })
    response.send(code, msg, data)
  }
  
  /**
   * 通过id获取试卷信息
   * ./..param ctx
   * ./..returns {Promise<void>}
   */
  async getPaperById (ctx) {
    const response = new Response(ctx)
    const { _id, paperType, user } = ctx.request.query
    let { code, msg, data } = await getPaperById(_id, paperType, user)
    response.send(code, msg, data)
  }
  
  async getWrongKnowledgePoint (ctx) {
    const response = new Response(ctx)
    const { _id } = ctx.request.query
    let { code, msg, data } = await getWrongKnowledgePoint(_id)
    response.send(code, msg, data)
  }
  
  /**
   * 创建试卷
   * ./..param ctx
   * ./..returns {Promise<void>}
   */
  async createPaper (ctx) {
    const response = new Response(ctx)
    const {
      admin,
      testType,
      password,
      paperName,
      subject,
      startTime,
      endTime,
      durationTime,
      difficulty,
      attention,
      paperType,
      count,
      singleNumber,
      singleScore,
      multipleNumber,
      multipleScore,
      judgeNumber,
      judgeScore,
      completionNumber,
      completionScore,
      afqNumber,
      afqScore,
      single,
      multiple,
      judge,
      completion,
      afq
    } = ctx.request.body
    // if (!content) {
    // 	response.send(ResponseCode.CLIENT_ERROR, "试卷内容不能为空");
    // 	return;
    // }
    if (password) {
      let { code, msg, data } = await hasPaperPassword(password)
      if (msg) {
        response.send(code, msg, data)
        return
      }
    }
    let total = 0
    // 固定组卷
    if (paperType === 0) {
      total = single.length * singleScore
        + multiple.length * multipleScore
        + judge.length * judgeScore
        + completion.length * completionScore
        + afq.length * afqScore
    } else if (paperType === 0) {
      // 随机组卷
      total = singleNumber * singleScore
        + multipleNumber * multipleScore
        + judgeNumber * judgeScore
        + completionNumber * completionScore
        + afqNumber * afqScore
    }
    let { code, msg, data } = await createPaper({
      admin,
      testType,
      paperName,
      password,
      subject,
      startTime,
      endTime,
      durationTime,
      difficulty,
      attention,
      paperType,
      count,
      total,
      singleNumber,
      singleScore,
      multipleNumber,
      multipleScore,
      judgeNumber,
      judgeScore,
      completionNumber,
      completionScore,
      afqNumber,
      afqScore,
      single,
      multiple,
      judge,
      completion,
      afq
    })
    response.send(code, msg, data)
  }
  
  /**
   * 更新试卷
   * ./..param ctx
   * ./..returns {Promise<void>}
   */
  async updatePaper (ctx) {
    const response = new Response(ctx)
    const {
      _id,
      adminId,
      testType,
      paperName,
      password,
      subject,
      startTime,
      endTime,
      durationTime,
      difficulty,
      attention,
      paperType,
      count,
      total,
      singleNumber,
      singleScore,
      multipleNumber,
      multipleScore,
      judgeNumber,
      judgeScore,
      completionNumber,
      completionScore,
      afqNumber,
      afqScore,
      single,
      multiple,
      judge,
      completion,
      afq
    } = ctx.request.body
    const body = {
      query: { _id },
      update: {
        adminId,
        testType,
        password,
        paperName,
        subject,
        startTime,
        endTime,
        durationTime,
        difficulty,
        attention,
        paperType,
        count,
        total,
        singleNumber,
        singleScore,
        multipleNumber,
        multipleScore,
        judgeNumber,
        judgeScore,
        completionNumber,
        completionScore,
        afqNumber,
        afqScore,
        single,
        multiple,
        judge,
        completion,
        afq
      },
    }
    let { code, msg, data } = await updatePaper(body)
    response.send(code, msg, data)
  }
  
  /**
   * 删除试卷
   * ./..param ctx
   * ./..returns {Promise<void>}
   */
  async deletePaper (ctx) {
    const { _id } = ctx.request.query
    const response = new Response(ctx)
    let { code, msg, data } = await deletePaper({ _id })
    response.send(code, msg, data)
  }
  
  /**
   * 验证试卷密码
   * @param ctx
   * @returns {Promise<void>}
   */
  async verifyPaperPassword (ctx) {
    const { password } = ctx.request.body
    const response = new Response(ctx)
    let { code, msg, data } = await verifyPaperPassword({ password, testType: 1 })
    response.send(code, msg, data)
  }
  
  /**
   * 考点查询
   * ./..param ctx
   * ./..returns {Promise<void>}
   */
  async getKnowledgePoint (ctx) {
    const response = new Response(ctx)
    const { knowledgePoint, limit, page } = ctx.request.query
    if (!limit && limit > 0) {
      response.send(ResponseCode.CLIENT_ERROR, '页面大小必须大于0')
      return
    }
    if (!page) {
      response.send(ResponseCode.CLIENT_ERROR, '当前页面必须大于0')
      return
    }
    const condition = { isDelete: 0 }
    knowledgePoint && (condition.knowledgePoint = new RegExp(knowledgePoint))
    let resultSingle = await getKnowledgePointFromSingle({
      condition,
      page: { limit, page }
    })
    let resultMultiple = await getKnowledgePointFromMultiple({
      condition,
      page: { limit, page },
    })
    let resultJudge = await getKnowledgePointFromJudge({
      condition,
      page: { limit, page },
    })
    let resultCompletion = await getKnowledgePointFromCompletion({
      condition,
      page: { limit, page },
    })
    let resultAFQ = await getKnowledgePointFromAFQ({
      condition,
      page: { limit, page },
    })
    
    let msg = {}
    resultSingle.msg && (msg.single = resultSingle.msg)
    resultMultiple.msg && (msg.multiple = resultMultiple.msg)
    resultJudge.msg && (msg.judge = resultJudge.msg)
    resultCompletion.msg && (msg.completion = resultCompletion.msg)
    resultAFQ.msg && (msg.afq = resultAFQ.msg)
    
    if (Object.keys(msg).length > 0) {
      response.send(ResponseCode.SERVICE_ERROR, msg)
      return
    } else {
      msg = ''
    }
    let data = {
      list: [].concat(resultSingle.data.list, resultMultiple.data.list, resultJudge.data.list, resultCompletion.data.list, resultAFQ.data.list),
      total: resultSingle.data.total + resultMultiple.data.total + resultJudge.data.total + resultCompletion.data.total + resultAFQ.data.total
    }
    response.send(ResponseCode.SUCCESS, msg, data)
  }
}

const paperController = new PaperController()

export default paperController
