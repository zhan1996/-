import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
import Home from "../views/home.vue";
import Welcome from "../views/welcome.vue"
import Users from '../views/Users.vue'
import Roles from '../views/roles.vue'
import Rights from '../views/rights.vue'
import Cate from '../views/cate.vue'
import Params from '../views/params.vue'
import goods from '../views/goods.vue'
import goodsAdd from '../views/goodsAdd.vue'
import Order from '../views/order.vue'
import Report from '../views/Report.vue'

Vue.use(VueRouter);

const routes = [
  {
      path:'/',
      redirect:'/login'
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect:'/welcome',
    children:[
        {path:'/welcome',name:"Welcome",component:Welcome},
        {path:'/users',name:'Users',component:Users},
        {path:'/roles',name:'Roles',component:Roles},
        {path:'/rights',name:'Rights',component:Rights},
        {path:'/categories',name:'Cate',component:Cate},
        {path:'/params',name:'Params',component:Params},
        {path:'/goods',name:"Goods",component:goods},
        {path:'/goods/add',name:"GoodsAdd",component:goodsAdd},
        {path:'/orders',name:'Order',component:Order},
        {path:'/reports',name:'Report',component:Report}
    ]
  }
];



const router = new VueRouter({
  routes
});

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
};

router.beforeEach((to,from,next)=>{
    if(to.path === '/login') return next()
    if(!localStorage.getItem('token')) return next('/login')
    next()
})

export default router;
