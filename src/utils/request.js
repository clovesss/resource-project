import axios from 'axios'
import store from '@/store'
// 引入element-ui的消息提示组件
import { Message } from 'element-ui'
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
    // 接口响应失败
    Message.error(error.message) // 错误消息提示
    return Promise.reject(error) // 这行代码最终会通过catch进行捕获
  }
)

export default service
