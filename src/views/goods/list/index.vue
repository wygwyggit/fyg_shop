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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"  clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
        <el-table :data="goodsList" style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="140px">
                <template v-slot:default='slotProps'>
                   {{slotProps.row.add_time | dataFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作" >
                <template v-slot:default='slotProps'>
                  <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
                  <el-button type="danger" icon="el-icon-delete" size='mini'  @click="removeById(slotProps.row.goods_id)"></el-button>
               </template>
            </el-table-column>
        </el-table>
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    goodsList: [],
    // 商品查询参数
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 8
    },
    total: ''
  }),
  created() {
    this.getGoodsList()
  },
  methods: {
   async getGoodsList() {
     // 发送请求获取商品数据
      const { data: { data, meta } } = await this.$http.get('goods', {
         params: this.queryInfo
       })
      if (meta.status !== 200) {
        return this.$msg.error('商品数据获取失败')
      }
      this.goodsList = data.goods
      this.total = data.total
    },
    handleSizeChange(newsize) {
       this.queryInfo.pagesize = newsize
       this.getGoodsList()
    },
    handleCurrentChange(curindedx) {
       this.queryInfo.pagenum = curindedx
       this.getGoodsList()
    },
    // 删除商品
    removeById(id) {
       this.$comfirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: { data, meta } } = await this.$http.delete(`goods/${id}`)
         if (meta.status !== 200) {
            return this.$msg.error('删除失败！')
          }
        this.$msg.success('删除成功！')
        this.getGoodsList()
        }).catch(() => {

        })
    },
    addgoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
