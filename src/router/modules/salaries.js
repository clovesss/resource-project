
import Layout from '@/layout'

const salaryRouter = {
  path: '/salaries',
  component: Layout,
  name: 'salaries',
  children: [
    {
      path: '',
      component: () => import('@/views/salaries'),
      name: 'salaries',
      meta: {
        title: '工资',
        icon: 'money'
      }
    },
    {
      path: 'setting',
      component: () => import('@/views/salaries/setting'),
      name: 'salariesSetting',
      hidden: true,
      meta: {
        title: '设置'
      }
    },
    {
      path: 'details/:yearMonth/:id',
      component: () => import('@/views/salaries/detail'),
      name: 'salariesDetails',
      hidden: true,
      meta: {
        title: '详情'
      }
    },
    {
      path: 'historicalArchiving',
      component: () => import('@/views/salaries/historical'),
      name: 'salariesHistorical',
      hidden: true,
      meta: {
        title: '历史归档'
      }
    },
    {
      path: 'monthStatement',
      component: () => import('@/views/salaries/month'),
      name: 'salariesMonthStatement',
      hidden: true,
      meta: {
        title: '月报表'
      }
    }
  ]
}
export default salaryRouter
