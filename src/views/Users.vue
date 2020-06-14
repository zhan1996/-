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
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                <!-- 分配角色按钮 -->
                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
    <!-- 内容主体区域 -->
    这是主题区域
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
           
<script>
export default{
    data(){
        return {
            userlist: [],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            total:0,
            addDialogVisible: false
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
        change (e) {
            this.$forceUpdate()
        }
    },
    created(){
        this.getUserList()
    }   
}
</script>
<style scoped>
            
</style>