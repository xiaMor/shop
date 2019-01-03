import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/user'


Vue.use(Router)

export default new Router({
    routes: [{
        name: 'home',
        path: '/',
        component: Home
    }, {
        name: 'login',
        path: '/login',
        component: Login
    }, {
        name: 'home',
        path: '/home',
        component: Home,
        children: [{
            name: 'user',
            path: '/user',
            component: User
        }]
    }]
})