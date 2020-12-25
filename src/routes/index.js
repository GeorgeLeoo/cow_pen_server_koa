import combineRoutes from 'koa-combine-routers'

import publicRouter from './modules/publicRouter'
import userRouter from './modules/userRouter'
import uploadRouter from './modules/uploadRouter'

export default combineRoutes(
	publicRouter,
	userRouter,
	uploadRouter
)
