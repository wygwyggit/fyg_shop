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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component(ZkTable.name, ZkTable)

Vue.config.productionTip = false

// 全局过滤器 处理时间
Vue.filter('dataFormat', (originVal) => {
        const dt = new Date(originVal)

        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        const d = (dt.getDate() + '').padStart(2, '0')

        const hh = (dt.getHours() + '').padStart(2, '0')
        const mm = (dt.getMinutes() + '').padStart(2, '0')
        const ss = (dt.getSeconds() + '').padStart(2, '0')

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    })
    // 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')