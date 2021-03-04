<template>
  <div class="seat-stage">
    <div class="buttons">
      <button @click="startMove">开始轮播</button>
      <button @click="moveItem">位移</button>
      <button @click="jumpTo">位置调整</button>
    </div>
    <div class="main">
      <div class="seat-main">
        <div class="seat-users" ref="seatUsers">
          <div v-for="(item,index) in listData" class="user" :ref="`demo${index}`" :style="{order: index}">
            <div class="user-content" :ref="`user${item.id}`">{{item.id}}</div>
          </div>
        </div>
      </div>
      <div class="stage-main"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'seat-stage',
  data () {
    return {
      count: 0,
      co: 0,
      listData: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
        {
          id: 5,
        },
        {
          id: 6,
        },
      ]
    }
  },
  methods: {
    startMove() {
      this.count >= 6 ? this.count = 0 : this.count+=1;
      this.$refs.seatUsers.style = `transform: translateX(-${108 * this.count}px)`;
    },
    moveItem() {
      let ele = this.$refs.user1
      console.log(this.$refs, ele);
      ele[0].style = 'position:absolute;left:0;top:0; transform: translate(0px, 108px)';
    },
    jumpTo() {
      this.co == 5? this.co = 0 : this.co+=1;
      this.$refs.demo0[0].style.order = `${this.co}`
    },
  }
}
</script>
<style scoped lang="less">
.seat-stage {
  width: 1040px;
  position: relative;
  .buttons {
    width: 100%;
    height: 50px;
  }
  .main {
    width: 100%;
    height: 800px;
    .seat-main{
      width: 100%;
      height: 120px;
      overflow: hidden;
      .seat-users{
        display:flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        transition: all ease .2s;
        .user{
          width: 108px;
          height: 108px;
          background:orange;
          border: 1px solid #333;
          // display: inline-block;
          order: 1;
          .user-content{
            width:108px;
            height: 108px;
            background:darkgray;
            text-align: center;
            line-height: 108px;
          }
        }
      }
    }
    .stage-main{
      height: 500px;
      width: 100%;
      background:cornflowerblue;
    }
  }
}
</style>
