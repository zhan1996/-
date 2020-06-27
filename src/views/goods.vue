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
            <el-col :span="8">
                <el-input v-model="queryInfo.query" placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button class="addGoods" type="primary" @click="goAddPage">添加商品</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="95px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="95px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="125px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button size="mini" type="danger" icon="el-icon-edit" @click="removeGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-row>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" @close="editDialogClosed" width="50%">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称"  prop="goods_name">
        <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="edit">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
           
<script>
export default{
    data(){
        return {
            goodsList:[],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            editDialogVisible:false,
            editForm:{
                goods_name:'',
                goods_price:'',
                goods_number:'',
                goods_weight:''
            },
            editFormRules:{
                goods_name:[
                    {required:true,message:'请输入品牌名称',trigger:'blur'}
                ],
                goods_price:[
                    {required:true,message:'请输入品牌价格',trigger:'blur'}
                ],
                goods_weight:[
                    {required:true,message:'请输入品牌重量',trigger:'blur'}
                ],
                goods_number:[
                    {required:true,message:'请输入品牌数量',trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{
                params:this.queryInfo
            })
            console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表数据失败')
            }
            // console.log(res.data)
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        handleSizeChange(newSize){
            //当页号发生改变时，更改pagesize，重新请求
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            //当页码发生改变时，更改pagesize，重新请求
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        async removeGoods(goods_id){
            //弹窗提示用户是否要删除
            const confirmResult = await this.$confirm(
                '请问是否要删除该商品',
                '删除提示',
                {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err)
            //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if (confirmResult != 'confirm') {
                return this.$message.info('已经取消删除')
            }
            const {data:res} = await this.$http.delete(`goods/${goods_id}`)
            if(res.meta.status !== 200){
                return this.$message.error('删除商品失败')
            }
            this.$message.success('删除商品成功')
            this.getGoodsList()
        },
        goAddPage(){
            this.$router.push('/goods/add')
        },
        async showEditDialog(id){
            const {data:res} = await this.$http.get('goods/'+id)
            console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('查询数据失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
            console.log(this.editForm)
        },
        edit(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.put('goods/'+this.editForm.goods_id,this.editForm)
                console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error('编辑失败')
                }
                this.$message.success('信息更新成功')
                this.editDialogVisible = false
                this.getGoodsList()
            })
        }
    }   
}
</script>
<style lang="less" scoped>
.addGoods {
    margin-left: 20px;
}  
</style>