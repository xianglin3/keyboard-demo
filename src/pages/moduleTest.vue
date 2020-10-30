<template>
  <div class="test">
    我是父组件
    <test-one />
  </div>
</template>
<script>
import testOne from '../modules/testOneModule/testOne'

import testOneModule from '../modules/testOneModule/vuex'

import { mapGetters } from 'vuex';
export default {
  name: 'test',
  data() {
    return {
    }
  },
  components: {
    testOne
  },
  computed: {
    ...mapGetters({
      getChangeData: 'getChangeData'
    })
  },
  watch: {
    getChangeData: {
      handler(val) {
        console.error('我是父组件', val)
      }
    }
  },
  beforeCreate() {
    this.$store.registerModule('test-one', testOneModule);
  },
  beforeMount() {
    setTimeout(() => {
      this.$store.dispatch('setChangeData', 'changge');
    }, 0)
  },
  destroyed() {
    this.$store.unregisterModule('test-one');
  }
}
</script>
<style lang="less" scoped>
</style>