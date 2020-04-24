<template>
  <div class="trajectory-dyn">
    <div id="start"></div>
    <div id="end"></div>
    <bezier></bezier>
  </div>
</template>

<script>
import bezier from '../components/bezierBox'
export default {
  name: 'trajectory-dyn',
  data () {
    return {
    }
  },
  components: {
    bezier
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
.trajectory-dyn {
  position: relative;
  width: 600px;
  height: 600px;
  #start {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    background: #333;
  }
  #end {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 50px;
    background: red;
  }
}
</style>
