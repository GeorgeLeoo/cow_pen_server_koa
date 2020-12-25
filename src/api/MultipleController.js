import Response from "../utils/Response";
import ResponseCode from "../utils/ResponseCode";
import {
  getMultiples,
  createMultiple,
  updateMultiple,
  deleteMultiple,
  getKnowledgePointFromMultiple
} from '../db/moduels/MultipleDB'

class MultipleController {
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
    let { code, msg, data } = await getKnowledgePointFromMultiple({
      condition,
      page: { limit, page },
    })
    response.send(code, msg, data)
  }
  /**
   * 获取多选信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getMultiple(ctx) {
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
    let { code, msg, data } = await getMultiples({
      condition,
      page: { limit, page },
    });
    response.send(code, msg, data);
  }
  
  /**
   * 创建多选
   * @param ctx
   * @returns {Promise<void>}
   */
  async createMultiple(ctx) {
    const response = new Response(ctx);
    let {
      question,
      subjectId,
      knowledgePoint,
      picture,
      a,
      b,
      c,
      d,
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
    if (!a) {
      response.send(ResponseCode.CLIENT_ERROR, "选项A不能为空");
      return;
    }
    if (!b) {
      response.send(ResponseCode.CLIENT_ERROR, "选项B不能为空");
      return;
    }
    if (!c) {
      response.send(ResponseCode.CLIENT_ERROR, "选项C不能为空");
      return;
    }
    if (!d) {
      response.send(ResponseCode.CLIENT_ERROR, "选项D不能为空");
      return;
    }
    if (!correctAnswer || correctAnswer.length === 0) {
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
      picture,
      a,
      b,
      c,
      d,
      correctAnswer,
      explanation,
      difficulty,
      admin,
    };
    let { code, msg, data } = await createMultiple(insert);
    response.send(code, msg, data);
  }
  
  /**
   * 更新多选
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateMultiple(ctx) {
    const response = new Response(ctx);
    let {
      _id,
      question,
      subjectId,
      knowledgePoint,
      picture,
      a,
      b,
      c,
      d,
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
    if (!a) {
      response.send(ResponseCode.CLIENT_ERROR, "选项A不能为空");
      return;
    }
    if (!b) {
      response.send(ResponseCode.CLIENT_ERROR, "选项B不能为空");
      return;
    }
    if (!c) {
      response.send(ResponseCode.CLIENT_ERROR, "选项C不能为空");
      return;
    }
    if (!d) {
      response.send(ResponseCode.CLIENT_ERROR, "选项D不能为空");
      return;
    }
    if (!correctAnswer || correctAnswer.length === 0) {
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
        picture,
        a,
        b,
        c,
        d,
        correctAnswer,
        explanation,
        difficulty,
        admin,
      },
    };
    let { code, msg, data } = await updateMultiple(body);
    response.send(code, msg, data);
  }
  
  /**
   * 删除多选
   * @param ctx
   * @returns {Promise<void>}
   */
  async deleteMultiple(ctx) {
    const { _id } = ctx.request.query;
    const response = new Response(ctx);
    let { code, msg, data } = await deleteMultiple({ _id });
    response.send(code, msg, data);
  }
}

const completionController = new MultipleController();

export default completionController;
