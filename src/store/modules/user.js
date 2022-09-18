import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user.js'

const state = {
  token: getToken() // 初始化的时候从cookie中读取token
}
const mutations = {
  /**
   *
   * @param {*} state 固定参数
   * @param {*} token 接口凭证
   * @description 定义修改 state 中 token 的方法
   */
  setToken(state, token) {
    state.token = token // 这里只修改了 state 中的数据
    // 我们需要把拿到的 token 值同步给缓存
    setToken(token)
  },
  /**
   *
   * @param {*} state
   * @description 当用户注销登录时，清空 token
   */
  remove(state) {
    state.token = null
    // 缓存里面也需要清空
    removeToken()
  }
}
const actions = {
  // 第一种写法
  async login(context, data) {
    const result = await login(data)
    // if (result.data.success) {
    // context.commit('setToken', result.data.data)
    // 在响应拦截器已经对数据做了结构，而且对 success 提前进行了判断，所以这里不需要再判断了
    context.commit('setToken', result)
    // }
  }
  // 第二种写法
  // login(context, data) {
  //   return new Promise(function (resolve) {
  //     login(data).then(result => {
  //       if (result.data.success) {
  //         context.commit('setToken', result.data.data)
  //         resolve() // 表示执行成功了
  //       }
  //     })
  //   })
  // }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

