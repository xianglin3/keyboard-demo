<template>
  <div class="demoC">
    <button @click="changeB">btnC</button>
  </div>
</template>

<script>
export default {
  name: 'demoC',
  components: {

  },
  data() {
    return {
      //
    }
  },
  inheritAttrs: false,
  beforeCreate() {
    console.error('bc', this.$attrs)
  },
  created() {
    console.error('cd', this.$attrs)
  },
  methods: {
    changeB() {
      this.$emit('click', 'mumu')
    }
  }
}
</script>

<style>
</style>