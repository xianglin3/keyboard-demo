<template>
  <div>
    日志数据处理
  </div>
</template>
<script>
const logData = require('../data/log.json');
export default {
  name:'logfilter',
  date(){
    return{
      list:[]
    }
  },
  mounted() {
    console.log('logdata:', JSON.parse('"' + logData[0].lc.replaceAll('\\n','') + '"') );
  }
}
</script>
<style lang="less">
  
</style>