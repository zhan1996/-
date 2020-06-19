<template>
    <div class="users_container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input type="text" v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
            <!-- <template slot-scope="scope"> -->
            <!-- vue2.6的写法如下 v-slot可以简写# -->
            <!-- <template v-slot="scope"> -->
            <template #default="scope">
                <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
            <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">
                    
                </el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="removeUserById(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
                <!-- 分配角色按钮 -->
                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="userlist.total">
      </el-pagination> -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </el-card>
     <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
    <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon label-width="70px" class="demo-ruleForm">
    <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="addForm.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile" ></el-input>
    </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" status-icon label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDialogClosed">
        <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <!-- :label 显示文本，:value 选中值 -->
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
            </el-select>
        </p>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
           
<script>
export default{
    data(){
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
            // 合法的邮箱
            return cb()
        }
        cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
            return cb()
        }
        cb(new Error('请输入合法的手机号'))
    }
        return {
            userlist: [],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            total:0,
            addDialogVisible: false,
            editDialogVisible: false,
            setRoleDialogVisible: false,
            userInfo:{},
            rolesList:[],
            selectedRoleId:'',
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            addFormRules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    {min:3,max:15,message:'用户名的长度在3~15个字符之间',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:3,max:15,message:'密码的长度在3~15个字符之间',trigger:'blur'}
                ],
                email:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            editForm: {
                username: '',
                email:'',
                mobile:''
            }, // 查询到的用户信息对象
            editFormRules: { // 修改表单的验证规则对象
            email: [
                { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入用户手机', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ]
            }
        }
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get('users',{
                params:this.queryInfo
            })
            console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取用户列表失败')
            }
            this.userlist = res.data.users
            this.total= res.data.total
        },
         // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        async userStateChange(userinfo){
            console.log(userinfo)
            const {data:res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败!')
            }
            this.$message.success('更新用户状态成功！')
        },
        addDialogClosed() { // 监听添加用户对话框的关闭事件
            this.$refs.addFormRef.resetFields()
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status !== 201){
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功！')
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        async removeUserById(id){
            const confirmResult = await this.$confirm('请问是否永久删除该用户','删除提示',{
                confirmButtonText:'确认删除',
                cancelButtonText:'取消',
                type:'warnimg'
            }).catch(err => err)

            if(confirmResult != "confirm"){
                return this.$message.info('已经取消删除')
            }
            const {data:res} = await this.$http.delete('users/'+id)

            if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')

            this.getUserList()
        },
        async showEditDialog (id) { // 展示编辑用户的对话框
            const {data:res} = await this.$http.get('users/'+id)
            console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('查询用户失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
            
        },
        editDialogClosed() { // 监听添加用户对话框的关闭事件
            this.$refs.editFormRef.resetFields()
        },
        editUser(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.put('users/'+this.editForm.id,this.editForm)
                if(res.meta.status !== 200){
                    this.$message.error('添加用户失败')
                }
                this.$message.success('用户信息更新成功！')
                this.editDialogVisible = false
                this.getUserList()
            })
        },
        async setRole( userInfo ){
            console.log(userInfo)
            //保存起来以供后续使用
            this.userInfo = userInfo;
            //获取所有的角色信息，以备下拉列表使用
            //发送请求根据id完成删除操作
            const { data: res } = await this.$http.get('roles')
            //判断如果删除失败，就做提示
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            
            this.rolesList = res.data;
            //展示分配角色对话框
            this.setRoleDialogVisible = true;
        },
        async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选择需要分配的角色')
            }
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
            if(res.meta.status !== 200){
                return this.$message.error('分配角色失败')
            }
            this.$message.success('分配角色成功')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        setRoleDialogClosed(){
            this.selectedRoleId = ''
            this.userinfo = {}
        }
    },
    created(){
        this.getUserList()
    }   
}
</script>
<style lang="less" scoped>
     .el-input__inner {
         width: 100px;
     }   
     p {
         margin: 10px;
         text-align: left;
     }    
</style>