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

/**
 *
 * @param {*} companyId
 * @description 获取公司信息
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
/**
 *
 * @param {*} id
 * @description 删除角色数据
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/** *
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/**
 *
 * @param {*} data
 * @description 新增角色
 * @returns
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

