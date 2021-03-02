<template>
  <div class="demoA">
    {{parentData}}
    {{msg}}
    {{test}}
    <!-- <button @click="callParent">button1</button> -->
    <!-- <button @click="getParent">button2</button> -->
    <demo-b ref="demb"
            name="xianglin"
            age="29"
            title="天凉了"
            @click="getParent"></demo-b>
  </div>
</template>

<script>
export default {
  name: 'demoA',
  inject: ['for'],
  components: {
    demoB: () => import('../passDemo/demoB'),
  },
  props: {
    parentData: {
      type: [String, Number],
    }
  },
  data() {
    return {
      //
      msg: '我是 demoA的数据',
      test: this.for,
    }
  },
  methods: {
    callParent() {
      this.$emit('onDemoA', this.msg);
    },
    getParent() {
      // this.msg = this.$parent.msg;
      console.error(this.$parent);
      this.$parent.demoA('hello world');
    }
  }
}
</script>

<style>
</style>