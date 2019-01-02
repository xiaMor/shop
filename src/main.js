// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入element-UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/index.css'
//导入自定义插件
import Http from './chajian/http'

import moment from 'moment'


Vue.config.productionTip = false
Vue.use(ElementUI);
//使用自定义插件
Vue.use(Http)

//声明一个全局过滤器,处理时间
Vue.filter('fmtDate', (v) => {
    return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})