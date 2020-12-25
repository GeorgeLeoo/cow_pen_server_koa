import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import config from './../config'

class Utils {
  /**
   * 判断对象是否为空
   * @param obj
   * @returns {boolean}
   */
  isEmptyObject (obj) {
    if (typeof obj !== 'object') {
      return true
    }
    if (obj === null) {
      return true
    }
    const keys = Object.keys(JSON.parse(JSON.stringify(obj)))
    return keys.length === 0
  }
  
  /**
   * 获取token认证信息
   * @param _id 用户id
   */
  getToken (_id) {
    return jsonwebtoken.sign({
      _id,
      exp: config.TOKEN_EXP
    }, config.JWT_SECRET)
  }
  verifyToken(token){
    return new Promise(((resolve, reject) => {
      console.log(token)
      jsonwebtoken.verify(token, config.JWT_SECRET, function(err, decoded) {
        console.log(err, decoded)
        if (typeof decoded === 'string') {
          reject(err)
          return
        }
        resolve(decoded)
      });
    }))
  }
  
  /**
   * 保存文件
   * @param file  文件
   * @param path  文件路径
   * @returns {Promise<unknown>}
   */
  saveFile(file, path) {
    return new Promise((resolve, reject) => {
      const pathArray = path.split('/')
      const length = pathArray.length
      const _path = '/img/' + pathArray[length - 1]
      
      // 创建可读流
      let render = fs.createReadStream(file.path);
      // 创建写入流
      let upStream = fs.createWriteStream(path);
      
      render.pipe(upStream);
      upStream.on('finish', () => {
        resolve(_path)
      });
      upStream.on('error', (err) => {
        reject(err)
      });
      resolve(_path)
    })
  }
  deepClone(obj = {}) {
    // 值类型的情况下直接返回
    // obj 是 null，或者不是对象也不是数组，就直接返回
    if (typeof obj !== 'object' || obj == null) {
      return obj
    }
    // 初始化返回结果,是数组就定义为数组，是对象就定义为对象
    let result
    if (obj instanceof Array) {
      result = []
    } else {
      result = {}
    }
    
    for (const key in obj) {
      // 判断 key 是否是自身的属性
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        // 保证不是原型上的属性
        result[key] = this.deepClone(obj[key])
      }
    }
    
    return result
  }
}

export default new Utils()
