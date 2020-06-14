<template>
    <div class="home">
        <el-container>
            <el-header>
                <div class="home-slogn">
                    <img src="./../assets/images/heima.png" alt="">
                    <span>后台管理系统</span>
                </div>
                <el-button type="info" @click="loginout">退出</el-button>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '64px' : '200px'">
                        <div class="toggle-auto" @click="isCollapse = !isCollapse">|||</div>
                        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" unique-opened router @open="handleOpen" @close="handleClose" :collapse="isCollapse"
            :collapse-transition="false" background-color="#333744" text-color="#fff" active-text-color="#409eff">
                        <el-submenu :index="submenu.id+''" v-for="submenu in menuList" :key="submenu.id">
                            <!-- 一级导航 -->
                            <template slot="title">
                            <i :class="navIconObj[submenu.id]"></i>
                            <!-- <i class="iconfont icon-user"></i> -->
                            <!-- <i class="el-icon-location"></i> -->
                            <span>{{submenu.authName}}</span>
                            </template>
                            <!-- 二级导航 -->
                            <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
                            <el-menu-item @click="saveActive(item.path)" :index="item.path" v-for="item in submenu.children" :key="item.id">
                            <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{item.authName}}</span>
                            </template>
                            </el-menu-item>
                        </el-submenu>
                        </el-menu>      
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
           
<script>
export default{
    data(){
        return {
            isCollapse: false,
            menuList:[],
             navIconObj: {
                125: 'iconfont icon-user',
                103: 'iconfont icon-tijikongjian',
                101: 'iconfont icon-shangpin',
                102: 'iconfont icon-danju',
                145: 'iconfont icon-baobiao'
            },
            defaultActive:''
        }
    },
      methods:{
          saveActive(path){
              this.defaultActive = path
              sessionStorage.setItem('defaultActive',path)
          },
            loginout(){
              localStorage.removeItem('token')
              this.$router.push('/login')
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            async getMenuList () {
            // 获取本地存储token
            const tokenStr = localStorage.getItem('token')
            /* const { data: res } = await this.$http.get('menus', { headers: { Authorization: tokenStr } })
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg || '接口无效')
            this.menuList = res.data */

            // promise
            // this.$http.get('menus', { headers: { Authorization: tokenStr } })
            this.$http.get('menus')
                .then(res => {
                    console.log(res)
                const { data: result } = res // {data: {}}
                if (result.meta.status !== 200) return this.$message.error(result.meta.msg || '接口无效')
                this.menuList = result.data
                })
            }
            // async getMenuList(){
            //     const tokenStr = localStorage.getItem('token')
            //     this.$http.get('menus',{headers:{Authorization:tokenStr}})
            //     .then(res=>{
            //         const {data:result} = res
            //         if(result.meta.status !== 200) return this.$message.error(result.meta.msg || '接口无效')
            //         this.getMenuList = result.data
            //     })
            // }
            },
    created(){
        this.getMenuList()
        this.defaultActive = sessionStorage.getItem('defaultActive')
    } 
}
</script>
<style lang="less" scoped>
.home {
    .el-container {
        height: 100vh;
    }
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        .el-button {
            height: 40px;
            margin-top: 10px;
        }
    }
    .el-aside {
        background-color: #333744;
        .toggle-auto {
            color: #fff;
        }
        .el-menu {
            border:none;
            .iconfont {
                margin-right: 8px;
            }
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    &-slogn {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            color: #fff;
            font-size: 20px;
            margin-left: 15px;
        }
    }
}    
</style>