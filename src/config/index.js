// mongo db
export const DB_URL = 'mongodb://root:123loveyou,@139.159.201.22:12306/cow_pen?authSource=admin'

// redis
export const REDIS = {
  host: '139.159.201.22',
  port: 15001,
  password: '123loveyou,'
}

// jwt
export const JWT_SECRET = 'a&*38QthAK8ui2RwISGLotgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!'

// token 过期时间
export const TOKEN_EXP = Math.floor(Date.now() / 1000) + 60 * 60 * 24

// 不用授权的api
export const UN_AUTHENTICATION_API_REG = [/\/user\/login/, /\/user\/register/]
export const UN_AUTHENTICATION_API = ['/user/login', '/user/register']

// 媒体文件基础路径
export const ABSOLUTE_BASE_PATH = '/root/www/media'
export const RELATIVE_BASE_PATH = '/media'

// 图片地址
export const ABSOLUTE_IMG_LOCAL_PATH = `/Users/georgeleeo/Documents/file/Graduation Project/ExamManagement/ExamManagement/media/img/`
export const ABSOLUTE_IMG_PATH = `${ABSOLUTE_BASE_PATH}/img/`
export const RELATIVE_IMG_PATH = `${RELATIVE_BASE_PATH}/img/`

// 头像地址
export const ABSOLUTE_AVATAR_PATH = `${ABSOLUTE_BASE_PATH}/avatar/`
export const RELATIVE_AVATAR_PATH = `${RELATIVE_BASE_PATH}/avatar/`

// 图片后缀
export const PICTURE_SUFFIX = ['png', 'jpg', 'jpeg']

export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  UN_AUTHENTICATION_API,
  UN_AUTHENTICATION_API_REG,
  TOKEN_EXP,
  ABSOLUTE_BASE_PATH,
  RELATIVE_BASE_PATH,
  ABSOLUTE_IMG_PATH,
  RELATIVE_IMG_PATH,
  ABSOLUTE_AVATAR_PATH,
  RELATIVE_AVATAR_PATH,
  PICTURE_SUFFIX,
  ABSOLUTE_IMG_LOCAL_PATH
}
