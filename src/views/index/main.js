import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'

Vue.config.productionTip = false

Vue.prototype.$debug = function(title, message) {
	console.log('Debug log output: %s >>>> %o', title, message);
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
