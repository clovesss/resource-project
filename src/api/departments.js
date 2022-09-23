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
// 接口是根据restful的规则设计的，删除业务 delete  新增业务 post  修改 put 获取 get
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
/**
 * @description 新增数据
 */
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
/**
 * @param id 为当前点击的对象id
 * @description 获取部门详情，在我们点击编辑的时候数据回填在表单中
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
