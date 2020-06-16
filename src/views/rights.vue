<template>
    <div class="rights">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'" >一级权限</el-tag>
                <el-tag v-if="scope.row.level === '1'" type="success">二级权限</el-tag>
                <el-tag v-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
            </template>
        </el-table-column>
    </el-table>
    </div>
</template>
           
<script>
  export default {
    data() {
      return {
        rightsList: []
      }
    },
    methods:{
        async getRightList(){
            const {data:res} = await this.$http.get('rights/list')
            console.log(res)
            if(res.meta.status !== 200)
                return this.$messages.error('获取权限列表')
            this.rightsList = res.data
            
        }
    },
    created(){
        this.getRightList()
    }
  }
</script>
<style scoped>
            
</style>