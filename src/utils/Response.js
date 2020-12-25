import ResponseCode from './../utils/ResponseCode'

class Response {
  constructor (ctx) {
    this.ctx = ctx
  }
  
  send(code = ResponseCode.SUCCESS, msg = '', data=[]) {
    let body = {
      code,
      msg,
      data
    }
    this.ctx.status = code
    this.ctx.body = body
  }
}

export default Response
