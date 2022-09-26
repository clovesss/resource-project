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

/**
 *
 * @param {Number} id
 * @description 删除员工的接口
 */
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 *
 * @param {Object} data
 * @description 新增员工的接口
 */
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
