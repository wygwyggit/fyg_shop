<template>
  <div class="login_wrap">
    <!-- header start -->
    <div class="login_header">
      <div class="logo">
        <img src="../../assets/images/logo.png">
        项目后台管理系统
      </div>
    </div>
    <!-- header end -->
     <!-- main start -->
      <div class="login_content">
        <div class="word">
          传智播客
          <br>
          黑马程序员
        </div>
         <!-- login from start -->
       <div class="login_box">
        <!-- title -->
          <div class="login_title">
            项目后台管理系统
          </div>
          <!-- input -->
          <el-form label-width="0" class="login_Form" :rules="form_rules" :model="loginForm" ref="elForm">
            <el-form-item prop="username">
            <el-input placeholder="请输入用户名" class="ipt" v-model="loginForm.username">
              <template slot="prepend">
                <span class="user_icon icon"></span>
              </template>
            </el-input>
            </el-form-item>
            <el-form-item prop='password'>
              <el-input placeholder="请输入密码" class="ipt" v-model="loginForm.password" type="password" @keyup.enter.native="onEnterLogin">
              <template slot="prepend" >
                <span class="pass_icon icon"></span>
              </template>
            </el-input>
            </el-form-item>
            <el-form-item class="item">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- login from end -->
     </div>
     <!-- main end -->
     <!-- footer start -->
     <div class="footer">
       <p>版权所有：传智播客&黑马程序员（推荐使用谷歌浏览器，可以获得更佳操作页面体验） 技术支持：wyg</p>
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
         { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 8 个字符', trigger: 'blur' }
      ],
      password: [
         { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    // 重置信息
    reset () {
      this.$refs.elForm.resetFields()
    },
    // 登陆
    login () {
         this.$refs.elForm.validate(async valid => {
           if (!valid) return false
           // 开启进度条
           this.nprogress.start()
          const { data: { data, meta } } = await this.$http.post('login', this.loginForm)
          if (meta.status === 200) {
            // 浏览器保存token值
            window.sessionStorage.setItem('token', data.token)
            this.nprogress.done()
            this.$router.push('/home')
          } else {
              this.$msg.error('登陆失败')
                // 结束进度条
               this.nprogress.done()
          }
         })
    },
    onEnterLogin () {
      this.login()
    }
  }
}
</script>
<style lang="less" scoped>
 @import "login.less";
</style>
