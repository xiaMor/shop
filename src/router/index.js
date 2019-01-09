import Vue from 'vue'
import VueRouter from 'vue-router'
// 懒加载写法 ->
// const Foo = () =>
//     import ('./Foo.vue')
const Login = () =>
    import ('@/components/login')
const Home = () =>
    import ('@/components/home')
const User = () =>
    import ('@/components/user')
const Rights = () =>
    import ('@/components/rights')
const Roles = () =>
    import ('@/components/roles')
const Goods = () =>
    import ('@/components/goodslist')
const Goodsadd = () =>
    import ('@/components/goodsadd')
const Params = () =>
    import ('@/components/params')
const Goodscate = () =>
    import ('@/components/goodscate.vue')
const Orders = () =>
    import ('@/components/order.vue')
const Report = () =>
    import ('@/components/report.vue')

// 单独引入组件
import {
    Message
} from 'element-ui';

Vue.use(VueRouter)

const router = new VueRouter({
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
                path: '/users',
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
            },
            {
                name: 'goods',
                path: '/goods',
                component: Goods
            }, {
                name: 'goodsadd',
                path: '/goodsadd',
                component: Goodsadd
            }, {
                name: 'params',
                path: '/params',
                component: Params
            }, {
                name: 'categories',
                path: '/categories',
                component: Goodscate
            },
            {
                name: 'orders',
                path: '/orders',
                component: Orders
            },
            {
                name: 'reports',
                path: '/reports',
                component: Report
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
            router.push({
                name: 'login'
            })
        } else {
            next()
        }
    }
})

export default router;