<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.lccpbh" style="width: 120px;" placeholder="理财产品编号/名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.hydj" filterable placeholder="会员等级" style="width:150px;">
          <el-option v-for="item in opthydj" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.starll" style="width: 80px;" placeholder="利率起"></el-input>
        <span>-</span>
        <el-input v-model="formInline.endll" style="width: 80px;" placeholder="利率止"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" @click="dialogtable()">新增产品</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="id" sortable='custom' width="120" label="理财产品编号" align="center"> </el-table-column>
        <el-table-column prop="productName" label="理财产品名称" align="center"> </el-table-column>
        <el-table-column prop="memberLevel" label="会员等级" align="center"> </el-table-column>
        <el-table-column prop="days" label="利率时长(天)" align="center"> </el-table-column>
        <el-table-column prop="percentage" label="利率" align="center"> </el-table-column>
        <el-table-column prop="startJe" label="起投金额(元)" align="center"> </el-table-column>
        <el-table-column prop="addJe" label="倍增金额(元)" align="center"> </el-table-column>
        <el-table-column prop="fdJe" label="上限金额" align="center"> </el-table-column>
        <el-table-column prop="exitpercentage" label="退出费率" align="center"> </el-table-column>
        <el-table-column prop="exitnpdays" label="退出免手续费期限" align="center"> </el-table-column>
        <el-table-column prop="exitmax" label="单日用户最多可退金额" align="center"> </el-table-column>
        <el-table-column prop="exitfd" label="单日产品最多可退金额" align="center"> </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <el-dialog title="新增产品" width="40%" center :visible.sync="dialogdelVisible">
      <hr>
      <div style="height: 150px;">
        <h4>理财产品表相关信息</h4>
      </div>
    </el-dialog>
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
        lccpbh: '',
        hydj: '',
        starll: '',
        endll: '',
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
          lccpbh: "1001",
          lccpmc: "收益宝",
          hydj: "钻石",
          llsc: "360",
          ll: "12%",
          qtje: "100000",
          bzje: "100000",
          fdje: "100000"
        },
        {
          lccpbh: "1002",
        }
      ],
      orderBy: "",
      loading: false,
      dialogdelVisible: false,
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
        lccpbh: this.formInline.lccpbh,
        hydj: this.formInline.hydj,
        starll: this.formInline.starll,
        endll: this.formInline.endll
      }
      console.log(queryShjData);
      request({ url: 'card/percentageSetting/queryMemberPercentageSettingPageList.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        /*for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].je = this.zjjfData(response.list[i].je);
          response.list[i].level = this.zjjfData(response.list[i].level);
        }*/
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },

    dialogtable() {
      this.dialogdelVisible = true;
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
