<template>
  <div class="cr"
       v-show="true">
    <div>order</div>
    <button @click='startCarouselStu'>开始轮播</button>
    <button @click='moveTo'>移出</button>
    <button @click='moveBack'>移回</button>
    <div class="show">
      <div class="box"
           id="box">
        <div v-for="(item, index) in imgList"
             :key="index"
             :class="`img${index}`"
             class="imgcont">
          <img :src='item.src'
               :id="`seat${index}`"
               :alt="index">
          <div>{{index}}</div>
        </div>
      </div>
      <div class="live-main">

      </div>
    </div>
    <!-- <div class="content">
      <div class="seat-main">
        <div class="seats">
          <div class="seat"
               v-for="num in 6"
               :key="num">
            <div class="seat-content"
                 :id="`seat${num}`">{{num}}</div>
          </div>
        </div>
      </div>
      <div class="live-main"></div>
    </div> -->

  </div>
</template>
<script>
import { TweenMax } from 'gsap'
export default {
  name: 'carouselSeat',
  components: {
  },
  data () {
    return {
      imgList: [
        {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-a99419bb94924e6d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        },
        {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-736bc3917fe92142.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        }, {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-7fe8c323e533f656.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        },
        {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-c12521fbde6c705b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        },

        {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-caf66b935fd00e18.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        },
        {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-48dd99da471ffa3f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        }, {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-4de5440a56bff58f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        },
        {
          src: 'https://upload-images.jianshu.io/upload_images/5809200-03bbbd715c24750e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'
        }],
      stuIndex: 0, // 座位席第一个学生的index
      carouselTimer: null, // 轮播计时器
      order: 2
    }
  },
  methods: {
    setImgOrder (index, order) {
      let stuDom = document.getElementsByClassName(`img${index}`)
      stuDom[0].style.order = `${order}`
    },
    startCarouselStu () {
      this.clearTimer()
      this.carouselTimer = setInterval(() => {
        this.order++
        this.setImgOrder(this.stuIndex, this.order)
        if (this.stuIndex < 7) {
          this.stuIndex++ // 3s轮播一位学生
        } else {
          this.stuIndex = 0
        }
      }, 3000)
      //
    },
    // 清除定时器
    clearTimer () {
      if (this.carouselTimer) {
        clearInterval(this.carouselTimer)
        this.carouselTimer = null
      }
    },
    moveTo () {
      TweenMax.to("#seat3", 2, { position: 'fixed', top: 150, left: 200, scale: 1.5 });
    },
    moveBack () {
      TweenMax.to("#seat3", 3, { position: 'static', top: 'auto', left: 'auto', scale: 1 });
    }
  },
  mounted () {

  }
}
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
.show {
  // border: 5px solid #c1c1c1;
  margin: 100px auto;
  width: 500px;
  // height: 200px;
  position: relative;
  // overflow: hidden;
  .live-main {
    width: 100%;
    height: 300px;
    background: rgb(0, 118, 252);
  }
}
.box {
  width: 500px;
  height: 120px;
  // position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // overflow: hidden;
}
ul {
  list-style-type: none;
}
.box ul li {
  float: left;
  /* display: block;  */
}
.imgcont {
  // position: relative;
  width: 100px;
  order: 1;
}
img {
  width: 100px;
  height: 100px;
}
button {
  width: 100px;
  height: 50px;
  background-color: rgb(0, 118, 252);
  color: #ffffff;
  margin-bottom: 25px;
}
// .cr {
//   .content {
//     position: relative;
//     .seat-main {
//       width: 300px;
//       height: 50px;
//       .seats {
//         width: 100%;
//         height: 100%;
//         .seat {
//           display: inline-block;
//           width: 50px;
//           height: 50px;
//           .seat-content {
//             width: 50px;
//             height: 50px;
//             color: #333;
//             background: sandybrown;
//             line-height: 50px;
//             text-align: center;
//             // position: absolute;
//           }
//         }
//       }
//     }
//     .live-main {
//       width: 300px;
//       height: 300px;
//       background: rgb(0, 118, 252);
//     }
//   }
// }
</style>
