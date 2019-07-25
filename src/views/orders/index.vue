<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" style="width: 100%" border stripe>
          <el-table-column  type="index"></el-table-column>
          <el-table-column  prop="order_number"  label="订单编号"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
             <template v-slot:default='slotProps'>
                  <el-tag type="success" v-if="slotProps.row.pay_status === '1'">已付款</el-tag>
                  <el-tag type="danger" v-else>未付款</el-tag>
             </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
             <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="scope">
                  {{scope.row.create_time | dataFormat}}
                </template>
          </el-table-column>
          <el-table-column label="操作">
              <template v-slot.default='slotProps'>
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="addressUpdate"></el-button>
                    <el-button size="mini" type="success" icon="el-icon-location" @click="showprogress"></el-button>
              </template>
          </el-table-column>
      </el-table>
     <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[7, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
     <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
      <!-- 物流信息 -->
        <el-dialog
      title="物流信息"
      :visible.sync="progressVisible"
      width="50%">
       <el-timeline >
          <el-timeline-item
            v-for="(activity, index) in progressData"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
       </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata'
export default {
data: () => ({
  queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
  },
  total: 0,
  orderlist: [],
  addressVisible: false,
  progressVisible: false,
  progressData: [],
  addressForm: {
    address1: '',
    address2: ''
  },
  cityData,
  addressRules: {
      address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
  }
}),
created () {
  this.getOrderList()
},
 methods: {
  async getOrderList() {
    const { data: { data, meta } } = await this.$http.get('orders', {
        params: this.queryInfo
      })
     if (meta.status !== 200) {
        return this.$msg.error(meta.msg)
      }
      this.total = data.total
      this.orderlist = data.goods
   },
   handleSizeChange(newSize) {
     this.queryInfo.pagesize = newSize
     this.getOrderList()
   },
   handleCurrentChange(newPage) {
     this.queryInfo.pagenum = newPage
     this.getOrderList()
   },
   // 搜索订单
   searchOrder() {
     this.getOrderList()
   },
   // 修改地址弹窗
   addressUpdate() {
     this.addressVisible = true
   },
   addressDialogClosed() {
     this.$refs.addressFormRef.resetFields()
   },
   // 展示物流信息
  async showprogress() {
      const { data: { data, meta } } = await this.$http.get('/kuaidi/1106975712662')
      if (meta.status !== 200) {
        return this.$msg.error(meta.msg)
      }
      this.progressData = data

      this.progressVisible = true
      console.log(this.progressInfo)
   }
}
}
</script>
<style >
</style>