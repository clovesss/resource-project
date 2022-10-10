<template>
  <div>
    <template>
      <div>
        <el-row type="flex" justify="end">
          <el-select
            v-model="currentYear"
            size="small"
            style="width: 120px"
            @change="dateChange"
          >
            <el-option
              v-for="item in yearList"
              :key="item"
              :label="item"
              :value="item"
            >
              {{ item }}
            </el-option>
          </el-select>
          <el-select
            v-model="currentMonth"
            size="small"
            style="width: 120px; margin-left: 10px"
            @change="dateChange"
          >
            <el-option
              v-for="item in 12"
              :key="item"
              :label="item"
              :value="item"
            >
              {{ item }}
            </el-option>
          </el-select>
        </el-row>
        <el-calendar v-model="currentDate">
          <!-- 通过设置名为 dateCell 的 scoped-slot 来自定义日历单元格中显示的内容。在 scoped-slot 可以获取到 date（当前单元格的日期）, data（包括 type，isSelected，day 属性） -->
          <!-- 作用域插槽和具名插槽同时使用 需要用 v-slot:名字 -->
          <!-- date:  单元格代表的日期  -->
          <!-- data:  { type, isSelected, day}，type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month；isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd -->
          <template v-slot:dateCell="{ date, data }" class="content">
            <div class="date-content">
              <span class="text"> {{ data.day | getDay }}</span>
              <span v-if="isWeekends(date)" class="rest">休</span>
            </div>
          </template>
        </el-calendar>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      // split() 方法使用指定的分隔符字符串将一个String对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。
      const day = value.split('-')[2]
      // startsWith() 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 true 或 false。
      // substring() 方法返回一个字符串在开始索引到结束索引之间的一个子集，或从开始索引直到字符串的末尾的一个子集。
      return day.startsWith('0') ? day.substring(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      // props 中默认数据如果是数组或者对象类型等复杂数组类型时，需要使用回调函数的形式2
      default: () => new Date() // 设置 startDate 的默认时间
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null, // 当前时间
      yearList: []
    }
  },
  // 页面初始化时我们需要获取当前日期
  created() {
    // 获取当前年份 和 当前月份
    this.currentYear = this.startDate.getFullYear() // 从起始时间获取当前年份
    this.currentMonth = this.startDate.getMonth() + 1
    // 获取到当前年后，需要拿到前后5年的年份数据
    this.yearList = Array.from(
      Array(11),
      (val, index) => index + this.currentYear - 5
    )
  },
  methods: {
    // 转换日期的方法
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)
    },
    // 判断当前日期是否时周末
    isWeekends(value) {
      // getDay() 方法根据本地时间，返回一个具体日期中一周的第几天，0 表示星期天。
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
/* 当样式表标签中如果有scoped 属性的时候，如果要修改外部组件的样式，可能会不起作用，我们可以通过深度选择器 /deep/ 进行样式穿透，或者取掉 scoped */

::v-deep .el-calendar-day {
  height: auto;
}
::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none;
}
</style>
