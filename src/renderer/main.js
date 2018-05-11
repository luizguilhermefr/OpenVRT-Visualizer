import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueElectron from 'vue-electron'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(VueElectron)
Vue.use(VueMaterial)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>',
}).$mount('#app')
