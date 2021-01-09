// import send from './../config/MailConfig'
// import moment from '@/controller/moment'
import Response from '../lib/Response'
import validatorForm from '../utils/validatorForm'
import service from '../service/index'
import Utils from '../utils/Utils'
import {setValue, delValue, getValue} from '../config/modules/RedisConfig'
import {
  getUserInfo,
  hasUserEmail,
  hasUsername,
  login,
  register,
  getUserInfos,
  openOrCloseUser,
  updateUser
} from '../service/UserDB'

const UserController = {
  /**
   * 登录
   * @param ctx
   * @returns {Promise<void>}
   */
  async login (ctx) {
    const response = new Response(ctx)
    
    const { username, password } = ctx.request.body
    
    const rules = [
      { value: username, errorMsg: '用户名不能为空', rule: 'empty' },
      { value: password, errorMsg: '密码不能为空', rule: 'empty' },
    ]
    
    const validator = validatorForm(rules)
    
    if (!validator) {
      response.failClient(validatorForm.getError())
      return
    }
    
    const user = await service.userService.findUserByUsernameAndPassword(username, password)
    
    if (Utils.isEmptyArray(user)) {
      response.failClient('用户名或密码不正确')
      return
    }

    const data = {
      token: Utils.getToken(user[0]._id)
    }

    setValue(Utils.encryption(data.token), user[0]._id.toString())

    response.success(data)
  },
  
  /**
   * 注册
   * @param ctx
   * @returns {Promise<void>}
   */
  async register (ctx) {
    const response = new Response(ctx)

    const { username, password } = ctx.request.body

    const rules = [
      { value: username, errorMsg: '用户名不能为空', rule: 'empty' },
      { value: password, errorMsg: '密码不能为空', rule: 'empty' },
    ]
    
    const validator = validatorForm(rules)
    
    if (!validator) {
      response.failClient(validatorForm.getError())
      return
    }

    const findUsers = await service.userService.findByUsername(username);

    if (Utils.isEmptyArray(findUsers)) {
      await service.userService.createUser(username, password);
      response.success([], '注册成功');
      return;
    }

    response.failClient('用户名已存在');
  },

  /**
   * 通过UID查询用户信息
   * @param {*} ctx 
   */
  async findUserInfoByUID(ctx) {
    const response = new Response(ctx);

    const token = ctx.request.header.authorization.split('Bearer ')[1];

    const encryptionToken = Utils.encryption(token);

    const id = await getValue(encryptionToken);

    if (id) {
      const user = await service.userService.findUserById(id);
      response.success(user, '');
    } else {
      response.failClient('无 uid');
    }
  },

  /**
   * 退出登录
   * @param {*} ctx 
   */
  async logout(ctx) {
    const response = new Response(ctx)

    const token = ctx.request.header.authorization.split('Bearer ')[1];

    const encryptionToken = Utils.encryption(token);

    await delValue(encryptionToken);

    response.success([], '退出登录成功');
  }
}

export default UserController
