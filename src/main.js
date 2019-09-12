import Vue from 'vue'
import App from './App.vue'

import VueAxios from 'vue-axios'
import axios from 'axios';
import router from './router/router-dev';

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
