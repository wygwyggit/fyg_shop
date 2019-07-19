<template>
  <el-container>
  <el-header>
     <div>
         <img src="../../assets/images/logo.png">
         <i class="iconfont iconfenlei1" @click='changeCollapse'></i>
         <span >电商后台管理系统</span>
     </div>
     <!-- <div class="user_drop">

     </div> -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img src="./images/default.jpg" alt="">
        </span>
       <el-dropdown-menu slot="dropdown" placement="top">
          <el-dropdown-item>管理员中心</el-dropdown-item>
          <el-dropdown-item  command="loginout">退出系统</el-dropdown-item>
       </el-dropdown-menu>
    </el-dropdown>
      <!-- <el-button type="info" @click="loginout">退出</el-button></el-header> -->
  </el-header>
  <el-container>
    <el-aside :width="width">
      <el-menu
      background-color="#001529"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
      >
       <!-- 一级菜单 -->
      <el-submenu :index="menu.id+''" v-for='menu in menuList' :key="menu.id">
        <template slot="title">
          <i :class="iconObj[menu.id]"></i>
          <span>{{menu.authName}}</span>
        </template>
         <!-- 二级菜单 -->
         <el-menu-item :index="'/'+subMenu.path" v-for="subMenu in menu.children" :key="subMenu.id" @click="getPath('/'+subMenu.path)">
           <i class="iconfont iconleimupinleifenleileibie"></i>
           <span>{{subMenu.authName}}</span>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
    </el-container>
</template>
<script>
import { isContext } from 'vm'
export default {
  name: 'home',
  data: () => ({
    menuList: [],
    isCollapse: false,
    iconObj: {
      '125': 'iconfont iconhuiyuan21',
      '103': 'iconfont iconquanxian',
      '101': 'iconfont iconshangpin-tianchong',
      '102': 'iconfont icondingdan',
      '145': 'iconfont icontianchongxing-'
    },
    activePath: sessionStorage.getItem('activePath') || ''
  }),
  computed: {
    width () {
      return this.isCollapse ? '64px' : '200px'
    }
  },
  created () {
    // 获取左侧导航菜单项
    this.getMenuList()
  },
  methods: {
    loginout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      // 开启进度条
       this.nprogress.start()
      const { data: { data, meta } } = await this.$http.get('menus')
     if (meta.status !== 200) {
       this.$msg.error(meta.msg)
     } else {
       this.menuList = data
     }
      // 关闭进度条
      this.nprogress.done()
    },
    // 折叠菜单栏
    changeCollapse () {
      this.isCollapse = !this.isCollapse
    },
   handleCommand (command) {
     if (command === 'loginout') {
       this.loginout()
     }
   },
   getPath (path) {
      sessionStorage.setItem('activePath', path)
   }
  }
}
</script>
<style lang="less" scoped>
 @import "index.less";
</style>
