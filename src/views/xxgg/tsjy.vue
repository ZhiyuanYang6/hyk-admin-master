<template>
  <div class="smain">
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 140px;" placeholder="会员编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.qdbh" style="width: 140px;" placeholder="渠道编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.ddh" style="width: 140px;" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.pjdj" filterable placeholder="评价等级" style="width:150px;">
          <el-option v-for="item in optjszt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="stable">
      <el-table :data="tableData" v-loading="loading" @sort-change="sortChange" style="width:100%" border>
        <!-- <el-table-column prop="id" sortable='custom' label="id" align="center"> </el-table-column> -->
        <el-table-column prop="memberId" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="qdId" label="渠道编号" align="center"> </el-table-column>
        <el-table-column prop="pjdj" label="评价等级" align="center"> </el-table-column>
        <el-table-column prop="content" label="内容" align="center"> </el-table-column>
        <el-table-column prop="cz" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detailList(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
      </el-pagination>
    </div>
    <el-card class="box-card" :body-style="{ padding: '0px 20px' }">
      <div slot="header" class="clearfix">
        <span>投诉内容</span>
      </div>
      <div v-for="row in showList" :key="row.kf" class="text item">
        <p>{{'客服：' + row.kf }}</p>
        <p> {{'客户：' + row.kh }}</p>
      </div>
    </el-card>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'

export default {
  name: 'xxggTsjx',
  data() {
    return {
      formInline: {
        hybh: '',
        qdbh: '',
        ddh: '',
        pjdj: ''
      },
      optjszt: [
        { value: '0', label: '好评' },
        { value: '1', label: '中评' },
        { value: '2', label: '差评' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100, //总页数
      },
      tableData: [],
      loading: false,
      orderBy: '',
      showList: [],
    }
  },
  created: function() {
    this.onloadtable();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val; //修改每页数据量
      this.onloadtable();
    },
    handleCurrentChange(val) { //跳转第几页
      this.listQuery.pageNum = val;
      this.onloadtable();
    },
    sortChange(column) { //服务器端排序
      if (column.order == "ascending") {
        this.orderBy = column.prop + " asc";
      } else if (column.order == "descending") {
        this.orderBy = column.prop + " desc";
      }
      this.onloadtable();
    },
    onloadtable() { //模板查询
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        hybh: this.formInline.hybh,
        qdbh: this.formInline.qdbh,
        ddh: this.formInline.ddh,
        pjdj: this.formInline.pjdj,
      }
      request({ url: 'card/tsjy/tsjydetail.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        // for (var i = 0; i < response.list.length; i++) { //格式化参数 
        // response.list[i].memberLevel = this.memberData(response.list[i].memberLevel);
        // response.list[i].state = this.messageStatus(response.list[i].state);
        // }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数

      }).catch((err) => {
        this.loading = false
      })
    },
    detailList(index, row) {
      console.log(row);
      this.showList = row.content;
      console.log(this.showList);
    }
  }
}

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
}

div.el-form-item {
  margin-bottom: 15px;
}

.text {
  font-size: 14px;
}

.text p {
  border-bottom: 1px solid #f0f0f0;
}

.item {
  margin-bottom: 18px;
}

</style>
