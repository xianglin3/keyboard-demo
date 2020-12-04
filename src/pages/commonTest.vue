<template>
  <div class="common">
    <div class="testOne">
      <ref-demo :colorName="one" />
    </div>
    <div class="testTwo">
      <ref-demo :colorName="two" />
    </div>
  </div>
</template>

<script>
import refDemo from '../components/refDemo';
export default {
  name: 'common-test',
  data() {
    return {
      one: 'red',
      two: 'orange',
    }
  },
  components: {
    refDemo,
  },
}
</script>
<style lang="less">
.common {
  width: 600px;
  height: 600px;
  display: flex;
  .testOne {
    flex: 1;
  }
  .testTwo {
    flex: 1;
  }
}
</style>