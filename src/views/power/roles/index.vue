<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
   </el-breadcrumb>
   <el-card>
     <el-row>
       <el-col>
          <el-button type="primary" @click="addrole">添加角色</el-button>
       </el-col>
     </el-row>
      <el-table :data="rolelist" style="width: 100%" border stripe>
          <el-table-column type="expand" >
            <template  v-slot:default='slotProps'>
               <el-row v-for='(item1, i1) in slotProps.row.children' :key="item1.id" :class="['bbot',{btop:i1 === 0},'vcenter']">
                 <el-col :span='4' >
                    <el-tag>{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                 </el-col>
                  <el-col :span='20'>
                    <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'btop','vcenter']">
                        <el-col :span="6" >
                            <el-tag type="success">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                         <el-col :span="18">
                            <el-tag type="warning" v-for='item3 in item2.children' :key="item3.id" closable @close='removeRole(slotProps.row,item3.id)'>{{item3.authName}}</el-tag>
                         </el-col>
                    </el-row>
                  </el-col>

               </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"   width="180"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column  label="操作">
            <template v-slot:default='slotProps'>
              <el-button size='mini' type="primary" icon="el-icon-edit" @click="editRole(slotProps.row)">编辑</el-button>
              <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteRole(slotProps.row.id)">删除</el-button>
              <el-button size='mini' type="warning" icon="el-icon-setting" @click="setRight(slotProps.row)">分配权限</el-button>
            </template>
          </el-table-column>
    </el-table>
   </el-card>
   <!-- 分配权限弹窗 -->
   <el-dialog title="分配权限" :visible.sync="rightdialogVisible" width="50%" @close='closeSetRights'>
     <el-tree :data="rightslist" :props="defaultProps"  show-checkbox default-expand-all node-key="id" ref="treeRef" :default-checked-keys="defaultkeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitRight">确 定</el-button>
      </span>
   </el-dialog>
   <!-- 添加和编辑角色 -->
   <el-dialog
      :title="title+'角色'"
      :visible.sync="addeiditDialogVis"
      width="50%"
      @close='closeFormDia'>
     <el-form :model="roleForm" :rules="roleRule" ref="roleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addeiditDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { truncate } from 'fs'
import { async } from 'q'
export default {
  data: () => ({
    // 所有角色数据
    rolelist: [],
    // 控制分配权限的显示与隐藏
    rightdialogVisible: false,
    // 所有权限数据
    rightslist: [],
    defaultProps: {
          children: 'children',
          label: 'authName'
    },
    // 用户默认有的权限数组
    defaultkeys: [],
    // 编辑的角色ID
    roleId: '',
    title: '',
    addeiditDialogVis: false,
    // 添加编辑表单数据绑定
    roleForm: {
      roleName: '',
      roleDesc: ''
    },
    // 添加和编辑表单匹配规则
    roleRule: {
      roleName: [
         { required: true, message: '请输入角色名称', trigger: 'blur' }
      ],
      roleDesc: []
    }
  }),
  created () {
    this.getRoleList()
  },
  methods: {
   async getRoleList () {
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
    // 分配用户权限
   async setRight (role) {
         this.rightdialogVisible = true
         this.roleId = role.id
       // 获取所有权限列表
          this.nprogress.start()
          const { data: { data, meta } } = await this.$http.get('rights/tree')
          if (meta.status !== 200) {
            this.$msg.error(meta.msg)
          } else {
            this.rightslist = data

            this.getUserRight(role, this.defaultkeys)
             console.log(this.defaultkeys)
          }
          this.nprogress.done()
    },
    // 递归查找最下面的权限ID，push到数组
    getUserRight (node, arr) {
     if (!node.children) return arr.push(node.id)
     node.children.forEach(element => {
      this.getUserRight(element, arr)
     })
   },
   // 关闭分配权限清空权限ID数组
   closeSetRights () {
     this.defaultkeys = []
   },
   // 确定更改角色权限
  async commitRight () {
     const keys = [
       ...this.$refs.treeRef.getCheckedKeys(),
       ...this.$refs.treeRef.getHalfCheckedKeys()
     ]
      const keyStr = keys.join(',')
      this.nprogress.start()
     const { data: { meta } } = await this.$http.post(`roles/${this.roleId}/rights`, {
       rids: keyStr
     })
     if (meta.status !== 200) {
        this.$msg.error(meta.msg)
     } else {
       this.$msg.success('成功')
       this.getRoleList()
       this.rightdialogVisible = false
     }
      this.nprogress.done()
   },
    // 删除角色的权限
   async removeRole (role, rightId) {
      const confirmResult = await this.$comfirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
       if (confirmResult === 'confirm') {
          this.nprogress.start()
          const { data: { data, meta } } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (meta.status !== 200) {
            this.$msg.error('操作失败')
          } else {
            this.$msg.success('修改角色权限成功')
            role.children = data
          }
          this.nprogress.done()
       }
     },
     // 添加角色
     addrole() {
       this.title = '添加'
       this.addeiditDialogVis = true
     },
     // 编辑按钮打开弹窗
     editRole(role) {
       console.log(role)
       this.roleId = role.id
       this.roleForm.roleName = role.roleName
       this.roleForm.roleDesc = role.roleDesc
       this.title = '编辑'
       this.addeiditDialogVis = true
     },
     // 确定添加或编辑角色
      saveRole() {
         this.$refs.roleRef.validate(async valid => {
            if (!valid) {
              return false
            }
        if (this.title === '添加') {
                  const { data: { data, meta } } = await this.$http.post('roles', this.roleForm)
                  if (meta.status !== 201) {
                    return this.$msg.error(meta.msg)
                  }
              } else if (this.title === '编辑') {
                  const { data: { data, meta } } = await this.$http.put(`roles/${this.roleId}`, this.roleForm)
                  if (meta.status !== 200) {
                    return this.$msg.error(meta.msg)
                  }
        }
        this.$msg.success('操作成功')
        this.getRoleList()
        // 关闭弹窗
        this.addeiditDialogVis = false
         })
     },
     // 删除角色
     deleteRole(roleid) {
       this.$comfirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送请求
          const { data: { data, meta } } = await this.$http.delete(`roles/${roleid}`)
          if (meta.status !== 200) {
            return this.$msg.error(meta.msg)
          }
          this.$msg.success('操作成功')
          this.getRoleList()
        }).catch(() => {
        })
     },
     // 添加编辑角色对话框关闭
     closeFormDia() {
       this.$refs.roleRef.resetFields()
     }
  }

}
</script>
<style lang="less" scoped>
.el-tag{
  margin:8px;
}
.btop{
  border-top: 1px solid #EBEEF5;
}
.bbot{
  border-bottom: 1px solid #EBEEF5;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
