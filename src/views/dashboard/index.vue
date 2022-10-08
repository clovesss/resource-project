<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <PageTools :show-before="true">
      <!-- 具名插槽
      slot="slot占位名称"
      使用 template包括显示的内容，在template标签上写 v-slot:slot占位名称 -->
      <template v-slot:before>
        <span>我是一个提示</span>
      </template>
      <el-button slot="after" type="warning">自定义按钮</el-button>
    </PageTools>

    <!-- excel导入组件显示测试 -->
    <UploadExcel />
    <ImageUpload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
