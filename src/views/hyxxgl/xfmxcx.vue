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
        <el-select v-model="formInline.xffs" filterable placeholder="请选择消费方式" style="width:150px;">
          <el-option v-for="item in optxffs" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="formInline.sj" unlink-panels type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.xfqd" filterable placeholder="请选择消费渠道" style="width:150px;">
          <el-option v-for="item in optxfqd" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
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
        <el-table-column prop="je" label="消费金额(元)" align="center"> </el-table-column>
        <el-table-column prop="payType" label="消费方式" align="center"> </el-table-column>
        <el-table-column prop="payQd" label="消费渠道" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column label="优惠金额" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row)">{{scope.row.yhJe}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="消费时间" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <el-dialog title="优惠详情" width="40%" center :visible.sync="dialogdelVisible">
      <hr>
      <div style="height: 150px;">
        <h4>红包、优惠券表内容
</h4>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'xfmxcx',
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        xffs: '',
        sj: '',
        xfqd: '',
      },
      optxffs: [
        { value: '0', label: '消费方式' },
        { value: '1', label: '微信' },
        { value: '2', label: '支付宝' },
        { value: '3', label: '银行卡' }
      ],
      optxfqd: [
        { value: '', label: '消费渠道1' }, { value: '1', label: '消费渠道2' }
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
      dialogdelVisible: false
    }

  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable1();
    this.getxffs();
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
    onloadtable1() { //消费明细查询
      this.timeFormat();
      var xfmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        hybh: this.formInline.hybh,
        sjh: this.formInline.sjh,
        xffs: this.formInline.xffs,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        xfqd: this.formInline.xfqd,
      }
      request({ url: 'card/consumeDetail/consumeDetailQueryPageList.do', method: 'post', data: xfmxcxData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].je = this.moneyData(response.list[i].je);
          response.list[i].yhJe = this.moneyData(response.list[i].yhJe);
          response.list[i].payType = this.xffsData(response.list[i].payType);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    getxffs() {
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 5 } }).then((response) => {
        this.loadbtn = false;
        this.optxfqd = response.data.data;
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
    xffsData(xffs) { //不能用过滤器，很难受  结算状态
      if (xffs == "1") {
        return "微信";
      } else if (xffs == "2") {
        return "支付宝";
      } else {
        return "余额";
      }
    },
    dialogtable(index, row) { this.dialogdelVisible = true; },

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
