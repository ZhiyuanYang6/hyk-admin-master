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
        <el-select v-model="formInline.xfsj" filterable placeholder="请选择消费时间" style="width:150px;">
          <el-option v-for="item in optxfsj" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.xfqd" filterable placeholder="请选择消费渠道" style="width:150px;">
          <el-option v-for="item in optxfqd" :key="item.value" :label="item.label" :value="item.value">
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
        <el-table-column prop="hybh" sortable='custom' width="120" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="hymc" label="会员名称" align="center"> </el-table-column>
        <el-table-column prop="sjh" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="xfje" label="消费金额(元)" align="center"> </el-table-column>
        <el-table-column prop="xffs" label="消费方式" align="center"> </el-table-column>
        <el-table-column prop="xfqd" label="消费渠道" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column label="优惠金额" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row)">{{scope.row.yhje}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="xfsj" label="消费时间" align="center"> </el-table-column>
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
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'xfmxcx',
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        xffs: '',
        xfsj: '',
        xfqd: '',
      },
      optxffs: [
        { value: '1', label: '微信' },
        { value: '2', label: '支付宝' },
        { value: '3', label: '银行卡' }
      ],
      optxfsj: [
        { value: '1', label: '消费时间' }
      ],
      optxfqd: [
        { value: '1', label: '消费渠道' }
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
        xfje: "50000",
        xffs: "微信",
        xfqd: "酒店",
        ddh: 'c232323',
        yhje: '红包(10元)',
        xfsj: '2008-09-10 22:23:15'
      }],
      orderBy: [],
      loading: false,
      dialogdelVisible: false
    }

  },
  created: function() {
    // this.onloadtable1();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val; //修改每页数据量
      // this.onloadtable1();
    },
    handleCurrentChange(val) { //跳转第几页
      this.listQuery.pageNum = val;
      // this.onloadtable1();
    },
    sortChange(column) { //服务器端排序
      if (column.order == "ascending") {
        this.orderBy1 = column.prop + " asc";
      } else if (column.order == "descending") {
        this.orderBy1 = column.prop + " desc";
      }
      // this.onloadtable1();
    },
    onloadtable1() { //消费明细查询
      var queryShjData = {
        orderBy: this.orderBy1,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        xl: this.formInline.xl,
        jqbh: this.formInline.jqbh,
        shbh: this.formInline.shbh,
        lx: this.formInline.lx
      }
      console.log(queryShjData);
      axios.post('http://192.168.1.112:8092/Shjgl/queryShj', queryShjData)
        .then(response => {
          this.loading = false;
          this.tableData = response.data.data;
          console.log(response.data);
        })
        .catch(error => {
          // Message.error("error：" + "请检查网络是否连接");
        })
    },
 dialogtable(index, row) { this.dialogdelVisible = true; }

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
