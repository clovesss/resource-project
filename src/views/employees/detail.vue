<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="新密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobComponent" />
            <!-- <JobInfo /> -->
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 引入获取用户信息的接口
import { getUserDetailById } from '@/api/user'
// 引入保存员工信息的接口
import { saveUserDetailById } from '@/api/employees'
// 引入个人详情组件
import userInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'

export default {
  components: {
    userInfo,
    JobInfo
  },
  data() {
    return {
      UserComponent: 'user-info',
      JobComponent: 'job-info',
      JobInfo,
      // 路由 path 地址中用 : 拼接的动态参数获取的时候需要用 this.$route.params. 获取
      // 如果在 http 地址中是用 ? 拼接的传参方式需要用 this.$route.query. 来获取
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId 拿到 传入的 Id
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById() // 调用获取用户信息的接口
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 更新用户信息
    async saveUser() {
      try {
        await this.$refs.userForm.validate()
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2
        }) // 把获取到的员工信息里面的 password, 用我们表单中输入的密码值去更新它
        this.$message.success('用户信息更新成功！')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
