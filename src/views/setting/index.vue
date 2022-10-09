<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 border:边框，label:标题 -->
            <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据-->
            <el-table border="" :data="list">
              <!-- 如果设置了 type=index，可以通过传递 index 属性来自定义索引 -->
              <el-table-column
                align="center"
                type="index"
                :index="indexF"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="角色名称"
                width="240"
              />
              <el-table-column align="center" prop="description" label="描述" />
              <!-- 获取点击当前行的数据，需要通过作用域插槽的方式 -->
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(scope.row.id)"
                  >
                    分配权限
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(scope.row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(scope.row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <!--
                page-size每页显示条目个数
                total	总条目数
                current-page当前页数
              -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!--
              Alert警告，用于页面中展示重要的提示信息
              show-icon属性来显示 Alert 的 icon
              closable 属性决定是否可关闭 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="companyData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 点击编辑时出现的对话框 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配权限的弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限是棵树 -->
      <!-- el-tree 默认只识别显示 label 与 children 属性的内容,可以使用props重写 -->
      <!--  show-checkbox 表示 节点是否可被选择 -->
      <!-- check-strictly 默认false,子父节点的勾选是关联的 -->
      <!-- default-checked-keys 默认勾选的节点的 key 的数组 -->
      <!-- node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        show-checkbox
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOk">
            确定
          </el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm
} from '@/api/setting'
// 引入获取权限列表的接口
import { getPermissionList } from '@/api/permission'
// 引入转换树形的方法
import { tranListToTreeData } from '@/utils/index.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 存放角色列表的数据
      permData: [], // 存放权限的树型数据
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0 // 记录数据总数
      },
      companyData: {}, // 存放获取的公司信息,
      showDialog: false, // 控制弹框的展示与隐藏
      showPermDialog: false, // 分配权限的弹层显示隐藏
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名字不能为空', trigger: 'blur' }]
      },
      defaultProps: {
        label: 'name'
      },
      roleId: null, // 用来记录分配角色的id
      selectCheck: [] // 定义一个数组来接收 已经选中的节点
    }
  },
  computed: {
    ...mapGetters(['companyId']) // 从vuex获取companyId
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 自定义索引计算方法
    indexF(index) {
      return (this.page.page - 1) * this.page.pagesize + index + 1
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page) // 发起带参的请求 total:number,rows:Object
      this.list = rows
      this.page.total = total
    },
    changePage(currentPage) {
      // currentPage 点击的当前页
      // console.log(currentPage)
      this.page.page = currentPage
      this.getRoleList()
    },
    // 调用获取公司信息的接口
    async getCompanyInfo() {
      this.companyData = await getCompanyInfo(this.companyId)
    },
    // 注册删除角色的方法
    async deleteRole(id) {
      try {
        // 提醒用户是否确认删除
        await this.$confirm('你确定要删除该角色吗？')
        // 调用删除接口
        await deleteRole(id)
        // 重新获取角色列表
        this.getRoleList()
        this.$message.success('删除角色成功！')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击编辑按钮，对话框展示
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },

    // 在编辑的对话框点击确认
    async btnOK() {
      try {
        // validate	是对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        await this.$refs.roleForm.validate()
        // 手动校验成功才可以进入下面代码
        // 如果 roleForm 有id 属性就是我们编辑功能获取到的数据对象
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        // 拉取最新数据
        this.getRoleList()
        this.$message.success('编辑成功')
        // 关闭对话框
        this.showDialog = false // 这里的关闭对话框会触发 el-dialog 的 close 事件，而我们的 close 绑定的是 btnCancel 事件，此处不许在进行处理
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭弹框
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验信息
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 分配权限按钮的方法
    async assignPerm(id) {
      // 把权限数据转换为树形数据
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 存储点击当前角色的id
      this.roleId = id
      const { permIds } = await getRoleDetail(id) // 当前角色拥有的权限点数据
      // console.log(permIds)
      // 把当前角色拥有的权限id赋值
      this.selectCheck = permIds
      // 显示分配权限的窗口
      this.showPermDialog = true
    },
    // 分配权限确定的方法
    async btnPermOk() {
      // console.log(this.$refs.permTree.getCheckedKeys())
      // getCheckedKeys	若节点可被选择，则返回目前被选中的节点的 key 所组成的数组
      await assignPerm({
        // 调用el-tree的方法
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId
      })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    // 分配权限取消按钮的方法
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>
</style>
