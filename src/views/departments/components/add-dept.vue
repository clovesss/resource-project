<template>
  <!-- 新增部门的弹层 -->
  <!-- close Dialog 关闭时的回调 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width 设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="rulesForm"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="rulesForm.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="rulesForm.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="rulesForm.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="rulesForm.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from '@/api/departments.js'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 父组件传递过来的当前节点对象，用对象的id去查找同级部门
    currentNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 自定义校验函数
    //  同级部门中禁止出现重复部门
    const checkNameRepeat = async (rule, value, callback) => {
      // 失去焦点的时候需要重新获取一下数据
      const { depts } = await getDepartments()
      // console.log(depts) // 所有的部门数据
      const isRepeat = depts
        // 找到当前节点(点击添加时的节点)的同级部门
        .filter((item) => item.pid === this.currentNode.id)
        // 判断同级里名字是否和 value 重复
        .some((item) => item.name === value)
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    // 部门编码在整个模块中都不允许重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      // 这里是和所有的部门编码进行对比，不需要过滤
      const isRepeat = depts.some((item) => item.code === value && value)
      isRepeat // true or false
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }

    return {
      peoples: [], // 存放员工简单信息的数据
      rulesForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取员工简单信息
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定时触发
    btnOk() {
      // 手动校验
      this.$refs.deptForm.validate(async (isOk) => {
        if (isOk) {
          // 表单校验通过
          await addDepartments({ ...this.rulesForm, pid: this.currentNode.id })
          // console.log(this.rulesForm)
          // console.log(this.currentNode.id)
          console.log({ ...this.rulesForm, pid: this.currentNode.id })
          // 新增完成后，需要重新获取一下数据
          this.$emit('addDepts') // 子组件触发父组件方法，重新更新数据的方法
          // 第一种方式：子传父技术关闭弹层
          // 第二种方式：通过 .sync 修饰符关闭弹层 具体查看https://v2.cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
          this.$emit('update:showDialog', false)
          // 关闭 dialog 的时候，会触发 el-dialog 的 close 事件，此处不需要单独重置数据了
        }
      })
    },
    btnCancel() {
      // resetFields: 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.deptForm.resetFields()
      //  点击取消按钮时关闭弹层
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
