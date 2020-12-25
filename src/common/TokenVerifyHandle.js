import Utils from './../utils/Utils'
import ResponseCode from './../utils/ResponseCode'
import config from './../config'

export default async (ctx, next) => {
  const token = ctx.get('X-Access-Token')
  if (config.UN_AUTHENTICATION_API.includes(ctx.originalUrl)) {
    return next()
  } else {
    const res = await Utils.verifyToken(token.split(' ')[1])
    console.log(res)
    return next()
  }
}
