<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共 {{ page.total }} 条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=user')"
          >
            导入
          </el-button>
          <el-button size="small" type="danger" @click="exportData">
            导出
          </el-button>
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
// 引入过滤器方法
import { formatDate } from '@/filters'
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
    },
    // excel导出员工
    exportData() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载处理
      import('@/vendor/Export2Excel').then(async (excel) => {
        // 此时需要data里的数据
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows) // 返回的 data 就是导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // 导出
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: '员工资料表', // 非必填
          multiHeader, // 复杂表头
          merges // 合并选项
        })
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
        // 数据结构要和表头对应上
      })
    },
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map((item) => {
        // item是一个对象
        // ['手机号','姓名','入职日期']
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            // 格式化日期
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            )
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map((item) =>
      //   Object.keys(headers).map((key) => item[headers[key]])
      // )
      // 需要处理时间格式问题
    }
  }
}
</script>

<style>
</style>
