<template>
  <div ref="refdemo"
       class="refd">
    <button @click="btnChange">换肤</button>
  </div>
</template>

<script>
export default {
  name: 'ref-demo',
  data() {
    return {

    }
  },
  props: ['colorName'],
  mounted() {

  },
  methods: {
    btnChange() {
      this.$refs.refdemo.style.background = this.colorName;
    }
  }
}
</script>
<style lang="less">
.refd {
  width: 100%;
  height: 100%;
}
</style>