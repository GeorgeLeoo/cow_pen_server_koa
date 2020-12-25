import db from './../db/conn'
const Schema = db.Schema

/**
 * 分数
 */
const Scores = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: 'Answers'
  },
  paper: {
    type: Schema.Types.ObjectId,
    ref: 'Papers'
  },
  startTime: Number,
  endTime: Number,
  diffTime: Number,
  score: Number,
  correctNumber: Number,
  // 1 未批改 0 已批改
  status: {
    type: Number,
    default: 1
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

module.exports = db.model('Scores', Scores)
