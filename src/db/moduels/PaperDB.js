import Papers from '../../model/papers'
import Singles from '../../model/singles'
import Multiples from '../../model/multiples'
import Judges from '../../model/judges'
import Completions from '../../model/completions'
import Afqs from '../../model/afqs'
import ResponseCode from '../../utils/ResponseCode'
import Utils from '../../utils/Utils'
import { getWrongsOnlyOriginal } from './../../db/moduels/WrongDB'

/**
 * 查询总数量
 * @param condition
 * @returns {Promise<unknown>}
 */
const getCount = function (condition) {
  return new Promise(resolve => {
    Papers.countDocuments(condition, function (err, count) {
      resolve(count)
    })
  })
}

/**
 * 查询试卷
 * @param query
 * @returns {Promise<unknown>}
 */
export const getPapers = function (query) {
  return new Promise(async (resolve) => {
    const count = await getCount(query.condition)
    let select = { isDelete: 0, __v: 0 }
    const populates = [
      { path: 'admin', select: { username: 1, _id: 1 } },
      { path: 'subject', select: { name: 1, _id: 1 } },
    ]
    if (!query.type) {
      populates.push(...[{
        path: 'single',
        select: { isDelete: 0, __v: 0 },
        subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
          path: 'subjectId',
          select: { name: 1, _id: 1 }
        }]
      },
        {
          path: 'multiple',
          select: { isDelete: 0, __v: 0 },
          subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
            path: 'subjectId',
            select: { name: 1, _id: 1 }
          }]
        },
        {
          path: 'judge',
          select: { isDelete: 0, __v: 0 },
          subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
            path: 'subjectId',
            select: { name: 1, _id: 1 }
          }]
        },
        {
          path: 'completion',
          select: { isDelete: 0, __v: 0 },
          subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
            path: 'subjectId',
            select: { name: 1, _id: 1 }
          }]
        },
        {
          path: 'afq',
          select: { isDelete: 0, __v: 0 },
          subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
            path: 'subjectId',
            select: { name: 1, _id: 1 }
          }]
        }])
    }
    Papers.find(query.condition, select)
      .populate(populates)
      .limit(parseInt(query.page.limit))
      .skip((parseInt(query.page.page) - 1) * parseInt(query.page.limit))
      .sort({ _id: -1 })
      .exec((err, papers) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: papers,
            total: count
          }
        })
      })
  })
}

export const getHotPapers = function (query) {
  return new Promise(async (resolve) => {
    let select = { isDelete: 0, __v: 0 }
    const populates = [
      { path: 'admin', select: { username: 1, _id: 0 } },
      { path: 'subject', select: { name: 1, _id: 1 } },
    ]
    Papers.find(query.condition, select)
      .populate(populates)
      .limit(10)
      .skip(0)
      .sort({ count: -1 })
      .exec((err, papers) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        resolve({
          code: ResponseCode.SUCCESS, data: {
            list: papers,
            total: papers.length
          }
        })
      })
  })
}

export const getWrongKnowledgePoint = function (query) {
  return new Promise(resolve => {
    Papers.aggregate([{ $match: query }, {
      $group: {
        _id: '$knowledgePoint',
        total: { $sum: 1 }
      }
    }], function (err, wrongs) {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      } else {
        resolve({ code: ResponseCode.SUCCESS, data: wrongs })
      }
    })
  })
}

/**
 * 通过id查询试卷
 * @param _id
 * @param type
 * @param user
 * @returns {Promise<unknown>}
 */
