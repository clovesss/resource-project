import request from '@/utils/request'

/**
 * @description 获取组织架构的数据
 */
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
/**
 *
 * @description 删除组织架构的数据
*/
//
// 接口是根据restful的规则设计的，删除 delete  新增 post  修改 put 获取 get
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
