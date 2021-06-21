<template>
  <div class="main">
    <div class="mainBox">
      <!-- 按钮控制区域 -->
      <div class="pd btns">
        <div>
          <button @click="recOpen"
                  style="margin-right:10px">打开录音,请求权限</button>
          <button @click="recClose"
                  style="margin-right:0">关闭录音,释放资源</button>
        </div>
        <button @click="recStart">录制</button>
        <button @click="recStop"
                style="margin-right:80px">停止</button>
        <span style="display: inline-block;">
          <button @click="recPause">暂停</button>
          <button @click="recResume">继续</button>
        </span>
        <span style="display: inline-block;">
          <!-- <button @click="recPlay">播放</button>
          <button @click="recUpload">上传</button> -->
        </span>
      </div>
      <!-- 波形绘制区域 -->
      <div class="pd recpower">
        <div style="height:40px;width:300px;background:#999;position:relative;">
          <div class="recpowerx"
               style="height:40px;background:#0B1;position:absolute;"></div>
          <div class="recpowert"
               style="padding-left:50px; line-height:40px; position: relative;"></div>
        </div>
      </div>
      <div class="pd waveBox">
        <div style="border:1px solid #ccc;display:inline-block">
          <div style="height:100px;width:300px;"
               class="recwave"></div>
        </div>
      </div>
    </div>
    <!-- 日志输出区域 -->
    <!-- <div class="mainBox">
      <div class="console.log"></div>
    </div> -->
  </div>
</template>
<script>
import HZRecorder from '../js/record';
export default {
  name: 'soundWave',
  data () {
    return {
    }
  },
  methods: {
    // 打开录音 请求录音权限
    recOpen () {
      const config = {
        wavSet:{
          elem:".recwave", //自动显示到dom，并以此dom大小为显示大小
              //或者配置显示大小，手动把waveviewObj.elem显示到别的地方
          // ,width:0 //显示宽度
          // ,height:0 //显示高度
          
          //以上配置二选一
          
          scale:2, //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊
          speed:10, //移动速度系数，越大越快
          lineWidth:9, //线条基础粗细        
          //渐变色配置：[位置，css颜色，...] 位置: 取值0.0-1.0之间
          linear1:[0,"rgba(150,96,238,1)",0.2,"rgba(170,79,249,1)",1,"rgba(53,199,253,1)"], //线条渐变色1，从左到右
          linear2:[0,"rgba(209,130,255,0.6)",1,"rgba(53,199,255,0.6)"], //线条渐变色2，从左到右
          linearBg:[0,"rgba(255,255,255,0.2)",1,"rgba(54,197,252,0.2)"], //背景渐变色，从上到下
        },
        freSet:{
          elem:".recwave", //自动显示到dom，并以此dom大小为显示大小
              //或者配置显示大小，手动把waveviewObj.elem显示到别的地方
          // ,width:0 //显示宽度
          // ,height:0 //显示高度
          lineCount: 5,
          //以上配置二选一
          //当发生绘制时会回调此方法，参数为当前绘制的频率数据和采样率，可实现多个直方图同时绘制，只消耗一个input输入和计算时间
          // onDraw:function(frequencyData,sampleRate){}
        }
      }
      HZRecorder.recInt(config).then(() => {
        alert('请求成功')
      }).catch((error) => {
        console.error(error)
      })
    },
    recClose () {
      HZRecorder.recClose();
    },
    recStart () {
      HZRecorder.recStart();
    },
    recStop () {
      HZRecorder.recStop();
    },
    recPause () {
      HZRecorder.recPause();
    },
    recResume () {
      HZRecorder.recResume();
    }
  }
}
</script>
<style lang="less" scoped>
body {
  word-wrap: break-word;
  background: #f5f5f5 center top no-repeat;
  background-size: auto 680px;
}
pre {
  white-space: pre-wrap;
}
a {
  text-decoration: none;
  color: #06c;
}
a:hover {
  color: #f00;
}
.main {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 80px;
}
.mainBox {
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  background: #fff;
  --border: 1px solid #f60;
  box-shadow: 2px 2px 3px #aaa;
}
.btns button {
  display: inline-block;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  background: #f60;
  color: #fff;
  padding: 0 15px;
  margin: 3px 20px 3px 0;
  line-height: 36px;
  height: 36px;
  overflow: hidden;
  vertical-align: middle;
}
.btns button:active {
  background: #f00;
}
.pd {
  padding: 0 0 6px 0;
}
.lb {
  display: inline-block;
  vertical-align: middle;
  background: #00940e;
  color: #fff;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 99px;
}
</style>