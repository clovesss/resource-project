import axios from 'axios'
// 创建 axios 实例
const service = axios.create()
// 配置请求拦截器
service.interceptors.request.use()
// 配置响应拦截器
service.interceptors.response.use()

export default service
