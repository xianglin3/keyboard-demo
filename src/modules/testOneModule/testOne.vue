<template>
  <div class="testOne">
    我是子组件一
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'testOne',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      testString: 'testString',
      testBlooen: 'testBlooen',
      testObject: 'testObject',
      testNumber: 'testNumber'
    })
  },
  watch: {
    testString: {
      handler(val) {
        console.error('testString', val)
      }
    },
    testBlooen: {
      handler(val) {
        console.error('testBlooen', val)
      }
    },
    testObject: {
      handler(val) {
        console.error('testObject', val)
      }
    },
    testNumber: {
      handler(val) {
        console.error('testNumber', val)
      }
    },
  }
}