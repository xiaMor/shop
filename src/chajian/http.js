//自定义http插件
import axios from 'axios'
const Http = {}
import {
    Message
} from 'element-ui';
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
    // 响应拦截器
    axios.interceptors.response.use(function(response) {
        // 对响应数据做点什么
        console.log("拦截器-------");

        console.log(response);
        const {
            meta: {
                msg,
                status
            }
        } = response.data;
        // 统一处理所有非200和201的响应->提示框->之前所有请求中的else都不用写了
        if (status !== 200 && status !== 201) {
            // 提示
            Message.warning(msg);
        }
        return response;
    }, function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });


    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default Http