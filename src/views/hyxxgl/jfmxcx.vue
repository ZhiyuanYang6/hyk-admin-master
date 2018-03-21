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
        <el-select v-model="formInline.jffs" filterable placeholder="积分方式" style="width:150px;">
          <el-option v-for="item in optjffs" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']">
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
        <el-table-column prop="hybh" sortable='custom' width="120" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="hymc" label="会员名称" align="center"> </el-table-column>
        <el-table-column prop="sjh" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="zjjf" label="增加积分" align="center"> </el-table-column>
        <el-table-column prop="xfjf" label="消费积分" align="center"> </el-table-column>
        <el-table-column prop="jffs" label="积分方式" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="sj" label="时间" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'jfmxcx',
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        ddh: '',
        jffs: '',
        sj: '',
      },
      optjffs: [
        { value: '0', label: '全部积分' },
        { value: '1', label: '增加积分' },
        { value: '2', label: '消费积分' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [{
        hybh: "001",
        hymc: "张三",
        sjh: "15945687512",
        zjjf: "0",
        xfjf: "1000",
        ddh: '2018999999',
        sj: '2008-09-10 22:23:15',
      }],
      orderBy: '',
      loading: false,
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
    timeFormat() {
      if (this.formInline.sj) {
        var sy = this.formInline.sj[0].getFullYear();
        var sm = this.formInline.sj[0].getMonth();
        var sd = this.formInline.sj[0].getDate();
        var sh = this.formInline.sj[0].getHours();
        var si = this.formInline.sj[0].getMinutes();
        var ss = this.formInline.sj[0].getSeconds();
        var ey = this.formInline.sj[1].getFullYear();
        var em = this.formInline.sj[1].getMonth();
        var ed = this.formInline.sj[1].getDate();
        var eh = this.formInline.sj[1].getHours();
        var ei = this.formInline.sj[1].getMinutes();
        var es = this.formInline.sj[1].getSeconds();
        this.formInline.startTime = sy + "-" + (sm + 1 < 10 ? '0' + (sm + 1) : sm + 1) + "-" + (sd < 10 ? '0' + sd : sd) + " " + (sh < 10 ? '0' + sh : sh) + ":" + (si < 10 ? '0' + si : si) + ":" + (ss < 10 ? '0' + ss : ss);
        this.formInline.endTime = ey + "-" + (em + 1 < 10 ? '0' + (em + 1) : em + 1) + "-" + (ed < 10 ? '0' + ed : ed) + " " + (eh < 10 ? '0' + eh : eh) + ":" + (ei < 10 ? '0' + ei : ei) + ":" + (es < 10 ? '0' + es : es);
      } else {
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
    },

    onloadtable1() { //积分明细查询
      this.timeFormat();
      var jfmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        hybh: this.formInline.hybh,
        sjh: this.formInline.sjh,
        ddh: this.formInline.ddh,
        jffs: this.formInline.jffs,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime
      }
      console.log(jfmxcxData);
      axios.post('http://192.168.1.127:8082/card/pointsDetail/test.do', jfmxcxData)
        .then(response => {
          this.loading = false;
          // var response = { data: { data: this.tableData } };
          // this.analysis(response.data.data);
          this.listQuery.totalCount = response.data.totalCount;
          this.tableData = response.data.data;
          console.log(response);
        })
        .catch(error => {
          console.log(error)
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    analysis(jfmxcxData) {
      for (var i = 0; i < jfmxcxData.length; i++) {
        if (jfmxcxData.zjjf == "0" || jfmxcxData.zjjf == "" || jfmxcxData.zjjf == null || jfmxcxData.zjjf == undefined) {
          jfmxcxData[i].jffs = "消费积分";
          // jfmxcxData[i].jffs = "购买消费";
        } else {
          jfmxcxData[i].jffs = "增加积分";
        }
      }
      // console.log(jfmxcxData);
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
