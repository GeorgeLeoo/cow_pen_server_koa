import db from './../db/conn'

const Schema = db.Schema

/**
 * 试卷
 */
const Papers = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admins'
  },
  testType: Number, // 0 模拟考试， 1 正式考试
  password: String,
  paperName: String,
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subjects'
  },
  startTime: String,
  endTime: String,
  durationTime: String,
  difficulty: Number,
  attention: String,
  paperType: Number,  // 0 固定组卷，1 随机组卷
  count: {
    type: Number,
    default: 0
  },
  total: Number,
  singleNumber: Number,
  singleScore: Number,
  multipleNumber: Number,
  multipleScore: Number,
  judgeNumber: Number,
  judgeScore: Number,
  completionNumber: Number,
  completionScore: Number,
  afqNumber: Number,
  afqScore: Number,
  single: [{
    type: Schema.Types.ObjectId,
    ref: 'Singles'
  }],
  multiple: [{
    type: Schema.Types.ObjectId,
    ref: 'Multiples'
  }],
  judge: [{
    type: Schema.Types.ObjectId,
    ref: 'Judges'
  }],
  completion: [{
    type: Schema.Types.ObjectId,
    ref: 'Completions'
  }],
  afq: [{
    type: Schema.Types.ObjectId,
    ref: 'AFQs'
  }],
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

module.exports = db.model('Papers', Papers)
