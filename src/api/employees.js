import request from '@/utils/request'

/**
 * @description 获取员工简单列表
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *
 * @param {Object} params (page:页码，pagesize: 每页条数)
 * @description 获取员工列表
 * @returns (Object)
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
