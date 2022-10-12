<template>
  <div ref="myDiv" class="radar-echarts">
    <!-- 雷达图  图标必须给宽和高-->
    111
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import { LegendComponent } from 'echarts/components'
echarts.use([LegendComponent])
export default {
  created() {},
  // 页面渲染完毕事件
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv) // 得到图标实例
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      legend: {
        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: '预算 vs 开销(Budget vs spending)',
          type: 'radar',
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: '张三'
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: '李四'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
.radar-echarts {
  width: 600px;
  height: 400px;
}
</style>
