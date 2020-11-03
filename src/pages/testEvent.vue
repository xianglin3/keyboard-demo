<template>
  <div>
    <h5>测试监听</h5>
    <button @click="startTime(text)">开始</button>
  </div>
</template>

<script>
import listenDemo from '../js/listens'
export default {
  name: '',
  data() {
    return {
      text: 'hello world'
    }
  },
  mounted() {
    listenDemo.addEventListener('TEST', (val) => {
      // alert('我被倒计时出发了')
      this.showAlert(val);
    })
  },
  methods: {
    startTime(val) {
      listenDemo.runTime(val);
    },
    showAlert(val) {
      alert(val);
    },
  },
  beforeDestroy() {
    listenDemo.removeEventListener('TEST');
  }
}
</script>