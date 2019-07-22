// 后台请求API文件
import Vue from 'vue'
import axios from 'axios'
import NProgress from '../plugins/nprogress.js'
// 配置后台基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 请求拦截 （判断用户是否登陆，请求安全设置token,只有请求头中有token才能调用数据API）
axios.interceptors.request.use(function(config) {
    NProgress.start()
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(function(response) {
        NProgress.done()
        return response
    })
    // 全局给Vue挂载原型，所有Vue实例都能使用
Vue.prototype.$http = axios
Vue.prototype.nprogress = NProgress