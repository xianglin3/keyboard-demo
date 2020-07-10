<template>
  <div class="cr"
       v-show="true">
    <div>order</div>
    <button @click='startCountTime'>开始轮播</button>
    id:<input type="text"
           v-model="callData.id">
    scale: <input type="text"
           v-model="callData.scale">
    x: <input type="text"
           v-model="callData.x">
    y: <input type="text"
           v-model="callData.y">
    <button @click="callYou">上台</button>
    <div class="show">
      <div class="box"
           id="box"
           :class="{moveBox: isMove}">
        <div v-for="(item, index) in imgList"
             :key="index"
             :class="`img${index}`"
             class="imgcont">
          <div :class="{animOpacity: isshow == `img${index}`}">
            <!-- :class="{'animOpacity': item.anim}" -->
            <!-- <img :src='item.src'
                 :alt="index"> -->
            <div class='imgele'>{{item.isCall ? '上台中' : item.id}}</div>
          </div>
        </div>
      </div>
      <div class="live-main">
        <div class="power-content">
          <div v-for="(item, index) in imgList"
               :key="index"
               :id="`dem${item.id}`"
               v-show="item.isCall"
               class="hide-call">
            {{item.id}}
          </div>
        </div>
      </div>
    </div>

    <!-- <h1 :class="{animOpacity: isshow}">渐隐渐现测试</h1> -->
    <!-- <div id="box" class="box" :class="{moveBox: isMove}" @click="transLeft"></div> -->

  </div>
</template>
<script>
import { TweenMax } from 'gsap'
export default {
  name: 'carouselSeatTransform',
  components: {
  },
  data () {
    return {
      imgList: [
        {
          isCall: false, // 是否上台
          id: 100, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 101, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 102, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 103, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 104, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 105, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 106, // 学员id
        },
        {
          isCall: false, // 是否上台
          id: 107, // 学员id
        },
      ],
      stuIndex: 0, // 座位席第一个学生的index
      carouselTimer: null, // 轮播计时器
      order: 1,
      isMove: false,
      carouselTime: 0, // 2min轮播一次
      countTime: 5,
      isshow: 'img',
      showStudentsNum: 5, // 座位席人数
      callData: {
        id: 100,
        scale: 1.2,
        x: 200,
        y: 200
      }
    }
  },
  methods: {
    callYou () {
      console.log('demo', this.callData)
      let onIndex = null
      this.imgList.forEach((item, index) => {
        if (this.callData.id == item.id) {
          onIndex = index
          item.isCall = true
        }
      })
      TweenMax.fromTo(`#dem${this.callData.id}`, 5, { x: this.filterSeatX(onIndex), y: -100, scale: 1 }, { x: Number(this.callData.x), y: Number(this.callData.y), scale: Number(this.callData.scale) });
    },
    filterSeatX (onIndex) {
      if (onIndex == this.stuIndex) return 0
      let numLength = this.imgList.length
      if (numLength - this.stuIndex >= this.showStudentsNum) {
        if (onIndex > this.stuIndex) {
          if (onIndex - this.stuIndex < this.showStudentsNum) return (onIndex - this.stuIndex) * 100
        }
        return this.showStudentsNum * 100
      } else {
        if (onIndex > this.stuIndex) return (onIndex - this.stuIndex) * 100
        let number = this.showStudentsNum - (numLength - this.stuIndex)
        if (onIndex + 1 <= number) {
          return (onIndex + (numLength - this.stuIndex)) * 100
        } else {
          return this.showStudentsNum * 100
        }
      }
    },
    transLeft () {
      this.isMove = true
    },
    setImgOrder (index, order) {
      let stuDom = document.getElementsByClassName(`img${index}`)
      stuDom[0].style.order = `${order}`
    },
    // 计时
    startCountTime () {
      this.clearTimer()
      this.carouselTimer = setInterval(() => {
        // 轮播时长
        if (this.carouselTime < this.countTime) {
          // 计时
          if (this.carouselTime === this.countTime - 1) {
            this.playAnim()
          }
          this.carouselTime++
        } else { // 轮播下一位学生
          this.resetAnim()
          if (this.stuIndex === 0) {
            this.order++
          }
          this.carouselTime = 0
          this.setImgOrder(this.stuIndex, this.order)
          if (this.stuIndex < 7) {
            this.stuIndex++ // 3s轮播一位学生
          } else {
            this.stuIndex = 0
          }
          console.log('第一个学生：', this.imgList[this.stuIndex].id)
        }
      }, 1000)
    },
    // 清除定时器
    clearTimer () {
      if (this.carouselTimer) {
        clearInterval(this.carouselTimer)
        this.carouselTimer = null
      }
    },
    // 是否播动画
    resetAnim () {
      this.isshow = `img`
      this.isMove = false
    },
    // 播动画
    playAnim () {
      this.isshow = `img${this.stuIndex}`
      this.isMove = true
    }
  },
  mounted () {
    this.resetAnim()
  }
}
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
.show {
  border: 5px solid #c1c1c1;
  margin: 100px auto;
  width: 500px;
  // height: 200px;
  overflow: hidden;
}
.box {
  width: 400%;
  height: 100px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  background-color: black;
}
.live-main {
  width: 500px;
  height: 400px;
  position: relative;
  background: burlywood;
  .power-content {
    position: absolute;
    top: 0;
    left: 0;
    .hide-call {
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      height: 100px;
      background: #ccc;
      text-align: center;
      line-height: 100px;
      color: #fff;
      font-size: 20px;
      box-sizing: border-box;
      border: 1px solid #fff;
    }
  }
}
ul {
  list-style-type: none;
}
.box ul li {
  float: left;
  /* display: block;  */
}
.imgcont {
  position: relative;
  width: 100px;
  order: 1;
}
img {
  width: 100px;
  height: 100px;
}
.imgele {
  width: 100px;
  height: 100px;
  background: #ccc;
  text-align: center;
  line-height: 100px;
  color: #fff;
  font-size: 20px;
  box-sizing: border-box;
  border: 1px solid #fff;
}
button {
  width: 100px;
  height: 50px;
  background-color: rgb(0, 118, 252);
  color: #ffffff;
  margin-bottom: 25px;
}
.animOpacity {
  animation: 1s opacity2 0s linear;
}
/* -webkit-animation: 2s opacity2 0.5s infinite;-moz-animation: 2s opacity2 0.5s infinite; */
@keyframes opacity2 {
  0% {
    opacity: 0.5;
  }
  25% {
    opacity: 0.1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
/* @-webkit-keyframes opacity2{
            0%{opacity:0}
            50%{opacity:.8;}
            100%{opacity:0;}
        }
        @-moz-keyframes opacity2{
            0%{opacity:0}
            50%{opacity:.8;}
            100%{opacity:0;}
        } */
/* .box{
          position: relative;
          width: 100px;
          height: 100px;
          margin-left: 500px;
          background-color: bisque;
        }*/
/* .moveBox{
          transform: translateX(-100px);
          transition: transform 0.4s linear 0s
        } */
.moveBox {
  animation: 1s mymove 0s ease;
}
@keyframes mymove {
  from {
    left: 0px;
  }
  to {
    left: -100px;
  }
}

/* @-webkit-keyframes mymove /*Safari and Chrome*/
/* {
            from {left:0px;}
            to {left:200px;}
          }  */
/*  */
</style>
