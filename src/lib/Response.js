'use strict';

class Response {

  constructor(ctx) {
    this.ctx = ctx;
  }

  send(code, data, msg) {
    if (this.ctx) {
      this.ctx.status = code;
      this.ctx.body = {
        code,
        msg,
        data,
      };
    } else {
      throw new Error('send error');
    }
  }

  success(data, msg) {
    this.send(Response.SUCCESS, data, msg);
  }

  failClient(msg) {
    this.send(Response.CLIENT_ERROR, [], msg);
  }

  fail(msg) {
    this.send(Response.CLIENT_ERROR, [], msg);
  }

  failService(msg) {
    this.send(Response.SERVICE_ERROR, [], msg);
  }

  getResponse() {
    return this.ctx.response.body.data
  }
}

Response.SUCCESS = 200  //  请求成功
Response.FAIL = 900  //  获取数据失败
Response.UN_AUTHORIZATION = 401  // 客户端未授权、未登录
Response.CLIENT_ERROR = 406 //  客户端错误，未传递正确的参数
Response.SERVICE_ERROR = 501  //  服务器内部错误

export default Response;
