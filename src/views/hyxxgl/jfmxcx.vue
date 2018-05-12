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
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" @click="onloadtable1()">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 控制表格显示列 -->
    <div class="filter-container">
      <el-checkbox-group v-model="formTheadOptions">
        <el-checkbox label="会员名称">会员名称</el-checkbox>
        <el-checkbox label="手机号">手机号</el-checkbox>
        <el-checkbox label="增加积分">增加积分</el-checkbox>
        <el-checkbox label="消费积分">消费积分</el-checkbox>
        <el-checkbox label="积分方式">积分方式</el-checkbox>
        <el-checkbox label="订单号">订单号</el-checkbox>
        <el-checkbox label="时间">时间</el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" border>
        <el-table-column prop="memberId" sortable='custom' width="120" label="会员编号" align="center"> </el-table-column>
        <el-table-column :key="tablist.value" :prop="tablist.value" :label="tablist.title" :width="tablist.width" align="center" v-for="tablist in dtablelist"></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'jfmxcx',
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        ddh: '',
        jffs: '0',
        sj: '',
      },
      optjffs: [
        { value: '0', label: '积分' },
        { value: '1', label: '增加积分' },
        { value: '2', label: '消费积分' }
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
      formTheadOptions: ['会员名称', '手机号', '增加积分', '消费积分', '积分方式', "订单号", "时间", ],
      dtablelist: [{ "title": "会员名称", value: 'name' }, { "title": "手机号", value: 'phone' }, { "title": "增加积分", value: 'zjjf' }, { "title": "消费积分", value: 'jsjf' }, { "title": "积分方式", value: 'jffs' }, { "title": "订单号", value: 'ddh' }, { "title": "时间", "width": 200, value: 'createTime' }],
      checkboxVal: [{ "title": "会员名称", value: 'name' }, { "title": "手机号", value: 'phone' }, { "title": "增加积分", value: 'zjjf' }, { "title": "消费积分", value: 'jsjf' }, { "title": "积分方式", value: 'jffs' }, { "title": "订单号", value: 'ddh' }, { "title": "时间", "width": 200, value: 'createTime' }],
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

    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
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
        phone: this.formInline.sjh,
        ddh: this.formInline.ddh,
        jffs: this.formInline.jffs,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime
      }
      this.loading = true;
      request({ url: 'card/pointsDetail/pointsDetailQueryPageList.do', method: 'post', data: jfmxcxData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].xffs = this.zjjfData(response.list[i].xffs);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })

    },
    selecx() {
      this.onloadtable1();
    },
    zjjfData(xffs) { //不能用过滤器，很难受  结算状态
      if (xffs == "0") {
        return "消费积分";
      } else {
        return "增加积分";
      }
    },
  },
  watch: {
    formTheadOptions(valArr) { //动态增删表格列
      var hastablelist = [];
      for (var i = 0; i < this.checkboxVal.length; i++) {
        for (var n = 0; n < this.formTheadOptions.length; n++) {
          if (this.checkboxVal[i].title == this.formTheadOptions[n]) {
            hastablelist.push(this.checkboxVal[i]);
          }
        }
      }
      this.dtablelist = hastablelist;
      // console.log(hastablelist);
    }
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
