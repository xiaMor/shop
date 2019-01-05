<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread text1="权限管理" text2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-row>
      <el-col>
        <el-button type="success" plain class="btn">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roles" height="450" style="width: 100%">
      <el-table-column type="expand" width="160">
        <template slot-scope="scope">
          <el-row v-for="(item1) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="deleRole(scope.row, item1)"
                class="el-tag"
              >{{item1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    @close="deleRole(scope.row, item2)"
                    class="el-tag"
                  >{{item2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRole(scope.row, item3)"
                    class="el-tag"
                    closable
                    type="warning"
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <span>该角色未分配角色</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角名名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            circle
            @click="showRoles(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 权限列表对话框 -->
    <!-- data树形结构绑定的数据
    show-checkbox 是否支持选中
    node-key 每个节点唯一标识
    default-expanded-keys 默认展开 [想要展开的节点的id值]
    default-checked-keys 默认选中 [被选中的节点的id值]
    props:配置选项 {label,children}-->
    <el-dialog title="权限列表" :visible.sync="dialogVisible" width="50%">
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        :default-checked-keys="checked"
        node-key="id"
        ref="tree"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checked: [],
      roleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //点击确定按钮，更新用户权限
    async setRoles() {
      //获取更改后权限id列表

      //当前是半选状态的节点
      const arr1 = this.$refs.tree.getHalfCheckedKeys();
      //当前是全选状态的节点
      const arr2 = this.$refs.tree.getCheckedKeys();
      const arr = [...arr1, ...arr2];

      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: arr.join(",")
      });
      //   console.log(res);
      this.getRoles();
      this.dialogVisible = false;
    },
    //点击按钮，展示权限列表对话框
    async showRoles(rights) {
      //   console.log(rights);
      this.roleId = rights.id;
      this.dialogVisible = true;
      //发送请求，请求当前角色对应的权限列表
      const res = await this.$http.get(`rights/tree`);
      //   console.log(res);
      this.treeData = res.data.data;

      //打开对话框时，存id
      const tempArr = [];
      rights.children.forEach(item1 => {
        tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          });
        });
      });
      //   console.log(tempArr)
      this.checked = tempArr;
    },
    //删除角色对应的权限
    async deleRole(user, role) {
      // console.log(user)
      const res = await this.$http.delete(`roles/${user.id}/rights/${role.id}`);
      // console.log(res);
      user.children = res.data.data;
    },
    //获取角色列表
    async getRoles() {
      const res = await this.$http.get(`roles`);
      //   console.log(res);
      this.roles = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.btn {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-tag {
  margin: 5px;
}
</style>
