<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 120px;" placeholder="会员编号/名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.sjh" style="width: 120px;" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.ddh" style="width: 120px;" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.czfs" filterable placeholder="请选择充值方式" style="width:150px;">
          <el-option v-for="item in optczfs" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="formInline.sj" unlink-panels type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" @click="onloadtable1()">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="memberId" sortable='custom' width="120" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="name" label="会员名称" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="je" label="充值金额(元)" align="center"> </el-table-column>
        <el-table-column prop="payType" label="充值方式" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="充值时间" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'

export default {
  name: 'czmxcx',
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        ddh: '',
        czfs: '',
        sj: '',
      },
      optczfs: [
        { value: '', label: '充值方式' },
        { value: '1', label: '微信' },
        { value: '2', label: '支付宝' },
        { value: '3', label: '银行卡' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      orderBy: '',
      loading: false,
    }

  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable1();
    this.getczfs();
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
      this.timeFormat();
      var czmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        hybh: this.formInline.hybh,
        sjh: this.formInline.sjh,
        ddh: this.formInline.ddh,
        czfs: this.formInline.czfs,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
      }
      request({ url: 'card/rechargeDetail/rechargeDetailQueryPageList.do', method: 'post', data: czmxcxData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].je = this.moneyData(response.list[i].je);
          response.list[i].payType = this.jsztData(response.list[i].payType);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    getczfs() {
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 4 } }).then((response) => {
        this.loadbtn = false;
        this.optczfs = response.data.data;
        console.log(this.optlx);
        debugger;
      }).catch((err) => {
        this.loading = false
      })
    },
    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
      if (this.formInline.sj) {
        this.$store.dispatch('timeFormat', this.formInline);
      } else {
        // this.$store.dispatch('getNewDate', this.formInline);
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
      // }
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    jsztData(txzt) { //不能用过滤器，很难受  结算状态
      if (txzt == 1) {
        return "微信";
      } else if (txzt == 2) {
        return "支付宝";
      } else {
        return "银行卡";
      }
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
