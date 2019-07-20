<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
     <el-table :data="rights" style="width: 100%" border>
      <el-table-column type="index"   width="180"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="权限路径"></el-table-column>
      <el-table-column  label="权限等级">
        <template v-slot:default='slotProps'>
            <el-tag v-if='slotProps.row.level == 0'>权限一</el-tag>
            <el-tag type="success" v-else-if='slotProps.row.level == 1'>权限二</el-tag>
            <el-tag type="warning" v-else>权限三</el-tag>
        </template>
      </el-table-column>
    </el-table>
   </el-card>
  </div>
</template>
<script>
 export default {
   data: () => ({
     rights: []
   }),
   created () {
     this.getRight()
   },
   methods: {
    async getRight () {
      this.nprogress.start()
     const { data: { data, meta } } = await this.$http.get('rights/list')
     if (meta.status !== 200) {
       this.$msg.error(meta.msg)
     } else {
       console.log(data)

       this.rights = data
     }
    this.nprogress.done()
     }
   }
 }
</script>
<style >
</style>