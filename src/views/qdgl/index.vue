<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.qdbh" style="width: 120px;" placeholder="渠道编号/名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.lxr" style="width: 120px;" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.sjh" style="width: 120px;" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.lx" filterable placeholder="类型" style="width:150px;">
          <el-option v-for="item in optlx" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" @click="onloadtable1()">导出Excel</el-button>
        <el-button type="success" @click="qproductset('','add')">新增渠道</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="id" sortable='custom' width="120" label="渠道编号" align="center"> </el-table-column>
        <el-table-column prop="qdName" label="渠道名称" align="center"> </el-table-column>
        <el-table-column prop="linkMan" label="联系人" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="type" label="类型" align="center"> </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button @click="qproductset(scope.row)" type="text">修 改</el-button>
            <el-button @click="deleteqd(scope.row,'xl')" type="text">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border></el-table>
    </div>
    <el-dialog :title="row.title" width="50%" center :visible.sync="dialogdelVisible">
      <qdglsetform :listrow="row" :dialogdlVisible="dialogdelVisible" @dialog1Changed="childchanged($event)"></qdglsetform>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import qdglsetform from './components/qdglsetform'
import { Message } from 'element-ui'
const defaultabletitle = ["渠道编号", '渠道名称', "联系人", "手机号", "类型", "备注"];
export default {
  name: 'txmccx',
  components: { qdglsetform },
  data() {
    return {
      formInline: {
        qdbh: '',
        lxr: '',
        sjh: '',
        lx: '',
      },
      optlx: [
        { value: '1', label: '类型' },
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      orderBy: "",
      loading: false,
      dialogdelVisible: false,
      row: {},
    }

  },
  created: function() {
    this.onloadtable1();
    this.getqdtype();
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
    qproductset(row, val) {
      if (val == "add") {
        this.row.title = "新增渠道";
        this.row.btn = "添加";
      } else {
        this.row = row;
        this.row.title = "修改渠道";
        this.row.btn = "修改";
      }
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 3 } }).then((response) => {
        this.loadbtn = false;
        this.row.options = response.data.data;
        this.dialogdelVisible = true;
      }).catch((err) => {
        this.loading = false
      })
    },
    deleteqd(row) { //删除
      this.$confirm('此操作将删除 “ ' + row.qdName + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'card/qd/deleteqd.do', method: 'post', data: { id: row.id } }).then((response) => {
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
    onloadtable1() { //售货机查询
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        qdbh: this.formInline.qdbh,
        lxr: this.formInline.lxr,
        sjh: this.formInline.sjh,
        lx: this.formInline.lx
      }
      console.log(queryShjData);
      request({
        url: 'card/qd/qdQueryPageList.do',
        method: 'post',
        data: queryShjData
      }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].type = this.typeData(response.list[i].type);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    getqdtype() {
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 3 } }).then((response) => {
        this.loadbtn = false;
        this.optlx = response.data.data;
      }).catch((err) => {
        this.loading = false
      })
    },
    typeData(type) { //不能用过滤器，很难受 金额
      if (type == "1") {
        return "酒店";
      } else if (type == "2") {
        return "餐饮";
      } else if (type == "3") {
        return "KTV";
      } else {
        return "洗浴中心";
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
