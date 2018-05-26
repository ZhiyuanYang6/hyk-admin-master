<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.dlm" style="width: 200px;" placeholder="登录名"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-input v-model="formInline.xm" style="width: 200px;" placeholder="姓名"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="yhxxloadbtn('',0)">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <!-- <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column> -->
        <el-table-column prop="loginName" label="登录名" align="center"> </el-table-column>
        <!-- <el-table-column prop="name" label="姓名" align="center"></el-table-column>-->
        <el-table-column prop="modifyName" label="创建人" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="yhxxloadbtn(scope.row,1)">修改信息</el-button>
            <el-button type="text" size="mini" @click="yhxxloadbtn(scope.row,2)">修改密码</el-button>
            <el-button type="text" size="mini" @click="delbtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="用户信息新增" :visible.sync="dialogVisible[0].show" :close-on-click-modal='false' width="40%" style="padding-bottom: 5%;">
      <addyhxxform :options="options" :dialogVisible="dialogVisible[0].show" @dialog1Changed="childchanged($event)"></addyhxxform>
    </el-dialog>
    <!-- 用户信息修改 -->
    <el-dialog title="用户信息修改" :visible.sync="dialogVisible[1].show" :close-on-click-modal='false' width="40%" style="padding-bottom: 5%;">
      <setuseryhxxform :options="options" :listrow="row" :dialogVisible="dialogVisible[1].show" @dialog1Changed="childchanged($event)"></setuseryhxxform>
    </el-dialog>
    <el-dialog title="用户密码设置" :visible.sync="dialogVisible[2].show" width="30%" style="padding-bottom: 5%;">
      <el-form ref="form" :rules="rules2" class="addsublime" label-width="70px" style="padding: 20px 0 1px 0;" :inline="false" :model="form">
        <el-form-item label="密码" prop="paw">
          <el-input v-model="form.paw" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="apaw">
          <el-input v-model="form.apaw" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="subbtn" type="warning" plain @click="setpwdsubmit('form',true)">取消</el-button>
          <el-button class="subbtn" type="warning" @click="setpwdsubmit('form')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'
import addyhxxform from './components/addyhxxform'
import setuseryhxxform from './components/setuseryhxxform'

export default {
  name: 'txmccx',
  components: { addyhxxform, setuseryhxxform },
  data() {
    var validpaw = (rule, value, callback) => {
      if (!value || value.length === 0) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.length ? value : value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('内容不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    var validapaw = (rule, value, callback) => {
      if (!value || value.length === 0) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.length ? value : value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('内容不能为空'));
        } else {
          if (this.form.paw !== value) {
            return callback(new Error('密码不一致'));
          }
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      form: {
        paw: '',
        apaw: '',
      },
      rules2: {
        paw: [{ validator: validpaw, trigger: 'blur' }],
        apaw: [{ validator: validapaw, trigger: 'blur' }],
      },
      formInline: {
        dlm: '',
        modifyName: '',
        createTime: '',
        modifyTime: '',
      },
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      orderBy: '',
      loading: false,
      options: '',
      row: {}, //当前行
      dialogVisible: [{ show: false }, { show: false }, { show: false }],
    };
  },
  created: function() {
    this.onloadtable1();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val; //修改每页数据量
      this.onloadtable1();
    },
    handleCurrentChange(val) { //跳转第几页
      this.listQuery.pageNum = val;
      this.onloadtable1();
    },
    sortChange(column) { //服务器端排序
      if (column.order == "ascending") {
        this.orderBy = column.prop + " asc";
      } else if (column.order == "descending") {
        this.orderBy = column.prop + " desc";
      }
      this.onloadtable1();
    },
    onloadtable1() { //查询
      this.timeFormat();
      var txmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        dlm: this.formInline.dlm,
      }
      request({ url: 'card/user/queryUsersByLoginId.do', method: 'post', data: txmxcxData }).then(response => {
        this.loading = false; //关闭遮罩load
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数

      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      });
    },
    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
      if (this.formInline.sj) {
        this.$store.dispatch('timeFormat', this.formInline);
      } else {
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
    },
    delbtn(row) { //删除
      this.$confirm('此操作将删除 “ ' + row.loginName + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'card/user/deleteUserAndRole.do', method: 'post', data: { id: row.id } }).then((response) => {
          debugger
          if (response.data.code == '1') {
            this.$message({ type: 'success', message: response.data.msg });
            this.onloadtable1();
          } else {
            this.$message({ type: 'error', message: response.data.msg });
          }
        }).catch((err) => {
          this.$message({ type: 'error', message: "请检查网络连接" });
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2);
    },
    imgUrl(imgurl) {
      return "http://192.168.1.123:8088" + imgurl;
    },
    setpwdsubmit(formName, reset) { //修改密码
      if (reset) {
        this.dialogVisible[2].show = false;
        this.$refs[formName].resetFields();
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {

          var txmxcxData = {
            id: this.row.id,
            loginName: this.row.loginName,
            password: this.form.paw,
          }
          request({ url: 'card/user/modifyUserPassword.do', method: 'post', data: txmxcxData }).then((response) => {
            if (response.data.code == '1') {
              this.$message({ type: 'success', message: response.data.msg });
              this.dialogVisible[2].show = false;
              this.$refs[formName].resetFields();
            } else {
              this.$message({ type: 'success', message: response.data.msg });
            }
            console.log(this.row);
          }).catch((err) => {
            this.$message({ type: 'error', message: "请检查网络连接" });
          });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });

    },
    yhxxloadbtn(row, lx, val) { // 操作
      if (row) {
        this.row = row;
      }
      request({ url: 'card/role/queryAllRoles.do', method: 'post', data: {} }).then((response) => {
        this.options = response;
        this.dialogVisible[lx].show = true;
      }).catch((err) => {});
      // this.$nextTick(() => {});
    },
    childchanged(childdata) { //接收子组件参数
      this.dialogVisible[childdata].show = false;
      this.onloadtable1();
    },
  }
};

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
}

.smainFright {
  position: absolute;
  right: 0;
}

div.el-dialog--center div.el-dialog__body {
  padding-top: 5px;
  padding-bottom: 5px;
}

</style>
