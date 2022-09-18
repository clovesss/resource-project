import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 设置一个独一无二的key值

// 获取 token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 修改 token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除 token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
