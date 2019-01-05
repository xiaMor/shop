import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'
import Rights from '@/components/rights'
import Roles from '@/components/roles'
import { Message } from 'element-ui';



Vue.use(Router)

const router = new Router({
    routes: [{
        name: 'login',
        path: '/login',
        component: Login
    }, {
        name: 'home',
        path: '/',
        component: Home,
        children: [{
                name: 'user',
                path: '/user',
                component: User
            },
            {
                name: 'rights',
                path: '/rights',
                component: Rights
            }, {
                name: 'roles',
                path: '/roles',
                component: Roles
            }
        ]
    }]
})

router.beforeEach((to, from, next) => {
    // to: Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
    if (to.name == 'login') {
        next()
    } else {
        const token = localStorage.getItem('token');
        if (!token) {
            Message.warning('请先登录')
        } else {
            next()
        }
    }
})

export default router;