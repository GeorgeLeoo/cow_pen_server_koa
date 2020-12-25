import db from './../db/conn'
const Schema = db.Schema

/**
 * 错题
 */
const Wrongs = new Schema({
  subject: String,  // 科目
  knowledgePoint: String, // 考点
  question: String, // 题目
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  original: Object,  // 来源
  paper: {  // 试卷信息
    type: Schema.Types.ObjectId,
    ref: 'Papers'
  },
  count: {
    type:Number,
    default: 1
  },
  type: String,
  /**
   * 数据状态
   * 0 表示存在
   * 1 表示删除
   * 默认 0
   */
  isDelete: {
    type: Number,
    default: 0
  },
  /**
   * 创建时间
   */
  createdAt: {
    type: Date,
    default: new Date()
  }
})

module.exports = db.model('Wrongs', Wrongs)
