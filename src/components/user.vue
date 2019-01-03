<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row>
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="primary" @click="showAddUser()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="100"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="160"></el-table-column>
      <el-table-column label="创建日期" width="160">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="160">
        <!-- 单元格里如果不是普通的字符串，需要加template容器 -->
        <template slot-scope="scope">
          <!-- 此处的scope指向的是tableData 此处需要从外层向里传递数据-->
          <!-- scope.row.mg_state是每一条数据里的属性mg_state -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="userState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            circle
            @click="showEditUser(scope.row)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain circle @click="showUserState(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            circle
            @click.prevent="deleUser(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          {{currUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currUserRole">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      formLabelWidth: "120px",
      currUserName: '',
      currUserRole: -1,
      roles: [],
      currentId:-1
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    //设置角色
    async setRole() {
      //该请求需要两个值，用户id，和角色id
      const res = await this.$http.put(`users/${this.currentId}/role`, {rid:this.currUserRole});
      // console.log(res)
      const {meta:{msg,status}} = res.data;
      if(status == 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
      this.dialogFormVisibleRole = false;
    },
    //显示角色分配对话框
    async showUserState(user) {
       this.dialogFormVisibleRole = true;
       this.currUserName=user.username;
      //  用户id
       this.currentId=user.id;
       //请求所有角色
       const res = await this.$http.get('roles');
        this.roles = res.data.data
        //根据用户id查询角色
        const res2 = await this.$http.get(`users/${this.currentId}`);
        this.currUserRole = res2.data.data.rid;
    },
    //修改用户状态
    async userState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    //点击确定按钮，更改数据
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`);
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status == 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      this.dialogFormVisibleEdit = false;
    },
    //点击展示编辑页面
    showEditUser(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
    },
    //点击展示删除
    deleUser(user) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //此处为点确定
          const res = await this.$http.delete(`users/${user.id}`);
          // console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status == 200) {
            this.$message.success("删除成功");
            this.pagenum = 1;
            this.getUser();
          }
        })
        .catch(() => {
          //此处为点取消
          this.$message.warning("已取消删除");
        });
    },
    //搜索
    searchUser() {
      this.pagenum = 1;
      this.getUser();
    },
    //添加用户
    async addUser() {
      const res = await this.$http.post("users", this.form);
      //   console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status == 201) {
        //关闭窗口
        this.dialogFormVisibleAdd = false;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    //展示添加用户页面
    showAddUser() {
      //名称展示添加页面时，清空表单
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //分页所需方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUser();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUser();
    },
    async getUser() {
      //   在发起请求(除了登录之外的)之前 需要设置请求头
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(`users?
        query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      //   console.log(res);
      const {
        data: { users, total },
        meta: { status, msg }
      } = res.data;
      if (status == 200) {
        this.tableData = users;
        this.total = total;
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
