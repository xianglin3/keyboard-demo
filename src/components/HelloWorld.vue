<template>
  <div class="demo-keyboard">
    <div class="keyboard-output" @click="show = true">
      <span id="mathinput" class="edit"></span>
    </div>
    <math-keyboard 
        :show.sync="show"
        :keypanel='1'
        :editId="editId"
        :value.sync="value"
        @submit="submit"
    ></math-keyboard>
  </div>
</template>

<script>
import mathKeyboard from '../lib/keyboard'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      show:false,
      value:'',
      editId: 'mathinput'
    }
  },
  components:{
    mathKeyboard,
  },
  methods:{
    submit(val){
      console.log('fxl',val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.demo-keyboard{
  width: 1110px;
  height: 160px;
  margin: 0 auto;
  background: #2C2B31;
  .keyboard-output{
      width: 100%;
      height: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      .edit{
        width: 290px;
        min-height: 46px;
        text-align: center;
        background: #FBFDFF;
        border-radius: 4px;
        font-size: 24px;
        color: #2C2B31;
        // line-height: 46px;
        display: flex;
        align-items: center
      }
  }
}
.demo-keyboard textarea{
  display: none !important;
}
</style>
<style>
 .demo-keyboard textarea{
  display: none !important;
} 
</style>
