<template>
 <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 步骤区域 -->
       <el-alert title="添加商品信息"  type="info"  center :closable="false"></el-alert>
        <el-steps  :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position='top'>
           <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                       <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                     <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                     </el-form-item>
                      <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" type="number"></el-input>
                      </el-form-item>
                      <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                      </el-form-item>
                       <el-form-item label="商品分类" prop="goods_cat">
                          <el-cascader props.expandTrigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
                          </el-cascader>
                     </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <!-- 渲染表单的Item项 -->
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <!-- 复选框组 -->
                           <el-checkbox-group v-model="item.attr_vals">
                              <el-checkbox v-for="(item,index) in item.attr_vals" :key="index" :label="item" border></el-checkbox>
                            </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id" >
                        <el-input v-model="item.attr_vals"></el-input>
                   </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      list-type="picture"
                      :headers="headersObj"
                      :on-success="uploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                   </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                  <quill-editor v-model="addForm.goods_introduce" class="quill"></quill-editor>
                  <!-- 添加商品的按钮 -->
                  <el-button type="primary" class="btnAdd" @click="add" >添加商品</el-button>
                </el-tab-pane>
              </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewImg" class="previewimg">
   </el-dialog>

 </div>
</template>
<script>
import _ from 'lodash'
  var validateNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('该项不能为空'))
        } else {
          if (value === 0) {
           callback(new Error('数值不能为0'))
          }
          callback()
        }
  }
export default {
data: () => ({
  activeIndex: '0',
   addForm: {
    goods_name: '',
    goods_price: 0,
    goods_weight: 0,
    goods_number: 0,
    // 商品所属的分类数组
    goods_cat: [],
    pics: [],
    goods_introduce: '',
    attrs: []
  },
  catelist: [],
  cateProps: {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children'
  },
  // 动态参数列表数据
   manyTableData: [],
  // 静态属性列表数据
  onlyTableData: [],
  // 图片上传地址
  uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
  // 图片上传手动指定请求头
  headersObj: {
    Authorization: sessionStorage.getItem('token')
  },
  previewImg: '',
  previewVisible: false,

  // 匹配规则
  addRules: {
      goods_name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' }
      ],
      goods_price: [
          { validator: validateNum, trigger: 'blur' }
        ],
        goods_weight: [
          { validator: validateNum, trigger: 'blur' }
        ],
        goods_number: [
          { validator: validateNum, trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
  }
}),
created () {
  // 获取分类数据
  this.getCateList()
},
computed: {
  cateId() {
    if (this.addForm.goods_cat.length === 3) {
      return this.addForm.goods_cat[2]
    }
    return null
  }
},
 methods: {
  async getCateList() {
      const { data: { data, meta } } = await this.$http.get('categories')
      if (meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.catelist = data
   },
   handleChange() {

   },
   // 当tab切换之前判断是否选择了分类
   beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$msg.error('请选择商品分类')
        return false
      }
   },
   // tab点击获取对应的参数或属性数据
   async tabClicked() {
     if (this.activeIndex === '1') {
       const data = await this.getParamsByType('many')
       if (!data) {
         this.$msg.error('获取数据失败')
       }
     } else if (this.activeIndex === '2') {
        const data = await this.getParamsByType('only')
       if (!data) {
         this.$msg.error('获取数据失败')
       }
     }
   },
   // 获取商品参数或属性
  async getParamsByType(type) {
    const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes`, {
       params: {
         sel: type
       }
     })
     if (meta.status !== 200) {
       return false
     } else {
       if (type === 'many') {
         // 将参数内的attr_vals转换为数组
          data.forEach(item => {
             item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(' ') : []
          })
          this.manyTableData = data
       } else if (type === 'only') {
          this.onlyTableData = data
       }
       return true
     }
   },
    // 图片预览
  handlePreview(file) {
    console.log(file)
     this.previewImg = file.response.data.url
     this.previewVisible = true
  },
  // 处理图片移除操作
  handleRemove(file) {
     const filePath = file.response.data.tmp_path
    const index = this.addForm.pics.findIndex(item => { return item.pic === filePath })
    this.addForm.pics.splice(index, 1)
    console.log(this.addForm)
  },
  uploadSuccess(res) {
     this.addForm.pics.push({ pic: res.data.tmp_path })
     console.log(this.addForm.pics)
  },
  add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$msg.error('请填写必要的表单项！')
        }
        const form = _.cloneDeep(this.addForm)
        console.log(form)

        form.goods_cat = form.goods_cat.join(',')

        this.manyTableData.forEach(item => {
          const mObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(mObj)
        })
        this.onlyTableData.forEach(item => {
          const oObj = {
            attr_id: item.attr_id, attr_value: item.attr_vals
          }
            this.addForm.attrs.push(oObj)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$msg.error('添加商品失败！')
        }

        this.$msg.success('添加商品成功！')
        this.$router.push('/goods')
      })
  }
}
}
</script>
<style lang="less" scoped>
.previewimg{
  width: 100%
}

</style>
