import request from '@/utils/request'

/**
 * @param {*} params page:页码，pagesize：每页条数
 * @returns 返回获取的角色列表数据
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
