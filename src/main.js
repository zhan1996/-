import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button,Form,FormItem,Input,Message } from 'element-ui'

import './assets/css/reset.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://www.klxin.cn:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.$message = Message

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
