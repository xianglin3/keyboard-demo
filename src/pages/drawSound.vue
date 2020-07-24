<template>
  <div class="draw-sound">
    <canvas id="audioWaves"
            style="width: 100px;height: 100px;"></canvas>
  </div>
</template>
<script>
export default {
  name: 'draw-sound',
  data () {
    return {
      vol: 0,
      timing: '', // 计时
    }
  },
  methods: {
    onvol (vol) {
      console.log('vol-num:', vol)
      this.drawSound(vol)
    },
    drawSound (vol) {
      var configParams = {
        canvasDomId: "audioWaves",//canvas元素id
        // bgColor: "#092A54",//canvas元素背景
        gap: 6.5,//每条线之间的间隔 根据当前需要展示的大小 自行调试
        startX: 30,//启示位置
        lineWidth: 5,//线条宽度
      };
      //每个音波长度基数
      var leftArr = [4, 4, 22, 4, 16, 40, 16, 4, 4, 42, 62];
      // if (configParams.leftArr && configParams.leftArr.length != 0) leftArr = configParams.leftArr;
      var mid = 80;
      // if (configParams.mid) mid = configParams.mid;
      var rightArr = [62, 42, 4, 4, 16, 40, 16, 4, 22, 4, 4];
      // if (configParams.rightArr && configParams.rightArr.length != 0) rightArr = configParams.rightArr;
      var canvas = document.getElementById(configParams.canvasDomId);
      var ctx = canvas.getContext("2d");
      var cw = canvas.width;
      var ch = canvas.height;

      if (vol < 20) {//音量为0~255左右 比上200 让它变为系数  
        vol += 20;
      }
      vol /= 200;
      var x = configParams.startX;//画布起点x

      //拼接 整理 上面三个配置好的基数数组 返回计算出来的绘制长度Y值
      var newArr = leftArr.concat(mid, rightArr);
      newArr = newArr.map((item, index) => {
        item = item * 0.9; //让基数稍微小一点
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
        var moveY = (ch - newArr[i]) / 2; //每个条起始Y轴位置
        var toY = moveY + newArr[i]; //每个条绘制终点Y轴位置
        // ctx.globalAlpha = 0.7;//透明度
        var colorR = 33 + (5 * i);
        var colorG = 238 - (4 * i);//渐变色green值
        var colorB = 224 + (1 * i);//渐变色blue值
        //ctx.strokeStyle = `rgb(55,${colorG},${colorB})`;
        ctx.strokeStyle = `rgb(${colorR},${colorG},${colorB})`;

        //开始绘制
        ctx.beginPath();
        ctx.moveTo(x, moveY);
        ctx.lineTo(x, toY);
        ctx.lineCap = "round";
        ctx.lineWidth = configParams.lineWidth;
        ctx.stroke();
        x += (configParams.gap + 6);//线条之间的间隔再加上本身的宽度
      }
    }
  },
  watch: {
    vol: 'onvol'
  },
  mounted () {
    setInterval(() => {
      this.vol += 2
    }, 10)
  }
}
</script>
<style lang="less" scoped>
</style>