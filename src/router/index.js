import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
import Home from "../views/home.vue";

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
    component: Home
  }
];



const router = new VueRouter({
  routes
});

router.beforeEach((to,from,next)=>{
    if(to.path === '/login') return next()
    if(!localStorage.getItem('token')) return next('/login')
    next()
})

export default router;
