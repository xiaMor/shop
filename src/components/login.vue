<template>
  <div class="login-warp">
    <el-form label-position="top" label-width="80px" :model="formdata" class="form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return{
      formdata: {
        username:'',
        password:''
      }
    }
  },
  methods: {
    //利用es7  await和asycn关键字将异步操作的结果像同步操作展示
    async handleLogin() {
      const res = await this.$http.post('login',this.formdata) 
      // this.$http.post('login',this.formdata).then((res)=>{})    
        const {data:{data,meta:{msg,status}}} = res;
        if(status == 200) {
          //当登录成功时，保存token的值
          localStorage.setItem('token', data.token);
          this.$router.push({
            name: 'home'
          })
        } else {
          this.$message.warning(msg)
        }
    }
  }
}
</script>

<style>
.login-warp {
 height: 100%;
 background-color: #324152;
 display: flex;
 justify-content:center;
 align-items: center;
}
.login-warp .form {
  width: 500px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}
.btn {
  width: 100%;
}
</style>
