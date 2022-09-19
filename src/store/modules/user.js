import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user.js'

const state = {
  token: getToken(), // 初始化的时候从cookie中读取token
  userInfo: {} // 定义一个空的对象 不是null 我们在getters设置快捷访问，此处不能为null
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
  },
  /**
 *
 * @param {*} state
 * @params result 获取的用户资料{}
 * @description 更新用户资料的方法
 */
  setUserInfo(state, result) {
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result } // 响应式 ，属于浅拷贝
    // state.userInfo['username'] = result// 这样才不是响应式
  },
  /**
   *
   * @param {*} state
   * @description 删除用户信息
   */
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 第一种写法
  async login(context, data) {
    const result = await login(data)
    // if (result.data.success) {
    // context.commit('setToken', result.data.data)
    // 在响应拦截器已经对数据做了解构，而且对 success 提前进行了判断，所以这里不需要再判断了
    context.commit('setToken', result)
    // 拿到token 说明登录成功
    setTimeStamp() // 设置当前的时间戳
    // }
  }, // 第二种写法
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

  async getUserInfo(context) {
    const result = await getUserInfo()
    // 要传从上面拿到的id 所以要写在获取用户资料的下面
    const baseInfo = await getUserDetailById(result.userId) // 主要是为了获取员工头像（staffPhoto）
    // const baseResult = { ...result, ...baseInfo }
    // 触发 mutations 里更新用户资料的方法
    // context.commit('setUserInfo', result)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    // return result // 给我们后期做权限留下的伏笔
    // return baseResult
    return { ...result, ...baseInfo }
  },
  /**
   *
   * @param {*} context
   * @description 登出功能
   */
  logout(context) {
    // 删除token
    context.commit('remove') // 移除token，移除vuex 中 state的 token
    // 删除用户信息
    context.commit('removeUserInfo')
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

