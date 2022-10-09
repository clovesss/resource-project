// 控制路由权限

// 引入定义的路由
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes // 默认所有用户均可访问静态路由
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 合并 默认静态路由 与 传入的用户有权限查看的动态路由
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数 menus 为用户资料里的菜单权限标识，即用户资料下 roles 下的 menus
  filterRoutes(context, menus) {
    // 筛选出 menus 中与 动态路由 asyncRoutes 中 name 相同的路由页面
    const routes = [] // 存储当前用户有权限访问的路由
    menus.forEach(key => {
      // key 是标识

      routes.push(...asyncRoutes.filter(item =>
        // 筛选出 各路由的name 与 标识key 相同的路由集合
        key === item.name
      ))
    })
    // 触发 mutations 里的 setRoutes 方法
    context.commit('setRoutes', routes)
    return routes // 这里的 state数据 是用来显示该用户左侧菜单用的， return 是给路由 addRoutes 用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
