import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 引入element-ui的消息提示组件
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 设置超时时间 /s
// 创建 axios 实例
const service = axios.create({
  // 配置请求的基地址，在不同开发环境就会读取相应的开发环境里面的变量，我们修改了开发环境这个变量的值是为了在发送请求时触发代理机制。
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间
})
// 配置请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入我们的 token
  // 如果有  token
  if (store.getters.token) {
    // 只有token存在的时候，才有必要检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // token 超时了，我们需要双清（缓存跟vuex里user 中的 Token ）
      store.dispatch('user/logout') // 登出+双清操作
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
}
)
// 配置响应拦截器
service.interceptors.response.use(
  response => {
    // 接口响应成功
    const { message, data, success } = response.data
    if (success) {
      // 当我们登录成功时
      return data
    } else {
      // 登录失败时（比如用户名或密码错误）
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // error 信息里面又response的对象，我们可以判断此处是否有 10002 （后端定义的token失效代码）的错误代码
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 此时 token 超时了，我们需要登出+双清
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(error)
    } else {
      // 接口响应失败
      Message.error(error.message) // 错误消息提示
      // return Promise.reject(error) // 这行代码最终会通过catch进行捕获
    }
  }
)
// token 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
