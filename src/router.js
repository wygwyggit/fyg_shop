import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/login.vue'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: Login
    }]
})
