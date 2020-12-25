import ResponseCode from './../utils/ResponseCode'

export default (ctx, next) => {
  return next().catch((err) => {
    if (err.status === ResponseCode.UN_AUTHORIZATION) {
      ctx.status = ResponseCode.UN_AUTHORIZATION
      ctx.body = {
        code: ResponseCode.UN_AUTHORIZATION,
        msg: err.message
      }
    } else {
      ctx.status = err.status || ResponseCode.SERVICE_ERROR
      ctx.body = {
        code: ResponseCode.SERVICE_ERROR,
        msg: err.message
      }
    }
  })
}
