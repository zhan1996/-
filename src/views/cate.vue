<template>
    <div>
       <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <el-row>
            <tree-table :data="cateList" :columns="columns" :selection-type="false"
            :expand-type="false" show-index index-text="#" border :show-row-hover="false">
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <template v-slot:order="scope">
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag size="mini" type="warning" v-else>三级</el-tag>
            </template>
            <template v-slot:opt="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            </template>
            </tree-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed" width="50%" >
    <!-- 添加分类表单 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
            <!-- expandTrigger='hover'(鼠标悬停触发级联) v-model(设置级联菜单绑定数据) :options(指定级联菜单数据源)  :props(用来配置数据显示的规则) 
            clearable(提供“X”号完成删除文本功能) change-on-select(是否可以选中任意一级的菜单) -->
            <el-cascader expandTrigger='hover' v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable change-on-select></el-cascader>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
    </el-dialog>
    </div>
</template>
           
<script>
export default{
    data(){
        return {
            cateList:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            columns: [
                {label:'分类名称',prop:'cat_name'},
                //type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
                {label:'是否有效',prop:'',type:'template',template:'isok'},
                {label:'排序',prop:'',type:'template',template:'order'},
                {label:'操作',prop:'',type:'template',template:'opt'}
            ],
            addCateDialogVisible:false,
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ],
                cat_pid:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            parentCateList:[],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover'
            },
            //绑定用户选择的分类值
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表数据失败')
            }
            this.cateList = res.data.result
            this.total = res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showCateDialog(){
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表失败')
            }
            this.parentCateList = res.data
        },
        parentCateChange(){
             //级联菜单中选择项发生变化时触发
            console.log(this.selectedKeys)
            //如果用户选择了父级分类
            if(this.selectedKeys.length > 0){
            //则将数组中的最后一项设置为父级分类
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
            //level也要跟着发生变化
            this.addCateForm.cat_level = this.selectedKeys.length
            }else{
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
            }
        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        addCate(){
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        }
    }      
}
</script>
<style lang="less" scoped>
            
</style>