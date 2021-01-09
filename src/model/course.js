import db from './../db/conn'
const Schema = db.Schema

/**
 * 填空题
 */
const Courses = new Schema({
  courseName: String,
  level: Number,
  levelOneId: String,
  levelTwoId: String,
  operator: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  isDelete: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

export default db.model('Courses', Courses)
