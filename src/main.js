import Vue from 'vue'
import app from './app.vue'
import router from './router'
import axios from 'index/common/js/axios'
import store from 'index/store'
import VueLazyload from 'vue-lazyload'
import globalComponents from 'index/common/js/components'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import 'index/common/styles/reset.styl'
Vue.use(MintUI)

Vue.use(axios)
Vue.use(globalComponents) // 初始化全局组件
Vue.use(VueLazyload, {
  loading: require('index/common/images/loading.png')
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')
