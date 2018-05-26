<template>
  <div class="smain qxsz">
    <el-card class="box-card botom" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>菜单列表</span>
        <div style="margin:5px"></div>
      </div>
      <el-tree :data="zyglmenu" node-key="id" :expand-on-click-node="false" default-expand-all :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
        <el-button  type="text" v-show="data.children" size="mini" @click="() => setend(data,'增加','/card/resource/addResourceMenu.do')">添加</el-button>
        <el-button  type="text"  size="mini" @click="() => setend(data,'修改','/card/resource/modifyResourceMenu.do')">修改</el-button>
        <el-button  type="text"  size="mini"  @click="() => removeRow(data,node,'菜单','/card/resource/deleteResourceMenu.do')">删除</el-button>
        </span>
        </span>
        <!-- </span> -->
      </el-tree>
    </el-card>
    <el-card class="feature" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>功能列表</span>
        <el-button style="float: right;margin-left: 10px;" type="primary" size="mini" @click="setrole({addrent:'',name:'',id:''},'新增','/card/resource/addResourceFunction.do')">新增</el-button>
      </div>
      <el-table :data="tableData" border v-loading="loading">
        <!-- <el-table-column type="index" label="序号" align="center"></el-table-column> -->
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="功能名称" align="center"></el-table-column>
        <el-table-column prop="url" label="功能URL" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="setrole(scope.row,'修改','/card/resource/modifyResourceFunction.do')">修改</el-button>
            <el-button type="text" size="small" @click="removeRow(scope.row,'','功能','/card/resource/deleteResourceFunction.do')">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="功能信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="formInline" :rules="rules2" size="small" ref="formInline" class="demo-form-inline" label-width="80px">
        <el-form-item label="功能名称" prop="name">
          <el-input v-model="formInline.name" placeholder="功能名称"></el-input>
        </el-form-item>
        <el-form-item label="功能地址" prop="addrent">
          <el-input v-model="formInline.addrent" placeholder="功能地址"></el-input>
        </el-form-item>
        <!--  <el-form-item label="功能序号" prop="id">
          <el-input v-model="formInline.id" placeholder="功能序号"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setrole(false)">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="修改菜单列表" :visible.sync="dialogVisibleMenu" width="40%">
      <el-form :model="formInlineMenu" :rules="rules2" size="small" ref="formInlineMenu" class="demo-form-inline" label-width="100px">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="formInlineMenu.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="资源地址" prop="path">
          <el-input v-model="formInlineMenu.path" placeholder="角色序号"></el-input>
        </el-form-item>
        <el-form-item label="资源图标名称" prop="tbmc">
          <el-input v-model="formInlineMenu.tbmc" placeholder="角色序号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleMenu = false">取 消</el-button>
    <el-button type="primary" @click="setend(false)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'txmccx',
  data() {
    var validdlmust = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.toString();
        value = (!!value) ? value.replace(/(^\s*)|(\s*$)/g, '') : '';
        if (!value) return callback(new Error('内容不能为空'));
        setTimeout(() => {
          callback();
        }, 400);
      }
    };
    return {
      formInline: {
        addrent: '',
        name: '',
        id: '',
      },
      dialogVisible: false,
      formInlineMenu: {
        path: '',
        name: '',
        id: '',
      },
      dialogVisibleMenu: false,
      rules2: {
        addrent: [{ validator: validdlmust, trigger: 'blur' }],
        name: [{ validator: validdlmust, trigger: 'blur' }],
        tbmc: [{ validator: validdlmust, trigger: 'blur' }],
        path: [{ validator: validdlmust, trigger: 'blur' }],
      },
      tableData: [],
      orderBy: '',
      loading: true,
      defaultProps: { //树结构
        children: 'children',
        label: 'name'
      },
      zyglmenu: '', //已选中菜单
    };
  },
  computed: {
    ...mapGetters([
      'permission_routers', //可授权菜单
    ]),
  },
  watch: {
    dialogVisible: function(data, olddata) {
      if (data) {} else { this.$refs['formInline'].resetFields() }
    },
    dialogVisibleMenu: function(data, olddata) {
      if (data) {} else { this.$refs['formInlineMenu'].resetFields() }
    }
  },
  created: function() {
    this.zyglmenu = this.permission_routers;
    this.onloadtable();
  },
  methods: {
    setend(row, lx, url) { //修改、添加菜单
      // debugger;
      if (row) {
        this.formInlineMenu = { path: row.path, name: row.name, tbmc: row.meta.icon, id: row.id, lx: lx, url: url };
        if (lx === "增加") this.formInlineMenu = { path: '', name: '', tbmc: '', id: row.id, lx: lx, url: url };
        this.dialogVisibleMenu = true;
        return;
      }
      let data = {
        path: this.formInlineMenu.path,
        name: this.formInlineMenu.name,
        tbmc: this.formInlineMenu.tbmc,
        id: this.formInlineMenu.id,
      };
      this.$refs['formInlineMenu'].validate((valid) => {
        if (valid) {
          // debugger;
          if (this.formInlineMenu.lx === "增加") {
            request({ url: this.formInlineMenu.url, method: 'post', data: data }).then(response => {
              if (response.data.code == '1') {
                this.dialogVisibleMenu = false;
                this.$message({ type: 'success', message: response.data.msg });
                this.onloadtable1();
              } else {
                this.$message({ type: 'error', message: response.data.msg });
              }
            }).catch(error => {
              Message.error("error：" + "请检查网络是否连接");
            });
          } else {
            request({ url: this.formInlineMenu.url, method: 'post', data: data }).then(response => {
              if (response.data.code == '1') {
                this.dialogVisibleMenu = false;
                this.$message({ type: 'success', message: response.data.msg });
                this.onloadtable1();
              } else {
                this.$message({ type: 'error', message: response.data.msg });
              }
            }).catch(error => {
              Message.error("error：" + "请检查网络是否连接");
            });
          }
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    setrole(row, lx, url) { //修改、添加 功能
      if (row) {
        this.formInline = { addrent: row.url, name: row.name, id: row.id, lx: lx, url: url };
        this.dialogVisible = true;
        return;
      }
      let data = {
        addrent: this.formInline.addrent,
        name: this.formInline.name,
        id: this.formInline.id,
      };
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.lx == "新增") {
            request({ url: this.formInline.url, method: 'post', data: data }).then(response => {
              if (response.data.code == '1') {
                this.dialogVisible = false;
                this.$message({ type: 'success', message: response.data.msg });
                this.onloadtable();

              } else {
                this.$message({ type: 'error', message: response.data.msg });
              }

            }).catch(error => {
              Message.error("error：" + "请检查网络是否连接");
            });
          } else {
            request({ url: this.formInline.url, method: 'post', data: data }).then(response => {
              if (response.data.code == '1') {
                this.dialogVisible = false;
                this.$message({ type: 'success', message: response.data.msg });
                this.onloadtable();
              } else {
                this.$message({ type: 'error', message: response.data.msg });
              }
            }).catch(error => {
              Message.error("error：" + "请检查网络是否连接");
            });
          }
          // // request({ url: this.formInline.url, method: 'post', data: data }).then(response => {
          // this.dialogVisible = false;
          // this.$message({ type: 'success', message: this.formInline.lx + '功能 “ ' + this.formInline.name + ' ” ' + '成功' });
          // this.onloadtable();
          // // }).catch(error => {
          // // Message.error("error：" + "请检查网络是否连接");
          // // });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    removeRow(row, node, lx, url) { //删除菜单、功能
      this.$confirm('此操作将删除' + lx + ' “ ' + row.name + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: url, method: 'post', data: { id: row.id } }).then(response => {
          if (response.data.code == '1') {
            this.dialogVisible = false;
            this.$message({ type: 'success', message: response.data.msg });
            this.onloadtable();
            this.onloadtable1();
          } else {
            this.$message({ type: 'error', message: response.data.msg });
          }
          // this.onloadtable1();
        }).catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    onloadtable() { //查询功能
      // var txmxcxData = {};
      console.log('刷新了功能');
      request({ url: 'card/resource/findResourceByRoleId.do', method: 'post', data: {} }).then(response => {
        this.loading = false;
        this.tableData = response;
        // [{ "id": 1610101572003, "name": "数据字典", "pid": 1610101532003, "seq": 71, "url": "/systemmenu/systemdatadic.do" }];
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
    onloadtable1() { //查询菜单
      this.$store.dispatch('GetUserInfo').then(() => {
        // console.log(this.$store);
        // debugger;
        this.zyglmenu = this.$store.state.user.routers;
      }).catch(() => {});
      // request({ url: 'mall/sh/searchsh.do', method: 'post', data: txmxcxData }).then(response => {
      // this.zyglmenu = [];
      console.log('我给菜单刷新了')
      // }).catch(error => {
      // Message.error("error：" + "请检查网络是否连接");
      // });
    }
  }
};

</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.smain {
  padding: 10px;
  position: relative;
}

.smain:before,
.smain:after {
  display: table;
  content: "";
  clear: both
}

.box-card {
  width: 35%;
  position: relative;
  float: left;
  margin-right: 30px;
}

.feature {
  /*position: absolute;*/
  width: 60%;
}

.el-table {
  border: 0;
}

.el-form-item {
  margin: 15px 0;
}

</style>
