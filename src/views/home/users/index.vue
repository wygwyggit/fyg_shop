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
            <el-table-column prop="username"    label="用户名" width="180"></el-table-column>
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
                  <template v-slot:default="slotProps">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(slotProps.row)"></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(slotProps.row.id)" ></el-button>
                       <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false" >
                              <el-button type="warning" icon="el-icon-setting" size="mini" @click="fppower(slotProps.row)"></el-button>
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

    <!-- 编辑管理员 -->
        <el-dialog
      title="编辑管理员"
      :visible.sync="editDialogVisible"
      width="50%" @close='editDialogClosed'>
      <el-form :model="editForm" :rules="editFormRule" ref="editForm" label-width="80px"  >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile" maxlength='11'></el-input>
            </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserfn">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 分配权限 -->
        <el-dialog
      title="分配角色"
      :visible.sync="fqDialogVisible"
      width="40%"
      @close='closefp'>
       <div>
        <p class="p_item">当前的用户：{{currentUser.username}}</p>
        <p class="p_item">当前的角色：<span class="powerTxt">{{currentUser.role_name}}</span></p>
        <p class="p_item">分配新角色：
              <el-radio v-for="data in rolelist" :label="data.id" :key="data.id" v-model="roleId" >{{data.roleName}} </el-radio >
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fqDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUserPower">确 定</el-button>
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
    editDialogVisible: false,
    fqDialogVisible: false,
    addForm: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    editForm: {},
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
    },
     // 检验表单规则
    editFormRule: {
     username: [
         { required: true, message: '请输入用户名', trigger: 'blur' },
         { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
     ],
     email: [
       { required: true, message: '请输输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
     ],
     mobile: [
         { required: true, message: '请输输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
     ]
    },
    // 当前分配角色的用户数据
    currentUser: {},
    rolelist: [],
    roleId: '',
    // 分配权限的ID
    userId: ''

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
     },
     // 关闭编辑管理员弹窗重置
     editDialogClosed () {
        this.$refs.editForm.resetFields()
     },
     // 编辑管理员信息显示信息
     editUser (info) {
       this.editDialogVisible = true
       this.editForm = {
         id: info.id,
         username: info.username,
         email: info.email,
         mobile: info.mobile
       }
     },

     // 编辑管理员信息
    async editUserfn () {
      this.nprogress.start()
       const { data: { meta } } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (meta.status !== 200) {
          this.$msg.error(meta.msg)
          this.getUsers()
        } else {
           this.$msg.success(meta.msg)
        }
         this.editDialogVisible = false
         this.nprogress.done()
     },
     // 删除管理员
     delUser (id) {
       this.$comfirm('此操作将永久删除该管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           this.nprogress.start()
          const { data: { data, meta } } = await this.$http.delete('users/' + id)
          if (meta.status !== 200) {
            this.$msg.error(meta.msg)
          } else {
            this.getUsers()
            this.$msg.success(meta.msg)
            this.nprogress.done()
          }
        }).catch(() => {
          this.$msg({
            type: 'info',
            message: '已取消删除'
          })
        })
     },
     // 分配角色
    async fppower (role) {
       this.fqDialogVisible = true
       this.currentUser = role
       this.userId = role.id
       this.nprogress.start()
       const { data: { data, meta } } = await this.$http.get('roles')
        if (meta.status !== 200) {
          this.$msg.error(meta.msg)
        } else {
          console.log(data)
          this.rolelist = data
        }
        this.nprogress.done()
     },
     // 修改用户角色
    async changeUserPower () {
       // 如果没有修改角色不发起请求
       if (!this.roleId) {
         this.$msg.info('该管理员未修改角色')
         this.fqDialogVisible = false
         return
       }
        this.nprogress.start()
        const { data: { data, meta } } = await this.$http.put(`users/${this.userId}/role`, {
          rid: this.roleId
        })
        if (meta.status !== 200) {
          this.$msg.error(meta.msg)
        } else {
          // 刷新数据
          this.getUsers()
          this.fqDialogVisible = false
           this.$msg.success(meta.msg)
        }
        this.nprogress.done()
     },
     // 关闭分配角色弹框恢复单选框
     closefp () {
       this.roleId = ''
     }
  }
}
</script>
<style lang="less" scoped>
.p_item{
  line-height: 40px;
}
.powerTxt{
  display: inline-block;
  padding: 0 6px;
  line-height: 30px;
  border-radius: 3px;
  background-color: #001529;
  color: #fff;
  font-size: 12px;
}
</style>
