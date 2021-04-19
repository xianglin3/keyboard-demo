import Vue from 'vue'
import Router from 'vue-router'
import keyboardDemo from '@/pages/keyboardDemo'
import mathJax from '@/pages/mathJax'
import swiperPhoto from '@/pages/swiperPhoto'
import photoCropper from '@/pages/photoCropper'
import trajectoryDyn from '@/pages/trajectoryDyn'
import soundWave from '@/pages/soundWave'
import orderCarousel from '@/pages/orderCarousel'
import drawSound from '@/pages/drawSound'
import moduleTest from '@/pages/moduleTest'
import testEvent from '@/pages/testEvent'
import passValue from '@/pages/passValue'
import commonTest from '@/pages/commonTest'
import seatStage from '@/pages/seatStage'
import testone from '@/pages/testone'
import testwo from '@/pages/testwo'

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
    },
    {
      path: '/sound-wave',
      name: 'soundWave',
      component: soundWave
    },
    {
      path: '/order-carousel',
      name: 'orderCarousel',
      component: orderCarousel
    },
    {
      path: '/draw-sound',
      name: 'drawSound',
      component: drawSound
    },
    {
      path: '/module-test',
      name: 'moduleTest',
      component: moduleTest
    },
    {
      path: '/test-event',
      name: 'testEvent',
      component: testEvent
    },
    {
      path: '/pass-value',
      name: 'passValue',
      component: passValue
    },
    {
      path: '/common-test',
      name: 'commonTest',
      component: commonTest
    },
    {
      path: '/seat-stage',
      name: 'seatStage',
      component: seatStage
    },
    {
      path: '/test-one',
      name: 'testone',
      component: testone
    },
    {
      path: '/test-two',
      name: 'testwo',
      component: testwo
    },
  ]
})
