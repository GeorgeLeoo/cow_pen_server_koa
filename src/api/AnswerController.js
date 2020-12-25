import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import {
  getAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from '../db/moduels/AnswerDB'
import { updatePaperTested } from '../db/moduels/PaperDB'
import { createScore } from '../db/moduels/ScoreDB'
import { updateScore } from '../db/moduels/ScoreDB'
import { createWrong } from '../db/moduels/WrongDB'
import { loadFont } from 'svg-captcha'

class AnswerController {
  /**
   * 获取考生答案信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getAnswer (ctx) {
    const response = new Response(ctx)
    const { content, author, limit, page } = ctx.request.query
    if (!limit && limit > 0) {
      response.send(ResponseCode.CLIENT_ERROR, '页面大小必须大于0')
      return
    }
    if (!page) {
      response.send(ResponseCode.CLIENT_ERROR, '当前页面必须大于0')
      return
    }
    const condition = { isDelete: 0 }
    content && (condition.content = name)
    author && (condition.author = author)
    let { code, msg, data } = await getAnswers({
      condition,
      page: { limit, page },
    })
    response.send(code, msg, data)
  }
  
  /**
   * 创建考生答案
   * @param ctx
   * @returns {Promise<void>}
   */
  async createAnswer (ctx) {
    const response = new Response(ctx)
    const {
      single,
      multiple,
      judge,
      completion,
      afq,
      user,
      paper,
      paperType,
      singleScore,
      multipleScore,
      judgeScore,
      completionScore,
      afqScore,
    } = ctx.request.body
    if (!user) {
      response.send(ResponseCode.CLIENT_ERROR, '你还未登录')
      return
    }
    if (!paper) {
      response.send(ResponseCode.CLIENT_ERROR, '你还未参加考试')
      return
    }
    // 自动批改
    let totalScore = 0
    let totalNumber = 0
    const wrongList = []
    let isLook = false
    if (paperType === 0) {
      single && single.length > 0 && single.map(item => {
        if (item.answer.toUpperCase() === item.original.correctAnswer.toUpperCase()) {
          item.score += singleScore
          totalScore += singleScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'single',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      multiple && multiple.length > 0 && multiple.map(item => {
        if (item.answer.join(',') === item.original.correctAnswer.join(',')) {
          item.score += multipleScore
          totalScore += multipleScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'multiple',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      judge && judge.length > 0 && judge.map(item => {
        const map = {
          A: 0,
          B: 1
        }
        if (map[item.answer.toUpperCase()] === item.original.correctAnswer) {
          item.score += judgeScore
          totalScore += judgeScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'judge',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      completion && completion.length > 0 && completion.map(item => {
        if (item.answer === item.original.correctAnswer) {
          item.score += completionScore
          totalScore += completionScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'completion',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            user,
            original: item.original,
            paper
          })
        }
      })
      afq && afq.length > 0 && afq.map(item => {
        if (item.original && item.original.keywords) {
          isLook = true
          let i = 0
          const keywords = item.original.keywords.split('、')
          const eachScore = afqScore / keywords.length
          keywords.map(kw => {
            if (item.answer.includes(kw)) {
              i++
              item.score += eachScore
              totalScore += eachScore
            }
          })
          if (i === keywords.length) {
            totalScore = afqScore
            totalNumber++
          }
          if (i !== item.length) {
            wrongList.push({
              type: 'afq',
              subject: item.original.subjectId.name,
              knowledgePoint: item.original.knowledgePoint,
              question: item.original.question,
              original: item.original,
              user,
              paper
            })
          }
        }
      })
    }
    if (paperType === 1) {
      single && single.length > 0 && single.map(item => {
        if (item.answer.toUpperCase() === item.original.correctAnswer.toUpperCase()) {
          item.score += singleScore
          totalScore += singleScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'single',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      multiple && multiple.length > 0 && multiple.map(item => {
        if (item.answer.join(',') === item.original.correctAnswer.join(',')) {
          item.score += multipleScore
          totalScore += multipleScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'multiple',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      judge && judge.length > 0 && judge.map(item => {
        const map = {
          A: 0,
          B: 1
        }
        if (map[item.answer.toUpperCase()] === item.original.correctAnswer) {
          item.score += judgeScore
          totalScore += judgeScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'judge',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      completion && completion.length > 0 && completion.map(item => {
        if (item.answer === item.original.correctAnswer) {
          item.score += completionScore
          totalScore += completionScore
          totalNumber++
        } else {
          wrongList.push({
            type: 'completion',
            subject: item.original.subjectId.name,
            knowledgePoint: item.original.knowledgePoint,
            question: item.original.question,
            original: item.original,
            user,
            paper
          })
        }
      })
      afq && afq.length > 0 && afq.map(item => {
        if (item.original && item.keywords) {
          isLook = true
          let i = 0
          const keywords = item.original.keywords.split('、')
          const eachScore = afqScore / keywords.length
          keywords.map(kw => {
            if (item.answer.includes(kw)) {
              i++
              item.score += eachScore
              totalScore += eachScore
            }
          })
          if (i === keywords.length) {
            totalScore = afqScore
          }
          totalNumber++
          if (i !== item.length) {
            wrongList.push({
              type: 'afq',
              subject: item.original.subjectId.name,
              knowledgePoint: item.original.knowledgePoint,
              question: item.original.question,
              original: item.original,
              user,
              paper
            })
          }
        }
      })
    }
    let { code, msg, data } = await createAnswer({
      single,
      multiple,
      judge,
      completion,
      afq,
      user,
      paper
    })
    await updatePaperTested(paper)
    const body = { user, paper, score: totalScore, correctNumber: totalNumber, answer: data._id }
    afq.length > 0 && isLook ?  body.status = 1 :  body.status = 0
    await createScore(body)
    await createWrong(wrongList)
    response.send(code, msg)
  }
  
  /**
   * 更新考生答案
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateAnswer (ctx) {
    const response = new Response(ctx)
    const { scoreId, answerId, afq, paper, afqScore, score, currentAFQScore} = ctx.request.body
    const body = {
      query: { _id: answerId },
      update: { afq }
    }
    let totalScore = score - currentAFQScore
    let totalNumber = 0
    let wrongList = []
    afq && afq.length > 0 && afq.map(item => {
      totalScore += Number(item.score)
      if (item.answer === item.original.correctAnswer) {
        totalNumber++
      } else {
        wrongList.push({
          type: 'afq',
          subject: item.original.subjectId.name,
          knowledgePoint: item.original.knowledgePoint,
          question: item.original.question,
          original: item.original,
          paper
        })
      }
    })
    let { code, msg } = await updateAnswer(body)
    await createWrong(wrongList)
    await updateScore({ query: { _id: scoreId}, update: { status: 0, score: totalScore, correctNumber: totalNumber, } })
    response.send(code, msg)
  }
  
  /**
   * 删除考生答案
   * @param ctx
   * @returns {Promise<void>}
   */
  async deleteAnswer (ctx) {
    const { _id } = ctx.request.query
    const response = new Response(ctx)
    let { code, msg, data } = await deleteAnswer({ _id })
    response.send(code, msg, data)
  }
}

const answerController = new AnswerController()

export default answerController
