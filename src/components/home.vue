<template>
  <el-container class="home-warp">
    <el-header class="header">
      <el-col :span="4">
        <img src="@/assets/logo.png" alt>
      </el-col>
      <el-col :span="18">
        <h2>电商后台管理系统</h2>
      </el-col>
      <el-col :span="1">
        <a href="#" @click.prevent="loginOut()">退出</a>
      </el-col>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        
        <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened>
            <!-- 菜单一 -->
           <el-submenu index="1">
            <template slot="title" @click="getUser()">
              <i class="el-icon-star-on"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
           <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>

            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
           <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
             <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
             <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
           <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>订单管理</span>
            </template>

            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
           <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>数据统计</span>
            </template>

            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>       
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate() {
    //在创建之前先验证是否可以查看首页
    if(!localStorage.getItem('token')) {
      //如果没有，则没有登录
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('请先登录')
    }
  },
  methods: {
    
    //退出
    loginOut() {
      //清除localStorage
      localStorage.clear();
      //改标识到登录页
      this.$router.push({
        name: 'login'
      })
      //提示
      this.$message.success('退出成功')
    }
  }
};
</script>

<style>
.home-warp {
  height: 100%;
}
.header {
  background-color: #bbb;
}
.header h2 {
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.header a {
  text-decoration: none;
  line-height: 60px;
}

</style>
