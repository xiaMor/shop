//自定义http插件
import axios from 'axios'
const Http = {}
Http.install = function(Vue) {
    // 先配置基础路由
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

    axios.interceptors.request.use(function(config) {
        // config 1. headers 2. url
        // console.log(config.url); // rights/list

        if (config.url !== "login") {
            //判断非登录页，设置请求头
            const AUTH_TOKEN = localStorage.getItem("token");
            config.headers.Authorization = AUTH_TOKEN
        }


        // 在发送请求之前做些什么
        return config;
    }, function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });


    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default Http