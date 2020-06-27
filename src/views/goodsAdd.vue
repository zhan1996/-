<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 消息提示 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步骤条组件 -->
            <!-- align-center(居中效果) -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader expandTrigger='hover' v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange" clearable></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单item项 -->
                        <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
                            <!-- 使用数组渲染复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 循环生成静态属性 -->
                            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                                <el-input v-model="item.attr_vals"></el-input>
                            </el-form-item>
                    </el-tab-pane>
                    <!-- 图片上传 -->
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture" :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            
        </el-card>
        <!-- 预览图片对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="40%">
        <img :src="previewPath" class="previewImg" />
        </el-dialog>
    </div>
</template>
           
<script>
import _ from 'lodash'
export default{
    data(){
        return {
            activeIndex: '0',
            addForm:{
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            addFormRules:{
                goods_name:[
                    {required:true,message:'请输入品牌名称',triggerL:'blur'}
                ],
                goods_price:[
                    {required:true,message:'请输入品牌价格',triggerL:'blur'}
                ],
                goods_weight:[
                    {required:true,message:'请输入品牌重量',triggerL:'blur'}
                ],
                goods_number:[
                    {required:true,message:'请输入品牌数量',triggerL:'blur'}
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            //用来保存分类数据
            cateList: [],
            //配置级联菜单中数据如何展示
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            //动态参数列表
            manyTableData: [],
            //静态属性列表
            onlyTableData:[],
            //上传图片的url地址
            uploadURL: 'http://www.klxin.cn:8888/api/private/v1/upload',
            //图片上传组件的headers请求头对象
            headerObj: { Authorization: window.localStorage.getItem('token') },
            //保存预览图片的url地址
            previewPath: '',
            previewVisible:false
            
        }
    },
    created(){
        this.getCateList()
    },
    methods: {
        async getCateList(){
          const {data:res} = await this.$http.get('categories')
          if(res.meta.status !== 200){
              return this.$message.error('获取数据失败')
          }
          this.cateList = res.data
        },
        handleChange(){
            //如果用户选择的不是三级分类,该次选择无效，因为必须选择三级分类
            if(this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat = []
                return
            }
        },
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName === '0'){
                if(this.addForm.goods_cat.length !== 3){
                    this.$message.error('请选择商品的分类')
                    return false
                }
            }
        },
        async tabClicked(){
            if(this.activeIndex === '1'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: { sel: 'many' } })
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态参数列表')
                }
                res.data.forEach(item=>{
                    item.attr_vals = item.attr_vals.length === 0 ?[]:item.attr_vals.trim().split(',')
                })
                this.manyTableData = res.data
            } else if(this.activeIndex === '2'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: { sel: 'only' } })
                if(res.meta.status !== 200){
                    return this.$message.error('获取静态属性列表失败')
                }
                this.onlyTableData = res.data
            }
        },
        handlePreview(File){
            console.log(File)
            //当用户点击图片进行预览时执行，处理图片预览
            this.previewPath = 'http://www.klxin.cn:8888/' + File.response.data.tmp_path
            this.previewVisible = true
        },
        handleRemove(file){
            //
            const filePath = file.response.data.tmp_path

            const index = this.addForm.pics.findIndex(item => item.pic === filePath)

            this.addForm.pics.splice(index,1)
        },
        handleSuccess(response){
            console.log(response)
            const picInfo = {pic:response.data.tmp_path}
            this.addForm.pics.push(picInfo)
        },
        add(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return this.$message.error('请填写必要的表单项')
                //将addForm进行深拷贝，避免goods_cat数组转换字符串之后导致级联选择器报错
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(",")

                console.log(form)

                this.manyTableData.forEach(item => {
                    form.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals.join(" ")})
                })
                this.onlyTableData.forEach(item => {
                    form.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals})
                })
                const {data:res} = await this.$http.post('goods',form)
                if(res.meta.status !== 201){
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
                
            })
        }
    },
    //添加 计算属性获取三级分类
    computed: {
        cateId() {
        if (this.addForm.goods_cat.length === 3) {
            return this.addForm.goods_cat[2]
        }
        return null
        }
    }         
}
</script>
<style lang="less" scoped>
.previewImg {
    width: 100%   
}

/* //给添加商品按钮添加间距 */
.btnAdd {
  margin-top:15px
}       
</style>