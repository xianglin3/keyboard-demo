<template>
  <div  class="keyboard" :class="{'keyboardup':show}">
    <!-- 输入框 -->
    <!-- <div class="keyboard-output">
      <span :id="mathinput" class="edit"></span>
    </div> -->
    <!-- 键盘 -->
    <div class="keyboard-panel">
      <div class="keyboard-panel-default">
        <div class="keyboard-default-num">
          <ul>
            <li v-for="(item,index) in keynum" 
              :key="index"
              @click="insertar(item.v)"
            >{{item.k}}</li>
          </ul>
        </div>
        <div class="keyboard-default-sym">
          <ul>
            <li v-for="(item,index) in keysym" 
              :key="index"
              @click="insertar(item.v)"
            >{{item.k}}</li>
          </ul>
        </div>
        <div class="keyboard-default-feature">
          <ul>
            <li v-for="(item,index) in keyfea"
              :key="index"
              @click="insertar(item.v)"
            >{{item.k}}</li>
          </ul>
        </div>
        <div class="keyboard-default-submit">
          <div class="submit-btn" @click="submit">√</div>
        </div>
      </div>
    </div>
  </div >
</template>

<script>
import "mathquill/build/mathquill"
import 'mathquill/build/mathquill.css'
import { setTimeout, clearTimeout } from 'timers'

export default {
  name: "math-keyboard",
  data() {
    return {
      mathField: null,
      mathinput:'mathinput',
      panel: this.keypanel,
      keynum:[
        {k:'1',v:'1',i:''},
        {k:'2',v:'2',i:''},
        {k:'3',v:'3',i:''},
        {k:'4',v:'4',i:''},
        {k:'5',v:'5',i:''},
        {k:'6',v:'6',i:''},
        {k:'7',v:'7',i:''},
        {k:'8',v:'8',i:''},
        {k:'9',v:'9',i:''},
        {k:'0',v:'0',i:''},
      ],
      keysym:[
        {k:'/',v:'/',i:''},
        {k:'.',v:'.',i:''},
        {k:'%',v:'%',i:''},
        {k:'+',v:'+',i:''},
        {k:'×',v:'\\times',i:''},
        {k:'<',v:'<',i:''},
        {k:'>',v:'>',i:''},
        {k:'=',v:'=',i:''},
        {k:'-',v:'-',i:''},
        {k:'÷',v:'\\div',i:''}
      ],
      keyfea:[
        {k:'删除',v:'Backspace',i:''},
        {k:'清空',v:'del',i:''}
      ],
      latex:this.value,
      keyshow:this.show
    };
  },
  props:{
    show: Boolean,
    value: String,
    keypanel: {
      type: Number,
      default: 1
    },
    editId: {
      type: String,
      default: 'mathinput',
      required: true
    },
    output:String
  },
  mounted() {
    this.initMathQuill()
  },
  methods: {
    // 初始化数学键盘输入
    initMathQuill(){
      var that = this
      var mathFieldSpan = document.getElementById(this.editId);
      var MQ = MathQuill.getInterface(2);
      var mathField = that.mathField = MQ.MathField(mathFieldSpan, {
        spaceBehavesLikeTab: true,
        leftRightIntoCmdGoes: 'up',
        restrictMismatchedBrackets: true,
        sumStartsWithNEquals: false,
        supSubsRequireOperand: true,
        charsThatBreakOutOfSupSub: '+-=<>',
        autoSubscriptNumerals: true,
        autoCommands: 'frac',
        autoOperatorNames: 'sin cos',
        maxDepth: 1,
        handlers: {
          edit: function(mathField) {
            that.$emit('update:value',mathField.latex())
            //显示光标
            const controller = mathField.__controller;
            controller.cursor.show();
            controller.blurred = false;
          },
          upOutOf: function(mathField) { 
            console.log('uuuuuuuuuuu')
          },
          moveOutOf: function(dir, mathField) {
            console.log('mmmmmmm',dir)
             if (dir === MQ.L) {

             }
          }
        }
      });
      that.mathField.latex(that.value)
      // window.onresize = function(){
      //   var content = $('#mathinput .mq-root-block')
      //   content.scrollLeft(content[0].scrollWidth)
      // }
    },
    insertar(valor) {
      console.log(valor)
      var that = this;
      if(valor == 'Backspace'){
        that.mathField.keystroke(valor);
      } else if(valor == 'del'){
        that.mathField.latex('')
        this.$emit('update:val', '')
      } else {        
        console.log(this.mathField.latex(), valor)
          // this.mathField.cmd(valor);
        if (this.mathField.latex().indexOf('frac') == -1 && valor == '/') {
          // that.mathField.write(that.value)
          that.mathField.latex(this.mathField.latex() + '\\frac{}{1}')
          that.mathField.keystroke('Backspace');
          that.mathField.keystroke('Backspace');
          // this.mathField.cmd(valor);
        } else if (valor != '/') {
          this.mathField.cmd(valor);
        }
      }
    },
    keyhide(event){
      this.$emit('update:show',false)
      this.$emit('update:val',this.value)
    },
    // 提交
    submit(){
      console.log('fxlkkkkkk', this.value)
      this.$emit('submit', this.value)
    }
  },
  watch:{
    value(nval,oval){
      if(!this.show){
        this.mathField.latex(this.value)
      }
      // var content = $('#mathinput .mq-root-block')
      // content.scrollLeft(content[0].scrollWidth)
    },
    // loadState(val){
    //   if(val){
    //     this.initMathQuill()
    //   }
    // }
  }
};
</script>

<style scoped lang="less">
  ul{
    padding:0;
  }
  li{
    list-style: none;
    cursor: pointer;
    user-select: none;
  }
  .keyboard{
    width:1110px;
    height: 0;
    overflow: hidden;
    background: #2C2B31;
    position:relative;
    // .keyboard-output{
    //   width: 100%;
    //   height: 86px;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   .edit{
    //     width: 290px;
    //     min-height: 46px;
    //     text-align: center;
    //     background: #FBFDFF;
    //     border-radius: 4px;
    //     font-size: 24px;
    //     color: #2E2E2E;
    //     line-height: 46px;
    //   }
    // }
    .keyboard-panel{
      width: 100%;
      height: 231px;
      .keyboard-panel-default{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 20px 63px;
        position: relative;
        display: flex;
        align-items: center;
        .keyboard-default-num,.keyboard-default-sym{
          width: 365px;
          height: 156px;
          ul{
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            li{
              width: 63px;
              height: 58px;
              margin: 10px 5px;
              background: #6C6B6D;
              box-shadow: 0 1px 0 0 rgba(0,0,0,0.50);
              border-radius: 8.5px;
              font-size: 30px;
              color: #FFFFFF;
              line-height: 58px;
              text-align: center;
            }
          }
        }
        .keyboard-default-feature{
          width: 130px;
          height: 156px;
          ul{
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            li{
              width: 120px;
              height: 58px;
              margin: 10px 5px;
              background: #A6ABB6;
              border-radius: 8.5px;
              font-size: 23px;
              color: #FFFFFF;
              line-height: 58px;
              text-align: center;
            }
          }
        }
        .keyboard-default-submit{
          display: flex;
          align-items: center;
          padding-left: 30px;
          padding-top: 18px;
          .submit-btn{
            cursor: pointer;
            width: 92px;
            height: 188px;
            background: #32C060;
            border-radius: 11px;
            color: #fff;
            font-size: 44px;
            line-height: 188px;
            text-align: center;
          }
        }
      }
    }
  }
  .keyboardup{
    height: auto;
  }
</style>