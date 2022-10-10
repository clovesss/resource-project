import store from '@/store'
// 定义一个混入对象
export default {
  // 混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时,所有混入对象的选项将被“混合”进入该组件本身的选项
  methods: {
    // 检查功能权限的方法
    checkPermission(key) {
      // 从用户信息userInfo里面找到 points 中是否存在 key
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
