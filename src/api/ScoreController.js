import Response from "../utils/Response";
import ResponseCode from "../utils/ResponseCode";
import {
	getScores,
	createScore,
	updateScore,
	deleteScore,
} from "../db/moduels/ScoreDB";

class ScoreController {
	/**
	 * 获取成绩信息
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async getScore(ctx) {
		const response = new Response(ctx);
		const { content, author, limit, page, status } = ctx.request.query;
		if (!limit && limit > 0) {
			response.send(ResponseCode.CLIENT_ERROR, "页面大小必须大于0");
			return;
		}
		if (!page) {
			response.send(ResponseCode.CLIENT_ERROR, "当前页面必须大于0");
			return;
		}
		const condition = { isDelete: 0 };
		content && (condition.content = name);
		author && (condition.author = author);
    status && (condition.status = status);
		let { code, msg, data } = await getScores({
			condition,
			page: { limit, page },
		});
		response.send(code, msg, data);
	}

	/**
	 * 创建成绩
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async createScore(ctx) {
		const response = new Response(ctx);
		const {
			studentId,
			paperId,
			startTime,
			endTime,
			diffTime,
			score,
			correctNumber,
			status,
		} = ctx.request.body;
		let { code, msg, data } = await createScore({
			studentId,
			paperId,
			startTime,
			endTime,
			diffTime,
			score,
			correctNumber,
			status,
		});
		response.send(code, msg, data);
	}

	/**
	 * 更新成绩
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async updateScore(ctx) {
		const response = new Response(ctx);
		const {
			_id,
			studentId,
			paperId,
			startTime,
			endTime,
			diffTime,
			score,
			correctNumber,
			status,
		} = ctx.request.body;
		const body = {
			query: { _id },
			update: {
				studentId,
				paperId,
				startTime,
				endTime,
				diffTime,
				score,
				correctNumber,
				status,
			},
		};
		let { code, msg, data } = await updateScore(body);
		response.send(code, msg, data);
	}

	/**
	 * 删除成绩
	 * @param ctx
	 * @returns {Promise<void>}
	 */
	async deleteScore(ctx) {
		const { _id } = ctx.request.query;
		const response = new Response(ctx);
		let { code, msg, data } = await deleteScore({ _id });
		response.send(code, msg, data);
	}
}

const scoreController = new ScoreController();

export default scoreController;
