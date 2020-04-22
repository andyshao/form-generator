import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import Widget from '@/components/widget';
import render from '@/components/render/render'
import LwcPadding from '@/components/demo/Padding'
import '@/styles/tailwindcss.css';

Vue.config.productionTip = false

Vue.component('lwc-padding', LwcPadding)
Vue.use(Widget);
Vue.use(render);

Vue.prototype.$debug = function(title, message) {
	console.log('Debug log output: %s >>>> %o', title, message);
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
