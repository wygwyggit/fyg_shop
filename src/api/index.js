import Vue from 'vue'
import axios from 'axios'
import NProgress from '../plugins/nprogress.js'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
    NProgress.start()
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.prototype.nprogress = NProgress