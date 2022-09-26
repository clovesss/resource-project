// 全局自定义组件的注册
import PageTools from '@/components/PageTools'
export default {
  install(Vue) {
    // 注册全局通用工具栏的组件
    Vue.component('PageTools', PageTools)
  }
}
