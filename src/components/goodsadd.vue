<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread text1="商品管理" text2="商品列表"></my-bread>
    <!-- 提示框 -->
    <el-alert title="添加商品信息" type="info" center :closable="false" class="alert" show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active-0" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab标签 -->
    <!-- name与选项卡的active值相等，表示选项卡的别名 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs tab-position="left" v-model="active" @tab-click="changeTab()">
        <el-tab-pane name="1" label="基本信息" class="goods">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              clearable
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 动态参数 -->
          <el-form-item :label="item1.attr_name" v-for="(item1) in arrdy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性" class="goods">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaic" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <!--action:上传地址
                handleSuccess: 上传成功触发的事件
                handleRemove：删除成功触发的事件
                //上传图片是一个新的请求，不属于axios，要写全路径并且设置请求头
             -->
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :headers="headers"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <!-- 添加按钮 -->
          <el-button type="success" @click="addGoods()">添加商品</el-button>
          <!-- 富文本编译器 -->
           <quill-editor class="quill" v-model="form.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
//富文本编译器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce:"",
        pics:[],
        goods_cat:"",
        attrs: []
      },
      // 级联选择器数据
      options: [], //数据源
      selectedOptions: [1, 3, 6], //默认值
      defaultProp: {
        //配置项，和数据相连
        value: "cat_id", //分类id
        label: "cat_name", //分类名称
        children: "children"
      },
      // 动态参数
      arrdy: [],
      arrStaic: [],
      headers: {Authorization:localStorage.getItem('token')}
      
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    //添加商品
    async addGoods() {
      // 8个参数 goods_price/goods_number/goods_weight/goods_introduce/goods_name
      // pics:[{pic:上传图片的临时路径}]
      // goods_cat以逗号分割的分类列表(级联选择器选中的分类id)
      this.form.goods_cat= this.selectedOptions.join(",");

      // attrs:[{"attr_id":??, "attr_value":??}] //动态参数与静态参数
      const arr1 = this.arrdy;
      const arr1New = arr1.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.arrStaic;
      const arr2New = arr2.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr = [...arr1New, ...arr2New];
      this.form.attrs = arr;

      //发送添加商品请求
      const res = await this.$http.post(`goods`, this.form);
      // console.log(res)
      const {meta:{msg,status}} = res.data;
      if(status === 201) {
        this.$message.success(msg);
        this.$router.push({
          name: 'goods'
        })
      } else{
        this.$message.warning(msg)
      }
    },
    //上传图片事件
    handleSuccess(file) {
      //上传成功触发
      // console.log(file)
      //上传成功的临时路径：file.data.tmp_path
      this.form.pics.push({pic:file.data.tmp_path})
      // console.log(this.pics)
    },
    handleRemove(file, fileList) {
      //移除图片成功触发
      // console.log(file,fileList)
      //移除成功的临时路径 file.response.data.tmp_path
      //在移除图片时，也要移除this.pics中对应的图片路径
      const INDEX = this.form.pics.findIndex(item=>{
        //findIndex找索引，参数是Callback
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(INDEX,1);
    },
    //改变tab时触发的事件
    async changeTab() {
      if (this.active === "2") {
        //发送该请求的id必须是第三级的id  selectedOptions[2]
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrdy = res.data.data;
        // console.log(this.arrdy);
        //把字符串数据转换成数组
        this.arrdy.forEach(item => {
          // console.log(item.attr_vals)
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(",");
        });
      }
      if (this.active === "3") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        this.arrStaic = res.data.data;
      }
    },
    handleChange() {},
    //获取商品列表
    async getGoodList() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.goods {
  height: 350px;
  overflow: auto;
}
.quill {
 margin-top: 20px;
}
.ql-editor{
  min-height: 200px;
}
</style>
