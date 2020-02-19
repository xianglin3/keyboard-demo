<template>
  <div class="demo-photo">
    <transition-group tag="ul" name="slide">
        <li v-for="item in items" :key="item.id">
            {{ item.text }}
        </li>
    </transition-group>
    <div class="config-btn">
        <span @click="del">删除</span>
        <span @click="add">增加</span>

    </div>
  </div>
</template>

<script>
export default {
  name: 'swiper-photo',
  data () {
    return {
        items:[
            {
                id:1,
                text: '测试1'
            },
            {
                id:2,
                text: '测试2'
            },
            {
                id:3,
                text: '测试3'
            },
            {
                id:4,
                text: '测试4'
            },
            {
                id:5,
                text: '测试5'
            }
        ]
    }
  },
  methods:{
      del(){
          this.items.pop();
      },
      add(){
          this.items.unshift({id:Date.now(),text:`这是测试${Date.now()}`})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.slide-enter-active, .slide-leave-active {
    transition: opacity .5s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
