import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'index/store'
// import { getCookieUser, setCookieUser } from 'index/common/js/cache'
Vue.use(VueRouter)
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/list/1'
    },
    {
      path: '/list/:type',
      name: 'list',
      component: () => import('../pages/List.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../pages/User.vue')
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('../pages/Movie.vue')
    },
    {
      path: '/fillInvitation',
      name: 'fillInvitation',
      component: () => import('../pages/fillInvitation.vue')
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('../pages/share.vue')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../pages/feedback.vue')
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: () => import('../pages/orderList.vue')
    },
    {
      path: '/buyMember',
      name: 'buyMember',
      component: () => import('../pages/buyMember.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('to.name============' + to.name)
  console.log('from.name=========' + from.name)
  if (!store.state.appUser.deviceId) {
    store.dispatch('getDeviceId').then(res => {
      console.log('获取到id===' + res)
      if (!res && to.name === 'user') {
        next({ name: 'share' })
      } else {
        next()
      }
    }).catch(() => {
      next({ name: 'share' })
    })
  } else if (!store.state.appUser.userInfo.id) {
    console.log('data', '有id，没有账户')
    store.dispatch('getUserInfo', store.state.appUser.deviceId)
    next()
  } else {
    next()
  }
})
export default router
