<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <span> 操作<i class="el-icon-arrow-down"></i> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments.js'
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  // 点击 编辑 删除 新增时触发
  methods: {
    operateDepts(command) {
      if (command === 'add') {
        // 添加子部门
        // 当点击添加子部门时，需要子组件向父组件传递事件，顺便我们把当前节点的信息传递过去，就是props中的treeNode
        this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (command === 'edit') {
        //  编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        //  删除部门
        this.$confirm('确定要删除该部吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 如果点击了确定就会进入then
            return delDepartments(this.treeNode.id) // 这里我们是请求的接口，返回的是promise对象，我们可以继续.then 链式处理
          })
          .then(() => {
            //  删除成功之后，父组件显示的数据需要更新，使用子、父通信的技术
            this.$emit('delDepts') // 触发父组件里的自定义事件
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          })
      }
    }
  }
}
</script>
