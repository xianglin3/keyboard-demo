import Vue from 'vue'
import Router from 'vue-router'
import keyboardDemo from '@/pages/keyboardDemo'
import mathJax from '@/pages/mathJax'
import swiperPhoto from '@/pages/swiperPhoto'
import photoCropper from '@/pages/photoCropper'
import trajectoryDyn from '@/pages/trajectoryDyn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/keyboard',
      name: 'keyboardDemo',
      component: keyboardDemo
    },
    {
      path: '/math-jax',
      name: 'mathJax',
      component: mathJax
    },
    {
      path: '/swiper-photo',
      name: 'swiperPhoto',
      component: swiperPhoto
    },
    {
      path: '/photo-cropper',
      name: 'photoCropper',
      component: photoCropper
    },
    {
      path: '/trajectory-dyn',
      name: 'trajectoryDyn',
      component: trajectoryDyn
    }
  ]
})
