<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form
      ref="addEmployee"
      :model="rulesForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="rulesForm.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="rulesForm.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="rulesForm.timeOfEntry"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="rulesForm.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <!-- 遍历聘用形式的数组 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="rulesForm.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="rulesForm.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :default-expand-all="true"
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="rulesForm.correctionTime"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
// 引入获取部门数据的接口
import { getDepartments } from '@/api/departments'
// 引入转化为树形数据的方法
import { tranListToTreeData } from '@/utils'
// 引入新增员工接口
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 外部引入的数据应该在 data 中进行定义，这里主要是为了拿到聘用形式里面的数据
      // 部门表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      // 表单校验定义
      rulesForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        // 树形组件和input控件是独立的个体，当选择具体部门时就会立即触发 blur 事件，提示校验信息，不符合业务逻辑，此处触发方式我们应改为 change
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取到部门数据，转化为树型结构显示
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments() // 获取部门数据，depts 是一个数组，我们需要转化为树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 选择部门时的触发函数
    selectNode(node) {
      console.log(arguments) // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
      this.rulesForm.departmentName = node.name // 点击的节点name 赋值给部门名字
      this.showTree = false // 选择后关闭树形的选项
    },
    // 确定按钮
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate()
        // 调用新增员工接口
        await addEmployee(this.rulesForm)
        // 添加完毕，告知父组件更新数据
        // 方式1 : 通过子组件向父组件通信的方式， this.$emit('changeData', false);
        // 方式2 : 在子组件中拿到父组件的实例，然后调用父组件实例里面的查询方法，更新视图
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this, 使用是有条件的，不能放在element-ui 标签里面
        // console.log(this.$parent) // 父组件的实例
        this.$parent.getEmployeeList()
        // 方式1： this.$emit('update:showDialog', false)
        // 方式2：
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 取消按钮
    btnCancel() {
      // 重置数据对象 rulesForm
      this.rulesForm = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 处理用户如果点击了部门，此时会触发树的显示，点击取消或者关闭按钮后，重新打开时树仍显示的问题
      this.showTree = false
      // 重置校验结果
      this.$refs.addEmployee.resetFields()
      // 关闭弹出框
      // 触发在父组件里放置的子组件中被 .sync 修饰的 show-dialog 属性的变量值的 false 更新
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
</style>
