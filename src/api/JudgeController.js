import Response from "../utils/Response";
import ResponseCode from "../utils/ResponseCode";
import { getJudges, createJudge, updateJudge, deleteJudge, getKnowledgePointFromJudge } from '../db/moduels/JudgeDB'

class JudgeController {
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
    let { code, msg, data } = await getKnowledgePointFromJudge({
      condition,
      page: { limit, page },
    })
    response.send(code, msg, data)
  }
  /**
   * 获取填空信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getJudge(ctx) {
    const response = new Response(ctx);
    const { subjectId, knowledgePoint, question, limit, page } = ctx.request.query;
    if (!limit && limit > 0) {
      response.send(ResponseCode.CLIENT_ERROR, "页面大小必须大于0");
      return;
    }
    if (!page) {
      response.send(ResponseCode.CLIENT_ERROR, "当前页面必须大于0");
      return;
    }
    const condition = { isDelete: 0 };
    question && (condition.question = new RegExp(question))
    subjectId && (condition.subjectId = subjectId)
    knowledgePoint && (condition.knowledgePoint = new RegExp(knowledgePoint))
    let { code, msg, data } = await getJudges({
      condition,
      page: { limit, page },
    });
    response.send(code, msg, data);
  }
  
  /**
   * 创建填空
   * @param ctx
   * @returns {Promise<void>}
   */
  async createJudge(ctx) {
    const response = new Response(ctx);
    let {
      question,
      subjectId,
      knowledgePoint,
      correctAnswer,
      explanation,
      difficulty,
      admin,
    } = ctx.request.body;
    if (!admin) {
      response.send(ResponseCode.CLIENT_ERROR, "您还没有登录");
      return;
    }
    if (!question) {
      response.send(ResponseCode.CLIENT_ERROR, "题目不能为空");
      return;
    }
    if (!subjectId) {
      response.send(ResponseCode.CLIENT_ERROR, "请选择科目");
      return;
    }
    if (!knowledgePoint) {
      response.send(ResponseCode.CLIENT_ERROR, "知识点不能为空");
      return;
    }
    if (!(correctAnswer === 0 || correctAnswer === 1)) {
      response.send(ResponseCode.CLIENT_ERROR, "请给出正确答案");
      return;
    }
    if (!difficulty) {
      response.send(ResponseCode.CLIENT_ERROR, "请选择难度系数");
      return;
    }
    if (!explanation) {
      explanation = "略";
    }
    const insert = {
      question,
      subjectId,
      knowledgePoint,
      correctAnswer,
      explanation,
      difficulty,
      admin,
    };
    let { code, msg, data } = await createJudge(insert);
    response.send(code, msg, data);
  }
  
  /**
   * 更新填空
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateJudge(ctx) {
    const response = new Response(ctx);
    let {
      _id,
      question,
      subjectId,
      knowledgePoint,
      picture,
      correctAnswer,
      explanation,
      difficulty,
      admin,
    } = ctx.request.body;
    if (!admin) {
      response.send(ResponseCode.CLIENT_ERROR, "您还没有登录");
      return;
    }
    if (!question) {
      response.send(ResponseCode.CLIENT_ERROR, "题目不能为空");
      return;
    }
    if (!subjectId) {
      response.send(ResponseCode.CLIENT_ERROR, "请选择科目");
      return;
    }
    if (!knowledgePoint) {
      response.send(ResponseCode.CLIENT_ERROR, "知识点不能为空");
      return;
    }
    if (!(correctAnswer === 0 || correctAnswer === 1)) {
      response.send(ResponseCode.CLIENT_ERROR, "请给出正确答案");
      return;
    }
    if (!difficulty) {
      response.send(ResponseCode.CLIENT_ERROR, "请选择难度系数");
      return;
    }
    if (!explanation) {
      explanation = "略";
    }
    const body = {
      query: { _id },
      update: {
        question,
        subjectId,
        knowledgePoint,
        correctAnswer,
        explanation,
        difficulty,
        admin,
      },
    };
    let { code, msg, data } = await updateJudge(body);
    response.send(code, msg, data);
  }
  
  /**
   * 删除填空
   * @param ctx
   * @returns {Promise<void>}
   */
  async deleteJudge(ctx) {
    const { _id } = ctx.request.query;
    const response = new Response(ctx);
    let { code, msg, data } = await deleteJudge({ _id });
    response.send(code, msg, data);
  }
}

const completionController = new JudgeController();

export default completionController;
