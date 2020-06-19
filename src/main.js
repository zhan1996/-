import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入插件
import TreeTable from 'vue-table-with-tree-grid'
import { Button,Form,FormItem,Input,Message,Container,Main,Aside,Header,MenuItemGroup,MenuItem,Menu,Submenu,Breadcrumb,BreadcrumbItem,Row,Col, Card, TableColumn,Table, Switch, Tooltip, Pagination,Dialog, MessageBox, Tag,Tree,Select,Option,Cascader} from 'element-ui'

import './assets/css/reset.css'

// 引入字体图标库
import './assets/fonts/iconfont.css'

import axios from 'axios'

// 请求拦截器
// axios.interceptors.request.use(function(config){
//     const tokenStr = localStorage.getItem('token')
//     if(tokenStr) config.Headers.Authorization = tokenStr
//     return config
// },function(error){
//     return Promise.reject(error)
// })
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 在请求发送之前做一些事
    // 在请求发送之前 配置headers头信息 config是一个配置对象 你想配置什么就在config上配置即可
    const tokenStr = localStorage.getItem('token')
    if (tokenStr) config.headers.Authorization = tokenStr
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

// 相应拦截器
axios.interceptors.response.use(function(response){
    if(response.status!== 200){
        Message.error('网络异常')
    } else {
        if(response.data.meta.status !== 200 &&　response.data.meta.status !== 201){
            Message.error(response.data.meta.msg || '异常问题')
        }
    }
    return response
},function(error){
    return Promise.reject(error)
})

axios.defaults.baseURL = 'http://www.klxin.cn:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)



Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
