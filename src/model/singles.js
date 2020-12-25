import db from './../db/conn'
const Schema = db.Schema

/**
 * 单选
 */
const Singles = new Schema({
  question: {
    type: String
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subjects'
  },
  knowledgePoint: String,
  picture: String,
  a: String,
  b: String,
  c: String,
  d: String,
  correctAnswer: String,
  explanation: String,
  difficulty: Number,
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admins'
  },
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

module.exports = db.model('Singles', Singles)
