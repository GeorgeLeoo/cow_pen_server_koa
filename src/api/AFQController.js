import Response from "../utils/Response";
import ResponseCode from "../utils/ResponseCode";
import { getAFQs, createAFQ, updateAFQ, deleteAFQ, getKnowledgePointFromAFQ } from '../db/moduels/AFQDB'

class AFQController {
	/**
	 * 获取解答选信息
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async getAFQ(ctx) {
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
		let { code, msg, data } = await getAFQs({
			condition,
			page: { limit, page },
		});
		response.send(code, msg, data);
	}

	/**
	 * 创建解答选
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async createAFQ(ctx) {
		const response = new Response(ctx);
		let {
			question,
			subjectId,
      picture,
			knowledgePoint,
			correctAnswer,
			explanation,
			difficulty,
			admin,
      keywords
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
		if (!correctAnswer) {
			response.send(ResponseCode.CLIENT_ERROR, "正确答案不能为空");
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
      picture,
			knowledgePoint,
			correctAnswer,
			explanation,
			difficulty,
      admin,
      keywords
		};
		let { code, msg, data } = await createAFQ(insert);
		response.send(code, msg, data);
	}

	/**
	 * 更新解答选
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async updateAFQ(ctx) {
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
      keywords
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
		if (!correctAnswer) {
			response.send(ResponseCode.CLIENT_ERROR, "正确答案不能为空");
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
        picture,
				knowledgePoint,
				correctAnswer,
				explanation,
				difficulty,
        admin,
        keywords
			},
		};
		let { code, msg, data } = await updateAFQ(body);
		response.send(code, msg, data);
	}

	/**
	 * 删除解答选
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async deleteAFQ(ctx) {
		const { _id } = ctx.request.query;
		const response = new Response(ctx);
		let { code, msg, data } = await deleteAFQ({ _id });
		response.send(code, msg, data);
	}
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
    let { code, msg, data } = await getKnowledgePointFromAFQ({
      condition,
      page: { limit, page },
    })
    response.send(code, msg, data)
  }
}

const afqController = new AFQController();

export default afqController;
