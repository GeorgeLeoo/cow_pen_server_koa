import Response from '../utils/Response'
import ResponseCode from '../utils/ResponseCode'
import { ABSOLUTE_AVATAR_PATH, ABSOLUTE_IMG_LOCAL_PATH } from '../config'
import Utils from './../utils/Utils'
import path from 'path'

class UploadController {
  async save (ctx) {
    // 上传单个文件
    const { file } = ctx.request.files
    const response = new Response(ctx)
    Utils.saveFile(file, `/Users/georgeleeo/Documents/file/Graduation Project/ExamManagement/ExamManagement/media/img/${file.name}`)
      .then(res => {
        response.send(ResponseCode.SUCCESS, '上传成功', res)
      }).catch(e => {
      response.send(ResponseCode.SERVICE_ERROR, '上传失败', e)
    })
  }
}

const uploadController = new UploadController()

export default uploadController
