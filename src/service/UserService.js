import Users from '../model/users'

class UserService {
	/**
	 * 查询用户信息
	 * @param {string} username 用户名
	 * @param {string} password 密码
	 */
	async findUserByUsernameAndPassword(username, password) {
		return await Users.find({ username, password })
	}

	/**
	 * 创建用户
	 * @param {string} username
	 * @param {string} password
	 * @return user
	 */
	async createUser(username, password) {
    return await Users.insertMany({ username, password })
  }
  
    /**
   * 通过 用户名 查找用户
   * @param {string} username
   * @return user
   */
  async findByUsername(username) {
    return await Users.find({ username });
  }

    /**
   * 通过 id 查找用户
   */
  async findUserById(id) {
    return await Users.findOne({ _id: id }, { password: 0 });
  }
}

export default UserService
