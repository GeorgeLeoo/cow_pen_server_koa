import db from './../db/conn'
const Schema = db.Schema

/**
 * 科目
 */
const Subjects = new Schema({
  // 科目名称
  name: String,
  // 科目描述
  desc: String,
  // 作者id
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

module.exports = db.model('Subjects', Subjects)
