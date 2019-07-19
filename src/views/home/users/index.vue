<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 列表展示主体区域 -->
     <el-card class="box-card">
       <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容"  class="input-with-select"  clearable @clear='getUsers' v-model="queryinfo.query" >
               <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
             </el-input>
          </el-col>
         <el-col :span="4"><el-button type="primary" @click="addDialogVisible = true">添加管理员</el-button></el-col>
       </el-row>
        <el-table :data="users" style="width: 100%" border stripe>
            <el-table-column prop="username"    label="姓名" width="180"></el-table-column>
            <el-table-column prop="email"       label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile"      label="手机"></el-table-column>
            <el-table-column prop="role_name"   label="角色"></el-table-column>
            <el-table-column prop="create_time" label="创建时间">
            </el-table-column>
                <el-table-column label="状态">
                  <!-- 自 2.6.0 起有所更新。已废弃的使用 slot-scope -->
                  <template v-slot:default="slotProps">
                    <el-switch v-model="slotProps.row.mg_state" @change="usChange(slotProps.row)"></el-switch>
                  </template>
            </el-table-column>
            <el-table-column label="操作">
                  <template >
                      <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                       <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
                              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                      </el-tooltip>
                  </template>
            </el-table-column>
        </el-table>
       <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
     </el-pagination>
    </el-card>
    <!-- 添加管理员对话框 -->
    <el-dialog
    title="添加管理员"
    :visible.sync="addDialogVisible"
    width="45%"
    @close='addDialogClosed'>
      <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="80px"  >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" maxlength='11'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addUser'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { async } from 'q'
// 自定义邮箱检验
const checkEmail = (rule, value, cb) => {
   const reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
   if (reg.test(value)) {
     return cb()
   }
   cb(new Error('请输入合法邮箱'))
}
// 自定义手机检验
const checkMobile = (rule, value, cb) => {
   const reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
   if (reg.test(value)) {
     return cb()
   }
   cb(new Error('请输入合法手机号'))
}
export default {
  data: () => ({
    users: [],
    total: 0,
    queryinfo: {
      query: '',
      pagenum: 1,
      pagesize: 5
    },
    addDialogVisible: false,
    addForm: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    // 检验表单规则
    addFormRule: {
     username: [
         { required: true, message: '请输入用户名', trigger: 'blur' },
         { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
     ],
      password: [
         { required: true, message: '请输输入密码', trigger: 'blur' },
         { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
     ],
     email: [
       { required: true, message: '请输输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
     ],
     mobile: [
         { required: true, message: '请输输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
     ]
    }
  }),
  created () {
    this.getUsers()
  },
  methods: {
    // 发送请求获取用户数据
     async getUsers () {
        this.nprogress.start()
        const { data: { data: { users, total }, meta } } = await this.$http.get('users', {
          params: this.queryinfo
        })
        // 失败弹框，成功赋值给data
        if (meta.status !== 200) {
           this.$msg.error(meta.msg)
        } else {
           this.users = users
           this.total = total
        }
        this.nprogress.done()
      },
      // 修改每一页显示的总条数
      handleSizeChange (newsize) {
         this.queryinfo.pagesize = newsize
         this.getUsers()
      },
      // 跳转到哪一页
      handleCurrentChange (newcurrent) {
          this.queryinfo.pagenum = newcurrent
          this.getUsers()
      },
      // 更改管理员状态
     async usChange (userinfo) {
        const { data: { meta } } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        // 失败前端UI状态取反
        if (meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$msg.error(meta.msg)
        }
     },
     // 关闭添加管理员弹框重置
     addDialogClosed () {
       this.$refs.addForm.resetFields()
     },
     // 添加管理员
     addUser () {
       this.$refs.addForm.validate(async valid => {
         if (!valid) return
         this.nprogress.start()
         const { data: { meta } } = await this.$http.post('users', this.addForm)
         if (meta.status !== 201) {
           this.$msg.error('添加管理员失败')
         } else {
            this.$msg.success('添加成功')
         }
          this.nprogress.done()
          this.addDialogVisible = false
       })
     }
  }
}
</script>
<style >
</style>