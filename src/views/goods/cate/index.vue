<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
      <el-row>
        <el-col>
            <el-button type="primary" @click='addCate'>添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 数据区 -->
      <zk-table :data="cateList" :columns="columns" border :show-row-hover="false" :expand-type="false" :selection-type="false" show-index index-text='#'>
         <template slot="isok" slot-scope='slotProps'>
              <i class="el-icon-success" v-if="slotProps.row.cat_deleted === false" style="color:#069"></i>
              <i class="el-icon-error" v-else style="color:red"></i>
         </template>
         <!-- 排序 -->
         <template slot="order"  slot-scope='slotProps'>
            <el-tag v-if="slotProps.row.cat_level === 0">一级分类</el-tag>
            <el-tag v-else-if="slotProps.row.cat_level === 1" type="success">二级分类</el-tag>
            <el-tag v-else type="warning">三级分类</el-tag>
         </template>
         <!-- 操作 -->
         <template slot="opt">
             <el-button type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size='mini' icon="el-icon-delete">删除</el-button>
         </template>
      </zk-table>
      <!-- 分页区 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>

   <!-- 添加分类 -->
    <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="40%"
        @close='closeAddCate'>
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
            <el-form-item label="上级分类">
              <!-- props 用来指定配置对象 -->
                  <el-cascader
                    props.expandTrigger="hover"
                    :options="parentCateList"
                    v-model="selectedCate"
                    :props="cascaderProps"
                    @change="selectedCateChange"
                    clearable
                    props.checkStrictly>
                  </el-cascader>
           </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCatefn">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    cateList: [],
    parentCateList: [],
    selectedCate: [],
    cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
    },
    columns: [
      {
        label: '分类名称',
        prop: 'cat_name'
      },
       {
            label: '是否有效',
            prop: 'cat_deleted',
            type: 'template',
            template: 'isok'
          },
           {
            label: '排序',
            prop: 'cat_level',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
    ],
    queryInfo: {
      type: 3,
      pagenum: 1,
      pagesize: 5
    },
    total: 0,
    addCateDialogVisible: false,
    addCateForm: {
      // 分类的父ID
      cat_pid: 0,
      // 分类的名称
      cat_name: '',
      // 分类的等级
      cat_level: 0
    },
    addCateFormRules: {
      cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    }
  }),
  created () {
    this.getcategoriList()
  },
  methods: {
   async getcategoriList () {
     const { data: { data, meta } } = await this.$http.get('categories', {
        params: this.queryInfo
      })
       if (meta.status !== 200) {
       return this.$msg.error(meta.msg)
     }
      this.cateList = data.result
      this.total = data.total
    },
    // 打开添加分类弹窗
    addCate () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 关闭添加分类弹窗
    closeAddCate() {
      this.$refs.addCateRef.resetFields()
      this.selectedCate = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
       // 获取父级分类的数据列表
    async getParentCateList () {
      this.nprogress.start()
      const { data: { data, meta } } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (meta.status !== 200) {
         this.$message.error('获取父级分类数据失败！')
      } else {
         this.parentCateList = data
      }
        this.nprogress.done()
    },
    selectedCateChange () {
        console.log(this.selectedCate)
        if (this.selectedCate.length) {
          this.addCateForm.cat_pid = this.selectedCate[this.selectedCate.length - 1]
          this.addCateForm.cat_level = this.selectedCate.length
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getcategoriList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
       this.getcategoriList()
    },
    // 添加分类
    addCatefn () {
      console.log(this.addCateForm)
      // 校验数据
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return false
        const { data: { data, meta } } = await this.$http.post('categories', this.addCateForm)
        if (meta.status !== 201) {
          return this.$msg.error(meta.msg)
        }
        this.$msg.success('添加分类成功')
        this.getcategoriList()
        this.addCateDialogVisible = false
      })
    }
  }
}
</script>
<style lang="less">
.zk-table{
  margin:20px 0;
}
.el-cascader{
  width: 100%;
}
</style>
