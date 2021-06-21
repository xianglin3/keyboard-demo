// 必须引入的核心，换成require也是一样的。
// 注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也可自行调整相关源码清除全局污染
import Recorder from 'recorder-core';

// 需要使用到的音频格式编码引擎的js文件统统加载进来
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

// 以上三个也可以合并使用压缩好的recorder.xxx.min.js
// 比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持

// 可选的扩展支持项
import 'recorder-core/src/extensions/waveview';

var event = {};
const EventType = {
  'RECORD_INIT_COMPLETE': 'RECORD_INIT_COMPLETE',//录音实例化完毕
  'BEFORE_STOP_RECORD': 'BEFORE_STOP_RECORD', //预结束
  'START_RECORD': 'START_RECORD',//开始录音-录音器使用中
  'STOP_RECORD': 'STOP_RECORD', //结束录音-录音器没有使用
  'KEEP_SPEAKING': 'KEEP_SPEAKING', //持续说话中
  'KEEP_SLIENCE': 'KEEP_SLIENCE', // 一直没有说话
  'GET_VOL_DATA': 'GET_VOL_DATA',  //获取说话音量 用于绘制图形
  'CLEARANCE_RECORD': 'CLEARANCE_RECORD',//间歇性说话
  'EQUIPMENT_ERROR': 'EQUIPMENT_ERROR',//录音设备异常
}
var rec;//音频环境实例
var drawVisual;  //帧动画返回值;
var muteDataCount = 0; //一段数据频率内没有说话次数统计
var speakDataCount = 0;//一段数据频率内开口说话次数统计
var isSpeakmark = false; //是否开口说话标识 默认没有开口过
window.silentStutus = true;//是否持续不说话的标识符
window.URL = window.URL || window.webkitURL;
var HZRecorder = function (stream, config) {
  config = config || {};
  config.sampleBits = config.sampleBits || 16;//采样数位 8, 16
  // config.sampleRate = config.sampleRate || (44100/6);//采样率(1/6 44100)
  config.sampleRate = config.sampleRate || (16000);//此采样率在微端是正常的
  var context = new (window.webkitAudioContext || window.AudioContext)(); //创建一个音频环境
  var audioInput = context.createMediaStreamSource(stream); //获取音频源
  var analyser = context.createAnalyser(); //音频分析器  用于可视化
  var createScript = context.createScriptProcessor || context.createJavaScriptNode;//获取 可以用js操作的节点
  var recorder = createScript.apply(context, [4096, 1, 1]);  //[单位内数据块大小(2n次方 越大下面监听中一个周期越长) 单声道输入、输出]

  //监听一段过程中的声音输入数据的大小 如果保持一段固定且不大的频率数据 则判定为停止说话
  recorder.onaudioprocess = function (e) {
    var data = e.inputBuffer.getChannelData(0); //获取数据化的音频
    var l = Math.floor(data.length / 10);//按照每段/10 精简循环抓取数据
    var vol = 0; //模拟音量
    for (var i = 0; i < l; i++) {
      vol += Math.abs(data[i * 10]);
    }
    vol = Math.round(vol + 1);
    // console.log('vol----', vol)
    dispatchEvent('GET_VOL_DATA', vol);
    if (isSpeakmark) {
      if (vol < 10) {
        //统计并判断静音次数
        muteDataCount++;
        if (muteDataCount > 20) { //监听频率大概为10次1s
          // window.silentStutus = true
          window.silentStutus = false
          dispatchEvent('BEFORE_STOP_RECORD');
          dispatchEvent("CLEARANCE_RECORD");
          muteDataCount = 0;
        }
      } else {
        window.silentStutus = false
        speakDataCount++;
        if (speakDataCount > 3) {
          dispatchEvent('KEEP_SPEAKING');
          speakDataCount = 0;
          muteDataCount = 0;
        }
      }
    } else {
      if (vol > 10) {
        speakDataCount++;
        if (speakDataCount > 5) { //开口说话大于10音量 持续0.5秒 记为有效开口
          isSpeakmark = true;
          speakDataCount = 0;
        }
      }
      dispatchEvent('KEEP_SLIENCE');
    }

    audioData.input(e.inputBuffer.getChannelData(0));
  };
  //录音配置对象
  var audioData = {
    size: 0          //录音文件长度
    , buffer: []     //录音缓存
    , inputSampleRate: context.sampleRate   //输入采样率
    , inputSampleBits: 16       //输入采样数位 8, 16
    , outputSampleRate: config.sampleRate    //输出采样率
    , oututSampleBits: config.sampleBits       //输出采样数位 8, 16
    , input: function (data) {
      this.buffer.push(new Float32Array(data));
      this.size += data.length;
    }
    , compress: function () { //合并压缩
      //合并
      var data = new Float32Array(this.size);
      var offset = 0;
      for (var i = 0; i < this.buffer.length; i++) {
        data.set(this.buffer[i], offset);
        offset += this.buffer[i].length;
      }
      //压缩
      var compression = parseInt(this.inputSampleRate / this.outputSampleRate) || 1;
      var length = data.length / compression;
      var result = new Float32Array(length);
      var index = 0, j = 0;
      while (index < length) {
        result[index] = data[j];
        j += compression;
        index++;
      }
      return result;
    }
    , encodeWAV: function () {
      var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
      var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
      var bytes = this.compress();
      var dataLength = bytes.length * (sampleBits / 8);
      var buffer = new ArrayBuffer(44 + dataLength);
      var data = new DataView(buffer);

      var channelCount = 1;//单声道
      var offset = 0;

      var writeString = function (str) {
        for (var i = 0; i < str.length; i++) {
          data.setUint8(offset + i, str.charCodeAt(i));
        }
      }

      // 资源交换文件标识符
      writeString('RIFF');
      offset += 4;
      // 下个地址开始到文件尾总字节数,即文件大小-8
      data.setUint32(offset, 36 + dataLength, true);
      offset += 4;
      // WAV文件标志
      writeString('WAVE');
      offset += 4;
      // 波形格式标志
      writeString('fmt ');
      offset += 4;
      // 过滤字节,一般为 0x10 = 16
      data.setUint32(offset, 16, true);
      offset += 4;
      // 格式类别 (PCM形式采样数据)
      data.setUint16(offset, 1, true);
      offset += 2;
      // 通道数
      data.setUint16(offset, channelCount, true);
      offset += 2;
      // 采样率,每秒样本数,表示每个通道的播放速度
      data.setUint32(offset, sampleRate, true);
      offset += 4;
      // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
      offset += 4;
      // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
      data.setUint16(offset, channelCount * (sampleBits / 8), true);
      offset += 2;
      // 每样本数据位数
      data.setUint16(offset, sampleBits, true);
      offset += 2;
      // 数据标识符
      writeString('data');
      offset += 4;
      // 采样数据总数,即数据总大小-44
      data.setUint32(offset, dataLength, true);
      offset += 4;
      // 写入采样数据
      if (sampleBits === 8) {
        for (var i = 0; i < bytes.length; i++ , offset++) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
          val = parseInt(255 / (65535 / (val + 32768)));
          data.setInt8(offset, val, true);
        }
      } else {
        for (var i = 0; i < bytes.length; i++ , offset += 2) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
      }
      return new Blob([data], { type: 'audio/wav' });
    }
  };
  this.getAduioWaves = function (configs) {
    var defaultConfig = {
      canvasDomId: "audioWaves",//canvas元素id
      // bgColor:"#092A54",//canvas元素背景
      gap: 6.5,//每条线之间的间隔 根据当前需要展示的大小 自行调试
      startX: 30,//启示位置
      lineWidth: 5,//线条宽度
    };
    var configParams = Object.assign(defaultConfig, configs);
    audioInput.connect(analyser); //将流连接到分析器
    analyser.fftSize = 256;//2的n次方大小 傅里叶变换 相当于指定分析量的大小 越大则频谱呈现出来越密集
    var bufferLength = analyser.frequencyBinCount;//frequencyBinCount的值固定为fftSize值的一半,该属性通常用于可视化的数据值的数量.
    var dataArray = new Uint8Array(bufferLength);//无符号数组用于保存getByteFrequencyData返回的频域数据

    //每个音波长度基数
    var leftArr = [4, 4, 22, 4, 16, 40, 16, 4, 4, 42, 62];
    if (configParams.leftArr && configParams.leftArr.length != 0) leftArr = configParams.leftArr;
    var mid = 80;
    if (configParams.mid) mid = configParams.mid;
    var rightArr = [62, 42, 4, 4, 16, 40, 16, 4, 22, 4, 4];
    if (configParams.rightArr && configParams.rightArr.length != 0) rightArr = configParams.rightArr;
    var canvas = document.getElementById(configParams.canvasDomId);
    let dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1;
    var ctx = makeHighRes(canvas, dpr);
    var cw = canvas.width;
    var ch = canvas.height;
    var draw = function () {
      drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      //排序每个频域内的音频数据 由大到小
      dataArray.sort((a, b) => {
        return b - a
      });

      var vol = dataArray[6];//获取每段内的最大音量
      if (vol < 20) {//音量为0~255左右 比上200 让它变为系数  
        vol += 20;
      }
      vol /= 200;
      var x = configParams.startX;//画布起点x

      //拼接 整理 上面三个配置好的基数数组 返回计算出来的绘制长度Y值
      var newArr = leftArr.concat(mid, rightArr);
      newArr = newArr.map((item, index) => {
        item = item * 0.6; //让基数稍微小一点
        if (index == 8 || index == 14) {
          return 10 / vol * 0.25 //指定两个对称点 在音量低的时候想对变高一点
        }
        return item * vol;
      });

      if (configParams.bgColor) {
        ctx.fillStyle = configParams.bgColor;
      } else {
        //默认渐变色背景
        var my_gradient = ctx.createLinearGradient(0, 0, 0, 80);
        my_gradient.addColorStop(0, "rgb(110,22,186)");
        my_gradient.addColorStop(1, "rgb(108,21,181)");
        ctx.fillStyle = my_gradient;
      }
      if (configParams.bgColor) ctx.fillStyle = configParams.bgColor;
      ctx.fillRect(0, 0, cw, ch);
      for (var i = 0; i < newArr.length; i++) {
        // x+=12;//线条之间的间隔
        var moveY = (ch - newArr[i] * dpr) / 2; //每个条起始Y轴位置
        var toY = moveY + newArr[i] * dpr; //每个条绘制终点Y轴位置
        // ctx.globalAlpha = 0.7;//透明度
        var colorR = 33 + (5 * i);
        var colorG = 238 - (4 * i);//渐变色green值
        var colorB = 224 + (1 * i);//渐变色blue值
        //ctx.strokeStyle = `rgb(55,${colorG},${colorB})`;
        ctx.strokeStyle = `rgb(${colorR},${colorG},${colorB})`;

        //开始绘制
        ctx.beginPath();
        ctx.moveTo(x, (moveY / dpr));
        ctx.lineTo(x, (toY / dpr));
        ctx.lineCap = "round";
        ctx.lineWidth = configParams.lineWidth;
        ctx.stroke();
        x += (configParams.gap + 6);//线条之间的间隔再加上本身的宽度
      }
    }
    draw();
  }
  // 解决高清屏幕下canvas图片模糊问题
  function makeHighRes(canvas, dpr) {
    let ctx = canvas.getContext('2d');
    let oldWidth = canvas.clientWidth;
    let oldHeight = canvas.clientHeight;
    canvas.width = Math.round(oldWidth * dpr);
    canvas.height = Math.round(oldHeight * dpr);
    ctx.scale(dpr, dpr);
    return ctx;
  }
  //开始录音
  this.start = function () {
    dispatchEvent('START_RECORD');
    audioInput.connect(recorder); //流连接到录音节点
    recorder.connect(context.destination); //最后将录音节点连接到输出点 最后播放用
    dispatchEvent('RECORD_INIT_COMPLETE');
  }

  //停止
  this.stop = function () {
    dispatchEvent('STOP_RECORD');
    recorder.disconnect();
    cancelAnimationFrame(drawVisual);
  }

  //获取录音后的本地文件 blob对象
  this.getBlob = function () {
    this.stop();
    return audioData.encodeWAV();
  }

  // 获取本地音频录音地址
  this.getAudioSrc = function (file) {
    if (file) {
      return window.URL.createObjectURL(file);
    }
    return window.URL.createObjectURL(this.getBlob());

  }

};
//抛出异常
HZRecorder.throwError = function (message) {
  dispatchEvent('EQUIPMENT_ERROR');
  throw new function () {
    this.toString = function () {
      return message;
    }
  }
}
/**
 * 检查并初始化调用媒体录音
 * @param {boolean} isCheck 是否是检查当前录音是否可用
 * @param {object} config 实例化录音器想配置的参数 目前不需要 采用构造函数内部默认值即可
 */
