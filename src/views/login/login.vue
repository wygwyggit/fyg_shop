<template>
  <div class="login_wrap">
    <!-- 管理员登陆区域 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="./images/logo.png" alt="">
      </div>
       <!-- 表单区域 -->
       <el-form label-width="0" class="login_Form" :rules="form_rules" :model="loginForm" ref="elForm">
        <el-form-item prop="username">
         <el-input placeholder="请输入用户名" class="ipt" v-model="loginForm.username">
          <template slot="prepend">
            <span class="user_icon icon"></span>
          </template>
        </el-input>
        </el-form-item>
         <el-form-item >
          <el-input placeholder="请输入密码" class="ipt" v-model="loginForm.password" type="password">
          <template slot="prepend" >
            <span class="pass_icon icon"></span>
          </template>
        </el-input>
        </el-form-item>
         <el-form-item class="item">
           <el-button type="primary">登录</el-button>
           <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
       </el-form>
    </div>
  </div>
</template>
<script>

export default {
  name: 'login',
  data: () => ({
    loginForm: {
      username: '',
      password: ''
    },
    form_rules: {
      username: [
         { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    reset () {
      this.$refs.elForm.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
 @import "login.less";
</style>
