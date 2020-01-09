import Vue from 'vue'
import Router from 'vue-router'
import keyboardDemo from '@/pages/keyboardDemo'
import routeDemo from '@/pages/routeDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/keyboard',
      name: 'keyboardDemo',
      component: keyboardDemo
    },
    {
      path: '/route-demo',
      name: 'routeDemo',
      component: routeDemo
    }
  ]
})
