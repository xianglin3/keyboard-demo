// recorder-core文档地址：https://github.com/xiangyuecn/Recorder
// 注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也可自行调整相关源码清除全局污染
import Recorder from 'recorder-core';

// 需要使用到的音频格式编码引擎的js文件统统加载进来
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

// 以上三个也可以合并使用压缩好的recorder.xxx.min.js
// 比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持

// 可选的扩展支持项---按需引入
// 波形音量图
// import 'recorder-core/src/extensions/waveview';
// 柱形音量图
import 'recorder-core/src/extensions/lib.fft';
import 'recorder-core/src/extensions/frequency.histogram.view';

window.URL = window.URL || window.webkitURL;
const waveDefaultConfig = {
  freConfig: {
    scale:2, //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊
    fps:20, //绘制帧率，不可过高
    
    lineCount:30, //直方图柱子数量，数量的多少对性能影响不大，密集运算集中在FFT算法中
    widthRatio:0.6, //柱子线条宽度占比，为所有柱子占用整个视图宽度的比例，剩下的空白区域均匀插入柱子中间；默认值也基本相当于一根柱子占0.6，一根空白占0.4；设为1不留空白，当视图不足容下所有柱子时也不留空白
    spaceWidth:0, //柱子间空白固定基础宽度，柱子宽度自适应，当不为0时widthRatio无效，当视图不足容下所有柱子时将不会留空白，允许为负数，让柱子发生重叠
    minHeight:2, //柱子保留基础高度，position不为±1时应该保留点高度
    position:0, //绘制位置，取值-1到1，-1为最底下，0为中间，1为最顶上，小数为百分比
    mirrorEnable:true, //是否启用镜像，如果启用，视图宽度会分成左右两块，右边这块进行绘制，左边这块进行镜像（以中间这根柱子的中心进行镜像）
    
    stripeEnable:false, //是否启用柱子顶上的峰值小横条，position不是-1时应当关闭，否则会很丑
    stripeHeight:3, //峰值小横条基础高度
    stripeMargin:6, //峰值小横条和柱子保持的基础距离
    
    fallDuration:1000, //柱子从最顶上下降到最底部最长时间ms
    stripeFallDuration:3500, //峰值小横条从最顶上下降到底部最长时间ms
    
    //柱子颜色配置：[位置，css颜色，...] 位置: 取值0.0-1.0之间
    linear:[0,"rgba(0,187,17,1)",0.5,"rgba(255,215,0,1)",1,"rgba(255,102,0,1)"],
    //峰值小横条渐变颜色配置，取值格式和linear一致，留空为柱子的渐变颜色
    stripeLinear:null,
    
    shadowBlur:0, //柱子阴影基础大小，设为0不显示阴影，如果柱子数量太多时请勿开启，非常影响性能
    shadowColor:"#bbb", //柱子阴影颜色
    stripeShadowBlur:-1, //峰值小横条阴影基础大小，设为0不显示阴影，-1为柱子的大小，如果柱子数量太多时请勿开启，非常影响性能
    stripeShadowColor:"", //峰值小横条阴影颜色，留空为柱子的阴影颜色
  }
}
let rec;
let wave;
// 初始化录音
function recInt(setConfig) {
  rec = Recorder(
    {
      type:"mp3",
      sampleRate:16000,
      bitRate:16, //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
      onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd){
          //录音实时回调，大约1秒调用12次本回调
          //可利用extensions/waveview.js扩展实时绘制波形
          wave.input(buffers[buffers.length-1],powerLevel,bufferSampleRate);//输入音频数据，更新显示波形
      }
    }
  )
  return new Promise((resolve,reject) => {
    if(Recorder.Support()){
      try{
        rec.open(
          () => {
            const configData = Object.assign(waveDefaultConfig.freConfig, setConfig.freSet);
            wave = Recorder.FrequencyHistogramView(configData);
            // 开启录音成功
            resolve();
          },
          (msg,isUserNotAllow) => {
            // 开启录音失败
            const des = (isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg;
            console.log(des);
            reject(des);
          }
        )
      } catch(error) {
        reject('无法录音');
      }
    } else {
      // 开启录音失败
      reject('不支持录音');
    }
  })
}
/**打开录音 **/
function recOpen(success,fail) {
  rec&&rec.open(success,fail);
}
/**开始录音**/
function recStart(){//打开了录音后才能进行start、stop调用
    rec&&rec.start();
};
// 暂停录音
function recPause() {
  rec&&rec.pause();
}
// 恢复继续录音
function recResume() {
  rec&&rec.resume();
}
/**结束录音**/
function recStop(){
  return new Promise((resolve,reject) => {
    try{
      rec.stop(
        (blob,duration) => {
          const wavUrl = window.URL.createObjectURL(blob)
          console.log(blob,window.URL.createObjectURL(blob),"时长:"+duration+"ms");
          rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
          rec=null;
          const resObj = {
            blob,
            wavUrl,
            duration
          }
          resolve(resObj);
        },
        (msg) => {
          console.log("录音失败:"+msg);
          rec.close();//可以通过stop方法的第3个参数来自动调用close
          rec=null;
          reject(msg)
        }
      );
    } catch(error) {
      rec&&rec.close();
      rec = null;
      reject(error)
    }
  })
};
// 关闭录音，清理资源
function recClose(success) {
  rec&&rec.close(success);
  rec = null;
}
// 是否支持录音
function isSupport() {
  return Recorder.Support();
}
// 判断是否已经打开了录音功能
function recIsOpen() {
  return Recorder.IsOpen();
}
// 销毁所持有的所有全局资源
function recDestroy() {
  Recorder.Destroy();
}
export default {
  recInt,
  recOpen,
  recStart,
  recStop,
  recClose,
  isSupport,
  recPause,
  recResume,
  recIsOpen,
  recDestroy,
}