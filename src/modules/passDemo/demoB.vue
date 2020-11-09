<template>
  <div class="demoB">
    <button @click="showP">demoB</button>
    <demo-c v-bind="$attrs"
            :name="name"
            v-on="$listeners"></demo-c>
  </div>
</template>

<script>
export default {
  name: 'demoB',
  inject: ['for'],
  inheritAttrs: false,
  components: {
    demoC: () => import('../passDemo/demoC'),
  },
  data() {
    return {
      //
      msg: this.for,
      name: 'xianglin'
    }
  },
  methods: {
    showP() {
      // console.error(this.$refs)
      console.error(this.$attrs)
    },
    changename(val) {
      console.error(val)
      this.name = val
    }
  }
}
</script>

<style>
</style>