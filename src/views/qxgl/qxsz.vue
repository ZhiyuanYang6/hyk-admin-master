<template>
  <div class="smain qxsz">
    <el-card class="box-card" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
        <el-button style="float: right;margin-left: 10px;" type="primary" size="mini" @click="setrole({ name: '', code: '' },'新增','card/role/add.do')">新增</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" max-height="260" highlight-current-row @current-change="handleCurrentChange">
        <!-- <el-table-column fixed prop="name" style="color:red;height:20px;" label="排列序号" align="center"></el-table-column> -->
        <el-table-column fixed prop="id" label="角色编号" align="center"></el-table-column>
        <el-table-column fixed prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="setrole(scope.row,'修改','card/role/modifyRole.do')">修改</el-button>
            <el-button type="text" size="small" @click="deletrole(scope.row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- <div style="display: inline-block;"> -->
    <el-card class="body" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>可授予功能列表</span>
        <el-button style="float: right;" type="primary" size="mini" @click="CapabilitiesClick">保存</el-button>
        <el-checkbox style="float: right; padding: 6px 10px 3px 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
      <div class="checkstyle">
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <div class="checkliststy" v-for="item in checkopt" :key="item.id+Math.random()*1000">
            <el-checkbox :label="item">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </el-card>
    <!-- </div> -->
    <el-card class="box-card botom" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>可授予菜单列表</span>
        <el-button style="float: right;margin-left: 10px;" type="primary" size="mini" @click="onloadcdmenu">保存</el-button>
        <el-button style="float: right;" type="primary" size="mini" @click="reset">重置</el-button>
      </div>
      <el-tree ref="tree" :data="permission_routers" show-checkbox node-key="id" @check="handleCheckChange" default-expand-all :default-checked-keys="cdMenu" :props="defaultProps">
      </el-tree>
    </el-card>
    <el-dialog :title=title :visible.sync="dialogVisible" width="30%">
      <el-form :model="formInline" :rules="rules2" size="small" ref="formInline" class="demo-form-inline" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formInline.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <!--         <el-form-item label="角色序号" prop="code">
          <el-input v-model="formInline.code" placeholder="角色序号"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setrole(false)">确 定</el-button>
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
    var validdlcode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('角色序号不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('角色序号不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    var validdlname = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('角色名称不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('角色名称不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      formInline: {
        code: '',
        name: '',
        lx: '',
      },
      rules2: {
        // code: [{ validator: validdlcode, trigger: 'blur' }],
        name: [{ validator: validdlname, trigger: 'blur' }],
      },
      dialogVisible: false,
      loading: true,
      currentRow: {}, //角色当前行
      tableData: [], //角色
      checkAll: false, //全选
      isIndeterminate: true,
      checkList: [], //以选中弄的功能
      checkopt: [],
      defaultProps: { //树结构
        children: 'children',
        label: 'name'
      },
      cdMenu: [], //已选中菜单
      title: '',
      listkeyid: '',
    };
  },
  computed: {
    ...mapGetters([
      'permission_routers', //可授权菜单
    ]),
  },
  watch: {
    dialogVisible: function(data, olddata) {
      this.title = this.formInline.lx + '角色信息';
      if (data) {} else { this.$refs['formInline'].resetFields() }
    }
  },
  created: function() {
    this.onloadtable1();
    this.onloadtable2();
    this.onloadtable3();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
      this.onloadtable2(val);
      this.setCheckedKeys();
      this.onloadtable3(val);
    },
    handleCheckAllChange(val) {
      this.checkList = val ? this.checkopt : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(this.checkList);
    },
    handleCheckChange(data, checked) {
      // debugger;
      this.listkeyid = checked.checkedKeys + ',' + checked.halfCheckedKeys;
    },
    onloadcdmenu() {
      var txmxcxData = {
        roleId: this.currentRow.id,
        checkresponMenu: this.listkeyid,
      };
      request({ url: 'card/roleResource/addRoleResourceMenu.do', method: 'post', data: txmxcxData }).then(response => {
        if (response.data.code == "1") {
          this.$message({ type: 'success', message: response.data.msg });
          this.onloadtable3();
        } else {
          this.$message({ type: 'error', message: response.data.msg });
        }
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
    CapabilitiesClick() {
      var checkrespon = []; //角色已有的功能编号
      this.checkList.forEach(item => {
        checkrespon.push(item.id);
      })
      var txmxcxData = {
        roleId: this.currentRow.id,
        checkrespon: checkrespon,
      };
      request({ url: 'card/roleResource/addRoleResource.do', method: 'post', data: txmxcxData }).then(response => {
        if (response.data.code == "1") {
          this.$message({ type: 'success', message: response.data.msg });
          this.onloadtable2(this.currentRow);
        } else {
          this.$message({ type: 'error', message: response.data.msg });
        }
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
    reset() {
      this.$refs.tree.setCheckedKeys([]);
    },
    setrole(row, lx, url) {
      if (row) {
        this.formInline = { id: row.id, name: row.name, lx: lx, url: url };
        this.dialogVisible = true;
        return;
      }
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          request({ url: this.formInline.url, method: 'post', data: this.formInline }).then(response => {
            if (response.data.code == '1') {
              this.dialogVisible = false;
              this.$message({ type: 'success', message: response.data.msg });
              this.onloadtable1();
            } else {
              this.$message({ type: 'error', message: response.data.msg });
            }
          }).catch(error => {
            Message.error("error：" + "请检查网络是否连接");
          });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    deletrole(row) {
      this.$confirm('此操作将删除 “ ' + row.name + ' ” ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: "card/role/deletRole.do", method: 'post', data: { id: row.id } }).then(response => {
          if (response.data.code == '1') {
            this.dialogVisible = false;
            this.$message({ type: 'success', message: response.data.msg });
            this.onloadtable1();
          } else {
            this.$message({ type: 'error', message: response.data.msg });
          }
        }).catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        });

        Message.success('角色 “ ' + row.name + ' ” ，删除成功');
        this.onloadtable1();
        this.onloadtable2(); //是否刷新功能
        this.setCheckedKeys(); //是否刷新菜单树
        this.onloadtable3(); //是否刷新菜单树
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    onloadtable1() { //查询
      request({ url: 'card/role/queryAllRoles.do', method: 'post', data: {} }).then(response => {
        this.loading = false;
        this.tableData = response;
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
    onloadtable2(row) { //查询
      var txmxcxData = {
        id: row ? row.id : '',
      };
      request({ url: 'card/resource/findResourceByRoleId.do', method: 'post', data: txmxcxData }).then(response => {
        if (row) {
          this.checkList = [];
          var checkrespon = []; //角色已有的功能编号
          response.forEach(item => {
            checkrespon.push(item.id);
          })
          for (let ckey in checkrespon) {
            for (let key in this.checkopt) {
              if (checkrespon[ckey] === this.checkopt[key].id)
                this.checkList.push(this.checkopt[key]);
            }
          }
        } else {
          this.checkopt = response;
        }
        this.isIndeterminate = true;
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys(this.cdMenu);
    },
    onloadtable3(row) { //查询
      var txmxcxData = {
        id: row ? row.id : '',
      };
      request({ url: 'card/resource/findMenuByRoleId.do', method: 'post', data: txmxcxData }).then(response => {
        if (row) {
          this.cdMenu = [];
          this.listkeyid = [];
          response.forEach(item => {
            if (item.pid) { this.cdMenu.push(item.id); }
            this.listkeyid.push(item.id);
          });
          this.listkeyid = this.listkeyid + '';
          this.setCheckedKeys();
        } else {}
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
  }
}

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
  position: relative;
}

.el-form-item {
  margin: 15px 0;
}

.el-input {
  width: 300px;
}

.qxsz:before,
.qxsz:after {
  display: table;
  content: "";
  clear: both
}

.el-table {
  border: 0;
  cursor: pointer;
}

.box-card {
  min-height: 250px;
  width: 49%;
  position: relative;
  float: left;
  margin-left: 10px;
}

div.body {
  /*position: absolute;*/
  /*right: 7px;*/
  min-height: 300px;
  float: right;
  z-index: 1;
  width: 49%;
  margin-left: 10px;
  margin-bottom: 30px;
}

div.botom body {
  /*position: relative;*/
  margin-left: 0;
}

div.botom {
  margin-top: 10px;
  margin-bottom: 30px;
}

.checkliststy {
  border-bottom: 1px solid #ebeef5;
  padding: 5px 5px 10px 5px;
  width: 33%;
  float: left;
}

.checkstyle .el-checkbox {
  padding: 5px 0;
  height: 38px;
  line-height: 20px;
}

.el-tree {
  margin: 10px;
}

</style>
