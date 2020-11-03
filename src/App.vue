<template>
  <div id="app">
    <h1>dream home</h1>
    <p>
      <router-link to='/math-jax'>mathJax</router-link>
      <router-link to='/keyboard'>keyboard</router-link>
      <router-link to='/swiper-photo'>图片轮播</router-link>
      <router-link to='/photo-cropper'>图片裁剪</router-link>
      <router-link to='/trajectory-dyn'>轨迹运动</router-link>
      <router-link to='/sound-wave'>音波图</router-link>
      <router-link to='/order-carousel'>上台连麦</router-link>
      <router-link to='/draw-sound'>音量图</router-link>
      <router-link to='/module-test'>模块加载测试</router-link>
      <router-link to='/test-event'>测试事件监听</router-link>
    </p>
    <router-view />
  </div>
</template>

<script>
import 'flex.css'
export default {
  name: 'App',
  data() {
    return {
      //
    }
  },
  methods: {
    initMathJax() {
      MathJax.Hub.Config({
        tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
        messageStyle: "none", //不显示信息
        showProcessingMessages: false,
        SVG: { linebreaks: { automatic: false }, scale: 100, },
        jax: ["input/TeX", "output/SVG", "output/PreviewHTML"],
        extensions: ["tex2jax.js"],
        TeX: {
          extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
        },
        "HTML-CSS": {
          availableFonts: ["STIX", "TeX"], //可选字体
          showMathMenu: false //关闭右击菜单显示
        }
      });
      MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    },
  },
  mounted() {
    // this.initMathJax()
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