export const getPaperById = function (_id, type, user) {
  return new Promise(resolve => {
    const populates = [
      { path: 'admin', select: { username: 1, _id: 0 } },
      { path: 'subject', select: { name: 1, _id: 1 } },
      {
        path: 'single',
        select: { isDelete: 0, __v: 0 },
        subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
          path: 'subjectId',
          select: { name: 1, _id: 1 }
        }]
      },
      {
        path: 'multiple',
        select: { isDelete: 0, __v: 0 },
        subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
          path: 'subjectId',
          select: { name: 1, _id: 1 }
        }]
      },
      {
        path: 'judge',
        select: { isDelete: 0, __v: 0 },
        subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
          path: 'subjectId',
          select: { name: 1, _id: 1 }
        }]
      },
      {
        path: 'completion',
        select: { isDelete: 0, __v: 0 },
        subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
          path: 'subjectId',
          select: { name: 1, _id: 1 }
        }]
      },
      {
        path: 'afq',
        select: { isDelete: 0, __v: 0 },
        subPopulate: [{ path: 'admin', select: { username: 1, _id: 0 } }, {
          path: 'subjectId',
          select: { name: 1, _id: 1 }
        }]
      }
    ]
    if (type === 'FIXED') {
      Papers.findOne({ _id, isDelete: 0 }, { __v: 0, isDelete: 0 }, (err, paper) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
          return
        }
        resolve({ code: ResponseCode.SUCCESS, data: paper })
      }).populate(populates)
      
    } else if (type === 'RANDOM') {
      Papers.findOne({ _id, isDelete: 0 }, { __v: 0, isDelete: 0 }, async (err, paper) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
          return
        }
        let data = Utils.deepClone(paper)._doc
  
        let res1 = await getWrongsOnlyOriginal({
          condition: { type: 'single', subject: paper.subject.name, user },
          limit: Math.floor(paper.singleNumber / 2)
        })
        data.single.push(...res1.data)
        Singles.aggregate([{ $sample: { size: res1.data.length ? paper.singleNumber : Math.round(paper.singleNumber / 2) } }], async (err, singles) => {
          if (err) {
            resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
            return
          }
          data.single = singles
  
          let res2 = await getWrongsOnlyOriginal({
            condition: { type: 'multiple', subject: paper.subject.name, user },
            limit: Math.floor(paper.multipleNumber / 2)
          })
          data.multiple.push(...res2.data)
          Multiples.aggregate([{ $sample: { size: res2.data.length ? paper.multipleNumber : Math.round(paper.multipleNumber / 2) } }], async (err, multiples) => {
            if (err) {
              resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
              return
            }
            data.multiple = multiples
            
            let res3 = await getWrongsOnlyOriginal({
              condition: { type: 'judge', subject: paper.subject.name, user },
              limit: Math.floor(paper.judgeNumber / 2)
            })
            data.judge.push(...res3.data)
            Judges.aggregate([{ $sample: { size: res3.data.length === 0 ? paper.judgeNumber : Math.round(paper.judgeNumber / 2) } }],  async (err, judges) => {
              if (err) {
                resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
                return
              }
              data.judge = judges
              
              let res4 = await getWrongsOnlyOriginal({
                condition: { type: 'completion', subject: paper.subject.name, user },
                limit: Math.floor(paper.completionNumber / 2)
              })
              data.completion.push(...res4.data)
              Completions.aggregate([{ $sample: { size: res4.data.length === 0 ? paper.completionNumber : Math.round(paper.completionNumber / 2) } }],  async (err, completions) => {
                if (err) {
                  resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
                  return
                }
                data.completion = completions
                let res5 = await getWrongsOnlyOriginal({
                  condition: { type: 'afq', subject: paper.subject.name, user },
                  limit: Math.floor(paper.afqNumber / 2)
                })
                data.afq.push(...res5.data)
                Afqs.aggregate([{ $sample: { size: res5.data.length === 0 ? paper.afqNumber : Math.round(paper.afqNumber / 2) } }], async (err, afqs) => {
                  if (err) {
                    resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
                    return
                  }
                  data.afq = afqs
                  resolve({ code: ResponseCode.SUCCESS, data })
                })
              })
            })
          })
        })
      }).populate(populates)
    } else {
      resolve({ code: ResponseCode.SERVICE_ERROR, msg: '参数错误' })
    }
  })
}

export const hasPaperPassword = function (password) {
  return new Promise(resolve => {
    Papers.find({ password }, { __v: 0, isDelete: 0 }, (err, papers) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        return
      }
      if (papers.length === 0) {
        resolve({ code: ResponseCode.SUCCESS })
        return
      }
      resolve({ code: ResponseCode.SUCCESS, msg: '该密码已被使用过，请重新设置密码' })
    })
  })
}

/**
 * 创建试卷
 * @param body
 * @returns {Promise<unknown>}
 */
export const createPaper = function (body) {
  return new Promise((resolve) => {
    Papers.insertMany(body, (err, papers) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      resolve({ code: ResponseCode.SUCCESS, msg: '添加成功', data: [] })
    })
  })
}

/**
 * 更新试卷
 * @param body
 * @returns {Promise<unknown>}
 */
export const updatePaper = function (body) {
  return new Promise((resolve) => {
    Papers.updateOne(body.query, { $set: body.update }, (err, papers) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (papers.nModified === 1) {
        resolve({
          code: ResponseCode.SUCCESS,
          msg: '更新成功',
          data: [],
        })
      } else {
        resolve({
          code: ResponseCode.SERVICE_ERROR,
          msg: '更新失败',
          data: [],
        })
      }
    })
  })
}

/**
 * 删除试卷
 * @param query
 * @returns {Promise<unknown>}
 */
export const deletePaper = function (query) {
  return new Promise((resolve) => {
    Papers.updateOne(
      { _id: query._id },
      { $set: { isDelete: 1 } },
      (err, papers) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (papers.nModified === 1) {
          resolve({
            code: ResponseCode.SUCCESS,
            msg: '删除成功',
            data: [],
          })
        } else {
          resolve({
            code: ResponseCode.SERVICE_ERROR,
            msg: '删除失败',
            data: [],
          })
        }
      }
    )
  })
}

/**
 * 修改试卷考试人数
 * @param _id
 * @returns {Promise<unknown>}
 */
export const updatePaperTested = function (_id) {
  return new Promise((resolve) => {
    Papers.findByIdAndUpdate(_id, { $inc: { count: 1 } }, (err, papers) => {
      if (err) {
        resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
      }
      if (papers.nModified === 1) {
        resolve({
          code: ResponseCode.SUCCESS,
          msg: '更新成功',
          data: [],
        })
      } else {
        resolve({
          code: ResponseCode.SERVICE_ERROR,
          msg: '更新失败',
          data: [],
        })
      }
    })
  })
}

/**
 * 验证密码
 * @param condition
 * @returns {Promise<unknown>}
 */
export const verifyPaperPassword = function (condition) {
  return new Promise((resolve) => {
    let select = { isDelete: 0, __v: 0 }
    Papers.find(condition, select)
      .populate({ path: 'subject', select: { name: 1, _id: 1 } })
      .exec((err, papers) => {
        if (err) {
          resolve({ code: ResponseCode.SERVICE_ERROR, msg: err })
        }
        if (papers.length === 0) {
          resolve({
            code: ResponseCode.SERVICE_ERROR,
            msg: '验证失败，请联系管理员',
            data: [],
          })
        } else {
          const data = {
            _id: papers[0]._id,
            subject: papers[0].subject,
            paperName: papers[0].paperName,
            startTime: papers[0].startTime,
            endTime: papers[0].endTime
          }
          resolve({
            code: ResponseCode.SUCCESS,
            data
          })
        }
      })
  })
}

