<template>
  <div>
    <div id="math-jax"
         style="color:red;font-size:30px;text-align:center;"
         v-html='text'>
    </div>
    <div @click="testbtn"
         style="width: 100px;height: 60px; line-height: 60px;margin: 0 auto;border: 1px dotted #333;text-align:center;">动态变更</div>
  </div>
</template>
<script>
export default {
  name: 'mathJax',
  data () {
    return {
      text: '$小明走了\\frac{1}{2}\\times34\\div12米，请问，他走了多久？$'
    }
  },
  methods: {
    testbtn () {
      this.text = `$$\\frac{${Date.now()}}{${Math.floor(Math.random() * 100)}}$$`
    },
    backFun () {
      // alert('hello world')
    }
  },
  mounted () {
    // console.log(window.MathJax)
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById('math-jax')]);
  },
  updated () {
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById('math-jax')]);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('math-jax')], ["backFun", this]);
  }
}
</script>
<style>
.mjx-chtml {
  outline: 0;
}
.MJXc-display {
  overflow-x: auto;
  overflow-y: hidden;
}
</style>