import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import './plugins/element'
import './assets/css/index.less'

import 'nprogress/nprogress.css'
import './assets/fonts/iconfont.css'
import './api/index.js'
import ZkTable from 'vue-table-with-tree-grid'
Vue.component(ZkTable.name, ZkTable)
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')