HZRecorder.get = function (isCheck = false, config, callback) {
  return new Promise((resolve, reject) => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          if (isCheck) {
            resolve();
          } else {
            rec = new HZRecorder(stream, config);
            rec.start();
            isSpeakmark = false;
            // callback && callback(rec);
          }
        }).catch((error) => {
          if (isCheck) {
            reject(error);
          } else {
            switch (error.code || error.name) {
              case 'PERMISSION_DENIED':
              case 'PermissionDeniedError':
                HZRecorder.throwError('用户拒绝提供信息。');
                break;
              case 'NOT_SUPPORTED_ERROR':
              case 'NotSupportedError':
                HZRecorder.throwError('浏览器不支持硬件设备。');
                break;
              case 'MANDATORY_UNSATISFIED_ERROR':
              case 'MandatoryUnsatisfiedError':
                HZRecorder.throwError('无法发现指定的硬件设备。');
                break;
              default:
                HZRecorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                break;
            }
          }
        });
    } else {
      if (isCheck) {
        let err = { code: 'errorGetUserMedia' }
        reject(err);
      } else {
        HZRecorder.throwErr('当前浏览器不支持录音功能。');
      }
    }
  })
}

/**
 * 检查是录音环境否可用
 * @return {Promise} 返回一个Promise对象
 */
