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
        <el-menu default-active="2" router :unique-opened="true">
          <!-- 菜单 -->
          <el-submenu :index="''+item1.order" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item index="user" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
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
  data() {
    return {
      menus: []
    }
  },
  // beforeCreate() {
  //   //在创建之前先验证是否可以查看首页
  //   if (!localStorage.getItem("token")) {
  //     //如果没有，则没有登录
  //     this.$router.push({
  //       name: "login"
  //     });
  //     this.$message.warning("请先登录");
  //   }
  // },
  created() {
    this.getMenus()
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res)
      this.menus = res.data.data
    },
    //退出
    loginOut() {
      //清除localStorage
      localStorage.clear();
      //改标识到登录页
      this.$router.push({ 
        name: "login"
      });
      //提示
      this.$message.success("退出成功");
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
