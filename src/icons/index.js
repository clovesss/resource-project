import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
// 注册使用 svg 图标的全局组件
Vue.component('svg-icon', SvgIcon)

// 把所有的 .svg 文件引入到项目中
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

