import path from 'path'
import Koa from 'koa'
import compose from 'koa-compose'
import koaBody from 'koa-body'
import json from 'koa-json'
import cors from '@koa/cors'
// 安全插件
import helmet from 'koa-helmet'
// 静态资源插件
import statics from 'koa-static'
import compress from 'koa-compress'
import JWT from 'koa-jwt'

import router from './routes'
import config from './config/index'
import errorHandle from './common/ErrorHandle'
import TokenVerifyHandle from './common/TokenVerifyHandle.js'

const PORT = 4500

const app = new Koa()

const isDevMode = (process.env.NODE_ENV !== 'production')

const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: config.UN_AUTHENTICATION_API_REG })

// koa-compose 集成中间件
const middleware = compose([
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
  }),
  statics(path.join(__dirname, '../public')),
  cors(),
  json({ pretty: false, param: 'pretty' }),
  helmet(),
  // TokenVerifyHandle,
  // jwt,
  errorHandle,
  router()
])

if (isDevMode) {
  app.use(compress())
}

app.use(middleware)

app.listen(PORT)
