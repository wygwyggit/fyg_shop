<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <!-- 警告区域 -->
       <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
         <!-- 选择商品分类区域 -->
       <el-row>
         <el-col>
           <span>选择分类</span>
            <!-- 选择商品分类的级联选择框 -->
            <el-cascader
                    props.expand-trigger="hover"
                    :options="cateList"
                    v-model="selectedCate"
                    :props="cascaderProps"
                    @change="selectedCateChange"
                    clearable
                    props.checkStrictly>
                  </el-cascader>
         </el-col>
       </el-row>
        <el-tabs v-model="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="动态参数" name="many">
               <el-button type="primary" size='mini' :disabled="isBtnDisabled" @click="addParams">添加参数</el-button>
               <el-table :data="manyTableData" style="width: 100%">
                  <el-table-column type="expand"></el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
                  <el-table-column >
                      <template v-slot:default='slotProps'>
                           <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(slotProps.row)">编辑</el-button>
                           <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(slotProps.row.attr_id)">  删除</el-button>
                      </template>
                 </el-table-column>
               </el-table>
               <!-- <my-table :data="manyTableData">
                 <template v-slot:default="slotProps">
                      <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                      <el-button type="error" icon="el-icon-delete" size="mini">  删除</el-button>
                 </template>
               </my-table> -->
           </el-tab-pane>
            <el-tab-pane label="静态属性"  name="only">
              <el-button type="primary" size='mini' :disabled="isBtnDisabled"  @click="addParams">添加属性</el-button>
              <el-table :data="onlyTableData" style="width: 100%">
                  <el-table-column type="expand"></el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
                  <el-table-column >
                      <template v-slot:default='slotProps'>
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(slotProps.row)">编辑</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(slotProps.row.attr_id)">  删除</el-button>
                      </template>
                 </el-table-column>
               </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 添加 -->
<el-dialog
  :title="'添加'+activeTitle"
  :visible.sync="addDialogVisible"
  @close='addParamsClose'
  width="50%">
  <el-form :model="addParamsForm" :rules="addParamsRule" ref="addParamsRef" label-width="100px" >
      <el-form-item :label="activeTitle" prop="attr_name">
        <el-input v-model="addParamsForm.attr_name"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='addParamsFn'>确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑 -->
<el-dialog
  :title="'编辑'+activeTitle"
  :visible.sync="editDialogVisible"
  @close='editParamsClose'
  width="50%">
    <el-form :model="editParamsForm" :rules="editParamsRule" ref="editParamsForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeTitle" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='editParamsFn'>确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
import myTable from '@/components/mytable.vue'
import { truncate } from 'fs'
import { async } from 'q'
export default {
data: () => ({
  cateList: [],
  selectedCate: [],
  cascaderProps: {
       value: 'cat_id',
        label: 'cat_name',
        children: 'children'
    },
    activeName: 'many',
    // 动态参数的数据
    manyTableData: [],
    // 静态属性的数据
    onlyTableData: [],
    // 控制添加弹窗
    addDialogVisible: false,
    // 控制编辑弹窗
    editDialogVisible: false,
    // 添加数据对象
    addParamsForm: {
       'attr_name': ''
    },
    addParamsRule: {
      attr_name: [
         { required: true, message: '请输入名称', trigger: 'blur' }
      ]
    },
    editParamsForm: {
      'attr_name': ''
    },
    editParamsRule: {
       attr_name: [
         { required: true, message: '请输入名称', trigger: 'blur' }
      ]
    }
}),
created () {
  this.getCategoriList()
},
computed: {
  isBtnDisabled () {
     if (this.selectedCate.length !== 3) {
       return true
     }
     return false
  },
  // 获取分类ID
  cateId () {
    if (this.selectedCate.length === 3) {
      return this.selectedCate[2]
    }
    return null
  },
  // 动态获取添加标题
  activeTitle () {
    if (this.activeName === 'many') {
      return '动态参数'
    } else {
      return '静态属性'
    }
  }
},
 methods: {
  async getCategoriList () {
      const { data: { data, meta } } = await this.$http.get('categories')
       if (meta.status !== 200) {
       return this.$msg.error(meta.msg)
     }
       this.cateList = data
   },
    // 级联选择框选中项变化，会触发这个函数
   async selectedCateChange () {
        // 判断是否选择的是三级分类
        if (this.selectedCate.length !== 3) {
          this.selectedCate = []
          return
        }
        console.log(this.selectedCate)
        // 发起请求
        this.getParamsData()
    },
    async getParamsData () {
       const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        if (meta.status !== 200) {
          return this.$msg.error('获取失败')
        }
        // 判断进行相对应的赋值数据
        if (this.activeName === 'many') {
          this.manyTableData = data
        } else if (this.activeName === 'only') {
          this.onlyTableData = data
        }
    },
    // tab栏切换
    tabHandleClick () {
      if (this.cateId === null) {
       this.$alert('请选择分类', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.getParamsData()
    },
    // 打开添加参数或属性窗口
    addParams () {
      this.addDialogVisible = true
    },
    // 添加参数或属性
     addParamsFn () {
       this.$refs.addParamsRef.validate(async valid => {
         if (!valid) return false
         const { data: { data, meta } } = await this.$http.post(`categories/${this.cateId}/attributes`, {
           attr_name: this.addParamsForm.attr_name,
           attr_sel: this.activeName
          })
        if (meta.status !== 201) {
          return this.$msg.error(meta.msg)
        }
        this.$msg.success(meta.msg)
        this.getParamsData()
        this.addDialogVisible = false
       })
    },
    // 关闭添加弹窗
    addParamsClose () {
      this.$refs.addParamsRef.resetFields()
    },
    // 编辑参数和属性
    editParams(role) {
       this.editParamsForm = role
       this.editDialogVisible = true
    },
    // 关闭编辑弹窗
    editParamsClose () {
       this.editParamsForm = {}
       this.$refs.editParamsForm.resetFields()
    },
    // 编辑参数或属性
    editParamsFn() {
       this.$refs.editParamsForm.validate(async valid => {
         if (!valid) return false
         const { data: { data, meta } } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
           attr_name: this.editParamsForm.attr_name,
           attr_sel: this.activeName
          })
        if (meta.status !== 200) {
          return this.$msg.error(meta.msg)
        }
        this.$msg.success(meta.msg)
        this.getParamsData()
        this.editDialogVisible = false
       })
    },
    // 删除参数或属性
    deleteParams(attrid) {
       this.$comfirm('此操作将该项永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
         const { data: { data, meta } } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
         if (meta.status !== 200) {
           return this.$msg.error(meta.msg)
         }
          this.$msg.success(meta.msg)
          this.getParamsData()
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    }
  }
  // components: {
  //    'my-table': myTable
  // }
}
</script>
<style lang="less" scoped>
.el-row{
  margin: 20px 0;
}
.el-cascader{
  width: 250px;
  margin-left: 20px;
}
</style>
