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
//必须引入的核心，换成require也是一样的。注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也许可自行调整相关源码清除全局污染
// import Recorder from 'recorder-core'

// //需要使用到的音频格式编码引擎的js文件统统加载进来
// import 'recorder-core/src/engine/mp3'
// import 'recorder-core/src/engine/mp3-engine'
// //可选的扩展支持项 
// import 'recorder-core/src/extensions/waveview' // 动态波形显示
// import 'recorder-core/src/extensions/frequency.histogram.view' // 频率直方图显示
// import 'recorder-core/src/extensions/lib.fft.js'
// import 'recorder-core/src/extensions/wavesurfer.view' // 音频可视化波形显示
export default {
  name: 'soundWave',
  data () {
    return {
      waveConfigs: {
        WaveView: [
          {
            testTitle: "颜色",
            linear1: [0, "#0b1", 1, "#0b1"],
            linear2: [0, "#0b1", 1, "#0b1"],
            linearBg: [0, "gold", 1, "#0b1"]
          }
        ],
        WaveSurferView: [
          {
            testTitle: "底部显示+慢速",
            position: -1,
            duration: 10000,
            linear: [0, "#666", 1, "#666"]
          },
          {
            testTitle: "由右到左+快速",
            direction: -1,
            duration: 1000,
            linear: [0, "#f00", 1, "#f00"]
          }
        ],
        FrequencyHistogramView: [
          {
            testTitle: "中部显示",
            lineCount: 70,
            position: 0,
            minHeight: 1,
            stripeEnable: false,
            linear: [0, "#06c", 1, "#06c"]
          },
          {
            testTitle: "粗大",
            lineCount: 15,
            spaceWidth: 1.5,
            stripeEnable: false,
            linear: [0, "#ab00ff", 1, "#ab00ff"]
          },
          {
            testTitle: "镜像",
            lineCount: 15,
            position: 0,
            minHeight: 1,
            fallDuration: 400,
            stripeEnable: false,
            mirrorEnable: true
          },
          {
            testTitle: "稀疏镜像",
            lineCount: 8,
            position: 0,
            minHeight: 1,
            fallDuration: 400,
            stripeEnable: false,
            mirrorEnable: true,
            linear: [0, "#0ac", 1, "#0ac"]
          },
          {
            testTitle: "顶部显示+粗大",
            lineCount: 15,
            position: 1,
            spaceWidth: 1.5,
            stripeEnable: false,
            linear: [0, "#ab00ff", 1, "#ab00ff"]
          }
        ]
      },
      rec: null,
      wave: null
    }
  },
  methods: {
    // 打开录音 请求录音权限
    recOpen () {
      this.rec = null;
      // this.wave = null;
      var wave
      var newRec = Recorder({
        type: "mp3", sampleRate: 16000, bitRate: 16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
        , onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
          //录音实时回调，大约1秒调用12次本回调
          document.querySelector(".recpowerx").style.width = powerLevel + "%";
          document.querySelector(".recpowert").innerText = bufferDuration + " / " + powerLevel;

          //可视化图形绘制
          wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
        }
      });
      // createDelayDialog(); //我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
      newRec.open(() => {//打开麦克风授权获得相关资源
        // dialogCancel(); //如果开启了弹框，此处需要取消

        this.rec = newRec;
        //此处创建这些音频可视化图形绘制浏览器支持妥妥的
        wave = Recorder.FrequencyHistogramView({ elem: ".recwave", position: 0, minHeight: 2, mirrorEnable: true, stripeEnable: false });

        console.log("已打开录音，可以点击录制开始录音了", 2);
      }, function (msg, isUserNotAllow) {//用户拒绝未授权或不支持
        // dialogCancel(); //如果开启了弹框，此处需要取消
        console.log((isUserNotAllow ? "UserNotAllow，" : "") + "打开录音失败：" + msg, 1);
      });

      window.waitDialogClick = function () {
        // dialogCancel();
        console.log("打开失败：权限请求被忽略，<span style='color:#f00'>用户主动点击的弹窗</span>", 1);
      };
    },
    recClose () {
      if (this.rec) {
        this.rec.close();
      }
    },
    recStart () {//打开了录音后才能进行start、stop调用
      if (this.rec && Recorder.IsOpen()) {
        this.rec.start();
      }
    },
    recStop () {
      if (!(this.rec && Recorder.IsOpen())) {
        return;
      };
      this.rec.stop(function (blob, duration) {
        console.log(blob, (window.URL || webkitURL).createObjectURL(blob), "时长:" + duration + "ms");
        console.log("已录制mp3：" + duration + "ms " + blob.size + "字节，可以点击播放、上传了", 2);
      }, function (msg) {
        console.log("录音失败:" + msg, 1);
      })
    },
    recPause () {
      if (this.rec && Recorder.IsOpen()) {
        this.rec.pause();
      } else {
        console.log("未打开录音", 1);
      };
    },
    recResume () {
      if (this.rec && Recorder.IsOpen()) {
        this.rec.resume();
      } else {
        console.log("未打开录音", 1);
      }
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