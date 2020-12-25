import db from './../db/conn'
const Schema = db.Schema

/**
 * 公告
 */
const Notices = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admins'
  },
  content: String,
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
    default: Date.now()
  }
})

module.exports = db.model('Notices', Notices)
