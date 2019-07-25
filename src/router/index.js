import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/login.vue'
import Home from '../views/home'
import Welcome from '../views/home/welcome/welcome.vue'
import Users from '../views/home/users'
import Rights from '../views/power/rights'
import Roles from '../views/power/roles'
import Cate from '../views/goods/cate'
import Params from '../views/goods/params'
import List from '../views/goods/list'
import Add from '../views/goods/add'
import Orders from '../views/orders'
import Reports from '../views/reports'
import { root } from 'postcss-selector-parser'
// 导入进度条模块
import NProgress from '../plugins/nprogress.js'
Vue.use(Router)

const router = new Router({
        mode: 'history',
        routes: [{
            path: '/',
            redirect: '/home'
        }, {
            path: '/login',
            component: Login
        }, {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [{
                path: '/welcome',
                component: Welcome
            }, {
                path: '/users',
                component: Users
            }, {
                path: '/rights',
                component: Rights
            }, {
                path: '/roles',
                component: Roles
            }, {
                path: '/categories',
                component: Cate
            }, {
                path: '/params',
                component: Params
            }, {
                path: '/goods',
                component: List
            }, {
                path: '/goods/add',
                component: Add
            }, {
                path: '/orders',
                component: Orders
            }, {
                path: '/reports',
                component: Reports
            }]
        }]
    })
    // 设置导航守卫拦截判断管理员是否登陆
    // 打开进度条
router.beforeEach((to, from, next) => {
        if (to.path === '/login') return next()
        const tokenStr = sessionStorage.getItem('token')
        if (!tokenStr) return next('/login')
            // NProgress.start()
        next()
    })
    // 路由结束关闭进度条
router.afterEach(transition => {
    // NProgress.done()
    console.log(transition)
})
export default router