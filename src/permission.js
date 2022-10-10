// 权限拦截的实现
// 1. 由于权限拦截需要判断要跳转的路由地址，需要使用路由守卫的技术，所以需要引入路由。
// 2. 要用到 vuex 中存储的 token ，需要引入 store
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 定义白名单，里面不受权限拦截
const whiteList = ['/login', '404']
// 前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  /* must call `next` */
  // next() 表示通过  next(false) 终止 next(地址) 跳转到某个地址
  // 如果用户携带了 token
  if (store.getters.token) {
    // 判断跳转的是不是登录页，如果是就直接跳转到首页
    if (to.path === '/login') {
      next('/') // 跳转到首页
    } else {
      // 我们需要在此处获取用户资料
      // 如果 vuex 中的 state 已经有用户资料了，我们就不用获取
      if (!store.getters.userId) {
        // 如果没有 ID 才表示当前用户资料没有获取过，我们需要获取
        // 由于用户模块中 getUserInfo 方法里在接口调用完毕之后将返回的结果 return 了，所以这里可以拿到该数据
        // async 函数所 return 的内容，用 await 就能接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说以后我们要从用户资料拿到数据，此处必须改成同步(要当我们的用户资料获取完)
        // 筛选用户的可访问路由
        // console.log(roles.menus, 0)
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // routes 就是筛选得到的动态路由
        // 把动态路由添加到路由表中
        // console.log(routes, 2)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path) // 动态添加路由之后必须 next(to.path)
      } else { next() } // 直接放行
    }
  } else {
    /* has no token*/
    // 判断跳转的页面是否在白名单内，在的话需要放行
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  // 有一种情况 在有 token 的时候，跳转到登录页面又会重定向到主页，路由地址没有变化，就没有经过路由后置守卫，此时进度条就会不关闭
  NProgress.done() // 解决手动切换地址时，进度条不关闭的问题
})
// 后置守卫
// 路由后置守卫代表的是页面跳转成功之后执行的钩子函数，里面有两个参数to/from，常用来在路由跳转成功之后执行一些逻辑，比如说是修改标题。

router.afterEach((to, from) => {
  // finish progress bar
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
