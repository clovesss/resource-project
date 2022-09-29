<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // console.log(header, results) // header 是excel中的表头， results 是员工数据的对象,结构如下
      /*    results:{
        { 入职日期： 43535
        姓名： "高大山"
        工号： "20089"
        手机号: "13000000000"
        转正日期: "43719" },{...},{...}
      } , 我们需要的是英文关键字的数据对象比如：
      {
        timeOfEntry: 43535
        username: "高大山"
        ......
      },所以需要对数据进行转换处理操作
      */
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      /* // 数据转换处理 方式1
      const arr = []
      results.forEach((item) => {
        console.log(item) // 此处 item 是遍历的员工的数据对象
        const userInfo = {}
        // console.log(Object.keys(item)) // 这里的 Object.keys(item) 是中文名的关键字数组  ['手机号', '姓名', '入职日期', '转正日期', '工号']
        Object.keys(item).forEach((key) => {
          // console.log(key) // 这里的key是中文名的关键字 比如： 手机号   姓名
          // console.log(userRelations[key]) // userRelations[key] 是对应的英文关键字 比如 mobile    username
          // console.log(item[key]) // item 是遍历的员工数据对象 { 入职日期:43535,姓名:"高大山",工号:"20089",手机号: "13000000000",转正日期:"43719" }，key是中文关键字，item[key]就是 key 对应的值.
          userInfo[userRelations[key]] = item[key] // userInfo[mobile] 就是userInfo中的key,就是 { mobile:'' }。这句代码就是把中文对应的值赋值给原来英文对应的值
        })
        arr.push(userInfo)
      })
      console.log(arr) // 这里得到英文关键字的数据对象 [{correctionTime: 43719,mobile: 13041139879,timeOfEntry: 43535,username: "高大山",workNumber: 20089}, {…}, {…}] */

      // 数据转换处理 方式2 map
      const newArr = results.map((item) => {
        const userInfo = {}
        Object.keys(item).forEach((key) => {
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], '/')
            ) // 经过函数转换日期后得到的是 字符串型 的时间数据，我们需要date型的时间数据
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        return userInfo
      })
      // console.log(newArr)
      // 调用excel导入员工的接口
      await importEmployee(newArr)

      this.$router.back() // 回到上一个页面
      this.$message.success('导入excel成功')
    },
    // 转换 excel 中的日期格式的方法
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70) // 由于 excel 里面的日期转换为时间戳后，比原本日期多了 70 年
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      // console.log(year, month, date)

      if (format && format.length === 1) {
        return year + format + month + format + date
      }

      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style scoped>
</style>
