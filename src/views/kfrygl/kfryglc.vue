<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.kfrybh" style="width: 200px;" placeholder="客服人员编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.kfrymc" style="width: 200px;" placeholder="客服人员名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.sjh" style="width: 200px;" placeholder="电话"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" :disabled="loadbtn" @click="Fproductset('','add')">新增客户人员</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="id" sortable='custom' width="130" label="客户人员编号" align="center"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="110" align="center"> </el-table-column>
        <el-table-column prop="showsex" label="性别" align="center"> </el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center"> </el-table-column>
        <el-table-column prop="phone" label="电话" align="center"> </el-table-column>
        <el-table-column prop="address" label="地址" align="center"> </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"> </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button :disabled="loadbtn" @click="Fproductset(scope.row)" type="text">修 改</el-button>
            <el-button @click="deletetype(scope.row,'xl')" type="text">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <el-dialog :title="row.title" width="60%" center :visible.sync="dialogdelVisible">
      <kfryglcsetform :listrow="row" :dialogdlVisible="dialogdelVisible" @dialog1Changed="childchanged($event)"></kfryglcsetform>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import kfryglcsetform from './components/kfryglcsetform'

export default {
  name: 'kfryglc',
  components: { kfryglcsetform },
  data() {
    return {
      formInline: {
        kfrybh: '',
        kfrymc: '',
        sjh: '',
      },
      opthydj: [
        { value: '1', label: '钻石' },
        { value: '2', label: '黄金' },
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      orderBy: "",
      row: {},
      loading: false,
      dialogdelVisible: false,
      loadbtn: false,
    }

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
    onloadtable1() { //售货机查询
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        kfrybh: this.formInline.kfrybh,
        kfrymc: this.formInline.kfrymc,
        sjh: this.formInline.sjh,
      }
      console.log(queryShjData);
      request({ url: 'card/customService/customServiceQueryPageList.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].showsex = this.sexData(response.list[i].sex);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    deletetype(row) { //删除
      this.$confirm('此操作将删除 “ ' + row.productName + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'card/customService/deleteCustomService.do', method: 'post', data: { id: row.id } }).then((response) => {
          if (response.data.code == "1") {
            this.$message({ type: 'success', message: response.data.msg });
          } else {
            this.$message({ type: 'error', message: response.data.msg });
          }
          this.onloadtable1();
        }).catch((err) => {
          this.$message({ type: 'success', message: '删除成功' });
          this.$message({ type: 'error', message: "请检查网络连接" });
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    Fproductset(row, val) {
      this.loadbtn = true;
      if (val == "add") {
        this.row.title = "添加客服人员";
        this.row.btn = "添加";
      } else {
        this.row = row;
        this.row.title = "修改客服人员";
        this.row.btn = "修改";
      }
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 1 } }).then((response) => {
        this.loadbtn = false;
        this.row.options = response.data.data;
        this.dialogdelVisible = true;
      }).catch((err) => {
        this.loading = false
      })

    },
    sexData(sex) { //不能用过滤器，很难受 金额
      if (sex == "1") {
        return "男";
      } else if (sex == "2") {
        return "女";
      } else {
        return "其他";
      }
    },
    childchanged(childdata) { //接收值组件参数
      this.dialogdelVisible = false;
      this.onloadtable1();
    },
  }
}

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
