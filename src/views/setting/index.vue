<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary">
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
              <el-table-column align="center" label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
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
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 存放角色列表的数据
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0 // 记录数据总数
      },
      companyData: {} // 存放获取的公司信息
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
    }
  }
}
</script>

<style>
</style>
