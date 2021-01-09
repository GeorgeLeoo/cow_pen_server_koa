import combineRoutes from 'koa-combine-routers'

import publicRouter from './modules/publicRouter'
import userRouter from './modules/userRouter'
import uploadRouter from './modules/uploadRouter'
import courseRouter from './modules/courseRouter'

export default combineRoutes(
	publicRouter,
	userRouter,
  uploadRouter,
  courseRouter
)
