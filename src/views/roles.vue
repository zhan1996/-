<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="roleList" border>
        <!-- 添加展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row :class="['bdbottom','vcenter',i1===0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                    <el-col :span="5">
                        <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="19">
                        <el-row :class="[i2===0?'':'bdtop','vcenter' ]" v-for="(item2,i2) in item1.children" :key="item2.id">
                            <el-col :span="6">
                                <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                 <i class="el-icon-caret-right"></i>
                                </el-col>
                            <el-col :span="18">
                                <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3) in item2.children" :key="item3.id">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                    <!-- <pre>
                        pre:让代码不进行渲染，直接在页面中显示
                        {{scope.row}}
                    </pre> -->
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope"> 
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id,scope.row.roleName)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 修改 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" @close="setRightDialogClose">
        <!-- <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree> -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
           
<script>
export default{
    data(){
        return {
            roleList:[],
            dialogVisible: false,
            editDialogVisible:false,
            editForm:{
                roleName:'',
                roleDesc:''
            },
            editFormRules:{
                roleName:[{required:true,message:'请输入角色名称',trigger:'blur'}],
                roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'}]
            },
            //权限树数据
            rightsList: [],
            treeProps:{
                label: 'authName',
                children:'children'
            },
            defKeys: [],
            //保存正在操作的角色id
            roleId:''
        }
    },
    methods:{
        async getRoleList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status !== 200)
            return this.$message.error('获取角色列表失败')
            this.roleList = res.data
        },
        async removeRightById(role,rightId){
            const confirmResult = await this.$confirm('请问是否删除该权限','删除提示',{
                confirmButtonText:'确认删除',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err)
            //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if(confirmResult != "confirm"){
                return this.$message.info("已经取消删除")
            }
            //用户点击了确定表示真的要删除
            //当发送delete请求之后，返回的数据就是最新的角色权限信息
            const {data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200)
            return this.$message.error('删除失败')
            //无需再重新加载所有权限
            //只需要对现有的角色权限进行更新即可
            role.children = res.data
            // this.getRoleList();
        },
        async showSetRightDialog(role) {
            this.roleId = role.id
        
            //获取所有权限的数据
            const {data:res} = await this.$http.get('rights/tree')
            //如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200)
                return this.$message.error('获取权限树失败')
            //如果返回状态正常，将请求的数据保存在data中
            this.rightsList = res.data
            this.getLeafKeys(role,this.defKeys)
            //当点击分配权限按钮时，展示对应的对话框
            this.dialogVisible = true;
        },
        showEditDialog(id){},
        async removeRoleById(id){
            const confirmResult = await this.$confirm('请问是否永久删除该角色','删除提示',{
                confirmButtonText:'确认删除',
                cancelButtonText:'取消',
                type:'warnimg'
            }).catch(err => err)
            if(confirmResult != "confirm"){
                return this.$message.info('已经取消删除')
            }
            const {data: res } = await this.$http.delete('roles/'+id)
            if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getRoleList()
        },
        getLeafKeys(node,arr){
            if (!node.children) {
                return arr.push(node.id)
            }
            // 递归调用
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        setRightDialogClose() {
            //当用户关闭树形权限对话框的时候，清除掉所有选中状态
            this.defKeys = []
        },
        async allotRights() {
            //当用户在树形权限对话框中点击确定，将用户选择的
            //权限发送请求进行更新

            //获取所有选中及半选的内容
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            //将数组转换为 , 拼接的字符串
            const idStr = keys.join(',')

            //发送请求完成更新
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids:idStr }
            )
            if (res.meta.status !== 200)
                return this.$message.error('分配权限失败')

            this.$message.success("分配权限成功")
            this.getRoleList();
            //关闭对话框
            this.dialogVisible = false;
        },
        async showEditDialog(id,name){
            const {data:res} = await this.$http.get('roles/'+id)
            if(res.meta.status !== 200){
                return this.$message.error('获取角色失败')
            }
            this.editForm = res.data
            console.log(this.editForm)
            this.getRoleList()
            this.editDialogVisible = true
        },
        editRole(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,this.editForm)
            if(res.meta.status !== 200){
                return this.$message.error('提交角色失败')
            }
            this.$message.success('提交成功！')
                this.editDialogVisible = false
                this.getRoleList()
            })
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        }
    },
    created(){
        this.getRoleList()
    }   
}
</script>
<style lang="less" scoped>
.el-tag {
    margin: 15px;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.bdtop {
    border-top: 1px solid #eee;
}  
.vcenter {
    display: flex;
    align-items: center;
}  
/deep/.el-dialog_body {
    max-height:500px;
    overflow: auto;
}  
</style>