const checkinit = () => {
  return HZRecorder.get(true);
}
/**
 * 开始录音
 */
const start = () => {
  //实例化录音器后 接收异步回调 然后执行实例方法  开始录音
  HZRecorder.get();
}
/**
 * 直接调用开始录音方法 这个不会重新初始化录音实例 所以还会接着上次录音的片段继续录
 */
const startAgain = () => {
  return rec.start();
}
/**
 * 停止录音获取录音文件 导出录音完成后的音频文件
 */
const getFile = () => {
  return rec.getBlob();
}
/**
 * 导出录音本地地址
 * @param {object} blobFile 此对象应该传blob文件 是你需要提取src的文件
 * 不传此参数 停止录音获取录音文件 默认返回当前录音的src
 */
const getAudioSrc = (blobFile) => {
  return rec.getAudioSrc(blobFile);
}
/**
 * 需要绘制波形的话 等待start实例完毕后 监听RECORD_INIT_COMPLETE 然后调用此方法
 */
const getAduioWaves = (configObj) => {
  return rec.getAduioWaves(configObj);
}

/**
 * 自定义事件监听 抛出到业务层使用
 * @param {string} type 事件类型
 * @param {function} callBack 事件回调
 */
const addEventListener = (type, callBack) => {
  if (!event.handlers) {
    Object.defineProperty(event, "handlers", {
      value: {},
      enumerable: false,
      configurable: true,
      writable: true
    })
  }
  if (!event.handlers[type]) {
    event.handlers[type] = [];
  }
  event.handlers[type].push(callBack);
};

//移除监听
function removeEventListener(type) {
  if (event.handlers) {
    if (event.handlers.hasOwnProperty(type)) {
      event.handlers[type] = [];
    }
  }
}

/**
 * 触发事件监听
 * @param {string} type 事件类型
 * @param {object} param 触发事件附带参数
 */
const dispatchEvent = (type, param) => {
  if (event.handlers) {
    if (event.handlers.hasOwnProperty(type)) {
      for (var i = 0; i < event.handlers[type].length; i++) {
        if (param) {
          event.handlers[type][i](param);
        } else {
          event.handlers[type][i]();
        }
      }
    }
  }
}

export default {
  EventType,
  checkinit,
  start,
  startAgain,
  getFile,
  getAudioSrc,
  addEventListener,
  removeEventListener,
  getAduioWaves
}