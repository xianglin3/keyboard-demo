<template>
  <div class="pass-value">
    <button @click="changeA">parentBTN1</button>
    <demoA ref="dema"
           :parentData="msg"
           @onDemoA="demoA" />
  </div>
</template>

<script>
export default {
  name: 'pass-value',
  data() {
    return {
      //
      msg: '我是父组件的数据'
    }
  },
  components: {
    demoA: () => import('../modules/passDemo/demoA'),
  },
  provide: {
    for: '提供的值',
  },
  computed: {
  },
  beforeCreate() { },
  created() { },
  beforeMount() { },
  mounted() { },
  beforeUpdata() { },
  updated() { },
  beforeDestroy() { },
  destroyed() { },
  methods: {
    demoA(val) {
      console.error(val)
      this.msg = val;
    },
    changeA() {
      // this.$children[0].msg = 'hello world new';
      // this.$refs.dema.msg = '哈哈哈哈哈哈'
      // console.error(this.$refs)

      this.msg = 123;
    }
  },
}
</script>

<style lang="">
</style>