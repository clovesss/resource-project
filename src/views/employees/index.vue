<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共 {{ page.total }} 条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >
            导入
          </el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">
            新增员工
          </el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column
            label="序号"
            sortable=""
            type="index"
            :index="indexF"
          />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <!-- 方式1 使用局部过滤器实现 -->
          <!-- <el-table-column align="center" label="聘用形式" sortable="">
            <template slot-scope="scope">
              <span>{{ scope.row.formOfEmployment | changeType }}</span>
            </template>
          </el-table-column> -->
          <!-- 方式2 使用表格内置 formatter 属性实现 -->
          <el-table-column
            align="center"
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column
            label="入职时间"
            align="center"
            sortable=""
            prop="timeOfEntry"
          >
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="账户状态"
            sortable=""
            prop="enableState"
          >
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <!-- 这里是作用域插槽的两种写法 -->
            <!-- <template slot-scope="{ row }"> -->
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
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
          <el-pagination
            layout="prev, pager, next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 弹出层 -->
      <!-- 添加.sync修饰符的目的是,在子组件中通过 this.$emit('update:showDialog',false)来更新 showDialog变量的值 -->
      <add-employee :show-dialog.sync="showDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入员工的枚举对象
import EmployeeEnum from '@/api/constant/employees'
// 引入弹出层组件
import AddEmployee from '@/views/employees/components/add-employee.vue'
export default {
  components: {
    AddEmployee
  },
  // filters: {
  //   changeType(value) {
  //     if (value === 1) {
  //       return '正式'
  //     } else if (value === 2) {
  //       return '非正式'
  //     } else {
  //       return '未知'
  //     }
  //   }
  // },
  data() {
    return {
      loading: false,
      list: [],
      page: {
        page: 1, // 当前页码
        size: 5,
        total: 0 // 总数
      },
      showDialog: false // 控制弹出层的显示与隐藏
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 自定义索引计算方法
    indexF(index) {
      return (this.page.page - 1) * this.page.size + index + 1
    },
    // 页面切换
    changePage(currentPage) {
      this.page.page = currentPage
      this.getEmployeeList()
    },
    // 获取员工列表
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 格式化聘用形式
    // row 表示单元格所在行的所有字段信息
    // column 表示列的信息
    // cellValue 表示单元格的值
    formatEmployment(row, column, cellValue, index) {
      // console.log(cellValue); // 1
      // find()方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('你确定删除员工吗？')
        // 调用删除接口
        await delEmployee(id)
        // 重新拉取员工列表
        this.getEmployeeList()
        this.$message.success('删除员工成功！')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
