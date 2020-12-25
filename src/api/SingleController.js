import Response from "../utils/Response";
import ResponseCode from "../utils/ResponseCode";
import {
  getSingles,
  createSingle,
  updateSingle,
  deleteSingle,
  getKnowledgePointFromSingle
} from '../db/moduels/SingleDB'

class SingleController {
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
    let { code, msg, data } = await getKnowledgePointFromSingle({
      condition,
      page: { limit, page },
    })
    response.send(code, msg, data)
  }
  /**
   * 获取单选信息
   * @param ctx
   * @returns {Promise<void>}
   */
  async getSingle(ctx) {
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
    let { code, msg, data } = await getSingles({
      condition,
      page: { limit, page },
    });
    response.send(code, msg, data);
  }
  
  /**
   * 创建单选
   * @param ctx
   * @returns {Promise<void>}
   */
  async createSingle(ctx) {
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
    if (!['A','B','C','D'].includes(correctAnswer)) {
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
    let { code, msg, data } = await createSingle(insert);
    response.send(code, msg, data);
  }
  
  /**
   * 更新单选
   * @param ctx
   * @returns {Promise<void>}
   */
  async updateSingle(ctx) {
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
    if (!['A','B','C','D'].includes(correctAnswer)) {
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
        a,
        b,
        c,
        d,
        picture,
        correctAnswer,
        explanation,
        difficulty,
        admin,
      },
    };
    console.log(picture)
    let { code, msg, data } = await updateSingle(body);
    response.send(code, msg, data);
  }
  
  /**
   * 删除单选
   * @param ctx
   * @returns {Promise<void>}
   */
  async deleteSingle(ctx) {
    const { _id } = ctx.request.query;
    const response = new Response(ctx);
    let { code, msg, data } = await deleteSingle({ _id });
    response.send(code, msg, data);
  }
}

const completionController = new SingleController();

export default completionController;
