<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hymc" style="width: 200px;" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.cpmc" style="width: 200px;" placeholder="产品名称"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="productName" label="产品名称" width="110" align="center"> </el-table-column>
        <el-table-column prop="name" label="会员名称" align="center"> </el-table-column>
        <el-table-column prop="je" label="充值金额(元)" align="center"> </el-table-column>
        <el-table-column prop="yjsy" label="预计收益(元)" align="center"> </el-table-column>
        <el-table-column prop="state" label="审核状态" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button :disabled="loadbtn" @click="Fproductset(scope.row)" type="text">审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <el-dialog title="会员充值审核" width="40%" center :visible.sync="dialogdelVisible">
      <hyczshform :listrow="row" @dialog1Changed="childchanged($event)"></hyczshform>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import hyczshform from './components/hyczshform'

export default {
  name: 'txmccx',
  components: { hyczshform },
  data() {
    return {
      formInline: {
        hymc: '',
        cpmc: '',
      },
      opthydj: [],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [{}],
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
        hymc: this.formInline.hymc,
        cpmc: this.formInline.cpmc,
      };
      request({ url: 'card/memberpercentagetemp/memberPercentageTempPageList.do', method: 'post', data: queryShjData }).then((response) => {
        debugger
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].state = this.showstates(response.list[i].state);
          response.list[i].je = this.moneyData(response.list[i].je);
          response.list[i].yjsy = this.moneyData(response.list[i].yjsy);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false;
      })
    },
    deletetype(row) { //删除
      this.$confirm('此操作将删除 “ ' + row.productName + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'card/percentageSetting/deletePercentageSetting.do', method: 'post', data: { id: row.id } }).then((response) => {
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
      this.row = row;
      this.dialogdelVisible = true;

    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    showstates(state) { //不能用过滤器，很难受 金额
      if (state == "0") {
        return "未审核";
      } else if (state == "1") {
        return "已审核";
      } else {
        return "审核未通过";
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
