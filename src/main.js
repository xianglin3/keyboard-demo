// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
// import MathKeyboard from './lib/index.js'
import changeData from './vuexs/index'

Vue.config.productionTip = false

// Vue.use(MathKeyboard)

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    changeData,
  },
  strict: false,
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
