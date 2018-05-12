<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name" style="width: 120px;" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.sjh" style="width: 120px;" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.hydj" filterable placeholder="会员等级" style="width:150px;">
          <el-option v-for="item in opthydj" :key="item.value" :label="item.name" :value="item.code">
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
        <el-table-column prop="level" label="会员等级" align="center"> </el-table-column>
        <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="productId" label="理财产品编号" align="center"> </el-table-column>
        <el-table-column prop="productName" label="理财产品名称" align="center"> </el-table-column>
        <el-table-column prop="je" label="投资金额" align="center"> </el-table-column>
        <el-table-column prop="startDay" label="计息开始时间" align="center"> </el-table-column>
        <el-table-column prop="endDay" label="到期日期" align="center"> </el-table-column>
        <el-table-column prop="yjsy" label="预计收益" align="center"> </el-table-column>
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
  name: 'txmccx',
  data() {
    return {
      formInline: {
        name: '',
        sjh: '',
        hydj: '',
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
      tableData: [{
          hybh: "001",
          hydj: "张三"
        },
        {
          hybh: "002",
          hydj: "麻子"
        }
      ],
      orderBy: '',
      loading: false,
    }

  },
  created: function() {
    this.onloadtable1();
    this.getmemberlevel();
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
        name: this.formInline.name,
        sjh: this.formInline.sjh,
        hydj: this.formInline.hydj
      }
      console.log(queryShjData);
      request({ url: 'card/memberPercentage/queryMemberPercentage.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].je = this.moneyData(response.list[i].je);
          response.list[i].level = this.memberLevel(response.list[i].level);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    getmemberlevel() {
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 2 } }).then((response) => {
        this.loadbtn = false;
        this.opthydj = response.data.data;
      }).catch((err) => {
        this.loading = false
      })
    },
    memberLevel(level) { //不能用过滤器，很难受  结算状态
      if (level == 1) {
        return "普通";
      } else if (level == 2) {
        return "白银";
      } else if (level == 3) {
        return "白金";
      } else {
        return "钻石";
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
