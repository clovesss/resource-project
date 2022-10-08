// 全局自定义组件的注册
// 引入通用工具栏组件
import PageTools from '@/components/PageTools'
// 引入excel导入组件
import UploadExcel from '@/components/UploadExcel'
// 引入上传图片的组件
import ImageUpload from './ImageUpload'
// 注册打印组件
import Print from 'vue-print-nb'
export default {
  install(Vue) {
    // 注册全局通用工具栏的组件
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
  }
}
