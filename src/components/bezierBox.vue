<template>
  <!-- 贝塞尔运动的容器 里面可以放自定义的图片啥的 -->
  <div id="bezierBox"
       v-show="isBezierAni">
    <img id="moveMain"
         ref="moveMain">
    <div class="guijiPoints"
         v-show="isShowGuiJi"
         v-for="(item,index) in guijipoints"
         :key="index"
         :style="item | guijiFilter"></div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
export default {
  //参考博客 https://www.cnblogs.com/lxiang/p/4995255.html
  name: 'bezier',//贝塞尔曲线路径动画
  data () {
    return {
      isBezierAni: false,
      demo: [{ x: 10, y: 200 }, { x: 190, y: 10 }, { x: 300, y: 400 }],
      guijipoints: [],
      isShowGuiJi: true,//是否显示路径
      bInter: null,
      bezierPointsData: null
    }
  },
  props: {
    bezierObj: {

    }
  },
  computed: {
    // ...mapGetters({
    //   bezierPointsData: 'getBezierPointsData'
    // })
  },
  filters: {
    guijiFilter (val) {
      return `left:${val.x}px;
                    top:${val.y}px;`
    }
  },
  methods: {
    /**
     * 绘制贝塞尔曲线的路径点
     * @param {array} anchorpoints 基点  控制贝塞尔曲线的基础的几个点，决定了路径的运动方向与曲线 [{x:0,y:0},{x:150,y:120},{x:300,y:240}]
     * @param {num} pointsAmount 生成点的个数  这里的个数决定了物体运动的速度原因之一（另一个是计时器的频率）
     * @return {array} points 返回生成路径点[{x:0,y:0},{x:10,y:5},...{x:300,y:240}]
     */
    createBezierPoints (anchorpoints, pointsAmount) {
      var points = [];
      for (var i = 0; i < pointsAmount; i++) {
        var point = this.multiPointBezier(anchorpoints, i / pointsAmount);
        points.push(point);
      }
      return points;
    },
    multiPointBezier (points, t) {
      var len = points.length;
      var x = 0, y = 0;
      var erxiangshi = function (start, end) {
        var cs = 1, bcs = 1;
        while (end > 0) {
          cs *= start;
          bcs *= end;
          start--;
          end--;
        }
        return (cs / bcs);
      };
      for (var i = 0; i < len; i++) {
        var point = points[i];
        x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
        y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
      }
      return { x: x, y: y };
    },
    //开始生成点和点的样式位置 执行曲线动画
    doBezierAni (pointsArr) {
      //定义17s帧率刷新 完成36个点 时长为600ms左右
      var index = 0;
      this.guijipoints = this.createBezierPoints(pointsArr, 36);
      this.clearBInter();
      this.bInter = setInterval(() => {
        var x = this.guijipoints[index].x - 20; //减去100像素图片的一半大小 让其居中
        var y = this.guijipoints[index].y - 20;
        this.$refs.moveMain.style.cssText = `left:${x}px;top:${y}px`;
        index++;
        if (index >= this.guijipoints.length) {
          this.clearBInter();
          setTimeout(() => {
            //初始化坐标数据
            // this.$store.dispatch('setBezierPointsData', { type: 0 });
          }, 300);
        }
      }, 17);
    },
    //初始化坐标点(需要的基点); type几种路径类型
    initCoordinate (type) {
      var basePoints = [];
      var start = {}, mid = {}, end = {};
      switch (type) {
        case 1://正常模式-辅导老师送自己
          //获取开始坐标
          start.x = this.getElementLeft(document.getElementById('start'));
          start.y = this.getElementTop(document.getElementById('start'));
          //获取结束坐标
          end.x = this.getElementLeft(document.getElementById('end')) + 250;
          end.y = this.getElementTop(document.getElementById('end')) + 50;
          //自定义计算中间基点坐标(取这个点，基于开始和结束两点之间画三角形)
          mid.x = start.x + 100;
          mid.y = start.y + Math.round((end.y - start.y) / 3);
          break;
        case 2://上台发言模式-辅导老师送自己

          break;
        case 3://题板位置飞到排行榜位置
          start.x = Math.round(document.getElementById('PAGE_COURSE_LEFT').offsetWidth * .85);
          start.y = Math.round(document.getElementById('PAGE_COURSE_LEFT').offsetHeight - 100);
          end.x = start.x;
          end.y = 100;
          mid.x = Math.round(document.getElementById('PAGE_COURSE_LEFT').offsetWidth) + 50;
          mid.y = Math.round(document.getElementById('PAGE_COURSE_LEFT').offsetHeight / 2 + 80);
          break;
        case 4://排行榜位置飞到小组信息区位置
          start.x = Math.round(document.getElementById('PAGE_COURSE_LEFT').offsetWidth * .85);
          start.y = 100;
          end.x = this.getElementLeft(document.getElementById('awardBox'));
          end.y = this.getElementTop(document.getElementById('awardBox'));
          mid.x = start.x + 140;
          mid.y = -50;
          break;
        default:
          break;
      }
      basePoints.push(start, mid, end);
      this.doBezierAni(basePoints);
    },
    getElementLeft (element) {
      var actualLeft = element.offsetLeft;
      var current = element.offsetParent;
      while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
      }
      return actualLeft;
    },
    getElementTop (element) {
      var actualTop = element.offsetTop;
      var current = element.offsetParent;
      while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
    },
    clearBInter () {
      if (this.bInter) {
        clearInterval(this.bInter);
        this.bInter = null;
        this.$refs.moveMain.style.cssText = `left:${-100}px;top:${-100}px`;
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.bezierPointsData = { type: 1 }
      // this.$store.dispatch('setBezierPointsData', {
      //   type: 1,
      // });
    }, 2000);
  },
  watch: {
    bezierPointsData (val) {
      if (val.type > 0) {
        //自定义的基点坐标（如：上台发言-辅导送其他同学）
        if (val.type == 99) {
          this.doBezierAni(val.bezierPointsArr);
        } else {
          //固定类型的基点坐标
          this.initCoordinate(val.type);
        }
        this.isBezierAni = true;
      } else {
        this.isBezierAni = false;
      }
    }
  }
}
</script>
<style lang="less">
#bezierBox {
  position: relative;
  z-index: 99;
  #moveMain {
    position: absolute;
    width: 40px;
    height: 40px;
    background: yellow;
    animation: rotate 0.1s linear infinite;
  }
  .guijiPoints {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #13f3ce;
    border-radius: 2px;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

