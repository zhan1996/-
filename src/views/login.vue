<template>
    <div class="login">
      <div class="login-box">
            <img class="login-box-avatar" src="../assets/logo.png" alt="" />
            <el-form ref="form" :model="loginForm" :rules="rules" label-width="0px" class="demo-ruleForm" size="mini">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text"  prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password"  prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">登录</el-button>
                    <el-button type="info" @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
    </div>
</template>
           
<script>
export default{
     name:'Login',
     data(){
         var validatePass = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.loginForm.password !== '') {
                this.$refs.form.validateField('checkPass')
                }
                callback()
            }
        }
         return {
             loginForm:{
                 username:'',
                 password:''
             },
             rules: {
                 username:[
                     {required:true,message:'请输入用户名',trigger:'blur'},
                     {min:3,max:12,message:'长度在3到12个字符',trigger:'blur'}
                 ],
                 password:[
                     {required:true,message:'请输入密码',trigger:'blur'},
                     {min:3,max:12,message:'长度在3到12个字符',trigger:'blur'},
                     { validator: validatePass, trigger: 'blur' }
                 ]
         }
         }  
     },
     methods:{
         submitForm(formName){
             this.$refs[formName].validate(async (valid)=>{
                 if(valid){
                    //  校验通过
                
                     const {data:result}=await this.$http.post('login',this.loginForm)
                     if(result.meta.status !== 200){
                         return this.$message.error(result.meta.msg || '账号或密码错误');
                     }
                     localStorage.setItem('token',result.data.token)
                       this.$message({
                            message: result.meta.msg || '成功啦哈哈哈',
                            type: 'success'
                        })
                     this.$router.push('/home')
                 } else {
                    //  校验失败
                    console.log('error submit!!')
                    return false
                 }
             })
         },
         resetForm(){
             this.$refs.form.resetFields()
         }
     }       
}
</script>
<style lang="less" scoped>
.login {
    width: 100vw;
    height: 100vh;
    background-color: skyblue;
    position: relative;
    &-box {
        width: 450px;
        height: 300px;
        border-radius: 30px;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        position: relative;
        &-avatar {
            height: 130px;
            width: 130px;
            border-radius: 50%;
            border: 10px solid #fff;
            background-color: #ccc;
            position: absolute;
            left: 50%;
            // top:0;
            transform: translate(-50%, -50%);
            box-shadow: 0px 0px 10px #ddd;
        }
        /deep/ .el-input__inner {
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            color: #606266;
            font-size: 16px;
            padding: 0 35px;
        }
        .el-form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
        /deep/ .el-input__icon {
            font-size: 18px;
        }
    }
}     
</style>