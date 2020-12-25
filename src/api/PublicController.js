import svgCaptcha from 'svg-captcha'
import { captcha } from './settings'
import Response from './../utils/Response'
import { getValue, setValue } from './../config/modules/RedisConfig'
import ResponseCode from './../utils/ResponseCode'

class PublicController {

  async getCaptcha (ctx) {
    const body = ctx.request.query
    
    const response = new Response(ctx)
    const newCaptcha = svgCaptcha.create(captcha)
    setValue(body.sid, newCaptcha.text, 15)
    response.send(ResponseCode.SUCCESS, '', newCaptcha.data)
  }

  test (ctx) {
    const response = new Response(ctx)
    response.send(ResponseCode.SUCCESS, 'success', { success: 200 })
  }
}

const publicController = new PublicController()

export default publicController
