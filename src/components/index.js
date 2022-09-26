// 全局自定义组件的注册
// 引入通用工具栏组件
import PageTools from '@/components/PageTools'
// 引入导入组件
import UploadExcel from '@/components/UploadExcel'
export default {
  install(Vue) {
    // 注册全局通用工具栏的组件
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
