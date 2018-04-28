<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.lccpbh" style="width: 200px;" placeholder="理财产品编号/名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.hydj" filterable placeholder="会员等级" style="width:200px;">
          <el-option v-for="item in opthydj" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.starll" style="width: 100px;" placeholder="利率起"></el-input>
        <span>-</span>
        <el-input v-model="formInline.endll" style="width: 100px;" placeholder="利率止"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" :disabled="loadbtn" @click="Fproductset('','add')">新增产品</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="id" sortable='custom' width="130" label="理财产品编号" align="center"> </el-table-column>
        <el-table-column prop="productName" label="理财产品名称" width="110" align="center"> </el-table-column>
        <el-table-column prop="memberLevel" label="会员等级" align="center"> </el-table-column>
        <el-table-column prop="days" label="利率时长(天)" align="center"> </el-table-column>
        <el-table-column prop="percentage" label="利率" align="center"> </el-table-column>
        <el-table-column prop="startJe" label="起投金额(元)" align="center"> </el-table-column>
        <el-table-column prop="addJe" label="倍增金额(元)" align="center"> </el-table-column>
        <el-table-column prop="fdJe" label="上限金额" align="center"> </el-table-column>
        <el-table-column prop="exitpercentage" label="退出费率" align="center"> </el-table-column>
        <el-table-column prop="exitnpdays" label="退出免手续费期限" align="center"> </el-table-column>
        <el-table-column prop="exitmax" label="单日用户最多可退金额" width="110" align="center"> </el-table-column>
        <el-table-column prop="exitfd" label="单日产品最多可退金额" width="110" align="center"> </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button :disabled="loadbtn" @click="Fproductset(scope.row)" type="text">修 改</el-button>
            <el-button @click="deletetype(scope.row,'xl')" type="text">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <el-dialog :title="row.title" width="60%" center :visible.sync="dialogdelVisible">
      <lccpsetform :listrow="row" :dialogdlVisible="dialogdelVisible" @dialog1Changed="childchanged($event)"></lccpsetform>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
import lccpsetform from './components/lccpsetform'

export default {
  name: 'txmccx',
  components: { lccpsetform },
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
      tableData: [],
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
        lccpbh: this.formInline.lccpbh,
        hydj: this.formInline.hydj,
        starll: this.formInline.starll,
        endll: this.formInline.endll
      }
      console.log(queryShjData);
      request({ url: 'card/percentageSetting/queryMemberPercentageSettingPageList.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    deletetype(row) { //删除
      this.$confirm('此操作将删除 “ ' + row.productName + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // request({ url: 'url', method: 'post', data: datalb }).then((response) => {
        // }).catch((err) => {
        this.$message({ type: 'success', message: '删除成功' });
        // this.$message({ type: 'error', message: "请检查网络连接" });
        // });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    Fproductset(row, val) {
      this.loadbtn = true;
      if (val == "add") {
        this.row.title = "新增理财产品";
        this.row.btn = "添加";
      } else {
        this.row = row;
        this.row.title = "修改理财产品";
        this.row.btn = "修改";
      }
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 2 } }).then((response) => {
        this.loadbtn = false;
        this.row.options = response.data.data;
        this.dialogdelVisible = true;
      }).catch((err) => {
        this.loading = false
      })

    },
    childchanged(childdata) { //接收大类组件参数
      this.dialogdelVisible = false;
      this.onloadtabledl();
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
