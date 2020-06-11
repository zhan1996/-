<template>
    <div>
        <el-button type="info" @click="loginout">退出</el-button>
      御剑乘风来,除魔天地间!
    </div>
</template>
           
<script>
export default{
      methods:{
          loginout(){
              localStorage.removeItem('token')
              this.$router.push('/login')
          }
      }       
}
</script>
<style scoped>
            
</style>