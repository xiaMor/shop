<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <!-- 在此处发现所有页面都要用面包屑，所有自定义全局组件 -->
    <my-bread text1="权限管理" text2="权限列表"></my-bread>
    <!-- 添加按钮 -->
    <el-row class="info">
      <el-col>
        <el-button type="success" plain>信息按钮</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" height="450" border style="width: 100%">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope="scope">
              <span v-if="scope.row.level ==='0'">一级</span>
              <span v-if="scope.row.level ==='1'">二级</span>
              <span v-if="scope.row.level ==='2'">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
     this.getRights()
  },
  methods: {
     async getRights() {
         const res = await this.$http.get('rights/list')
        //  console.log(res);此处并未拿到数据，需要统一设置请求头
        // console.log(res)
        const {data,meta:{msg,status}} = res.data
        if(status == 200) {
            this.tableData = data;
            // console.log(this.tableData)
        }
     }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.info {
  margin-top: 20px;
  margin-bottom: 15px;
}
</style>
