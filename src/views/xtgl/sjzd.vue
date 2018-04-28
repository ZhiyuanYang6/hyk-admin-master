<template>
  <div class="smain">
    <el-card class="box-card carddl" :body-style="{ padding: '5px 10px' }">
      <div slot="header" class="clearfix">
        <span>大类</span>
        <el-button style=" padding: 3px;margin-left:15%;" @click="setstartu('添加')" type="text">添加</el-button>
        <el-button style=" padding: 3px;" type="text" @click="setstartu('修改')">修改</el-button>
        <el-button style=" padding: 3px" type="text" @click="deletetype('','dl')">删除</el-button>
      </div>
      <el-table :show-header="false" highlight-current-row @current-change="selectdl" :data="dllist" style="width:100%; cursor:pointer;">
        <el-table-column prop="parentName"></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card cardxl" :body-style="{ padding: '5px 10px' }">
      <div slot="header" class="clearfix">
        <span>小类</span>
        <el-button style="float:right; padding: 3px;margin-left:20px;" type="text" @click="setstartuxl('添加')">添加小类</el-button>
      </div>
      <el-table ref="multipleTable" :data="xltable" v-loading="loading" style="width:100%;cursor:pointer;" border>
        <el-table-column prop="parentCode" label="大类代码" align="center"> </el-table-column>
        <el-table-column prop="parentName" label="大类名称" align="center"> </el-table-column>
        <el-table-column prop="code" label="小类代码" align="center"> </el-table-column>
        <el-table-column prop="name" label="小类名称" align="center"> </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="setstartuxl(scope.row)" type="text">修 改</el-button>
            <el-button @click="deletetype(scope.row,'xl')" type="text">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
      </el-pagination>
    </el-card>
    <!-- 大类添加修改 -->
    <el-dialog :title="showdldialog.title" :visible.sync="dialogdlVisible" width="40%">
      <dladdsetform :listrow="showdldialog" :dialogdlVisible="dialogdlVisible" @dialog1Changed="childchanged($event)"></dladdsetform>
    </el-dialog>
    <!-- 小类添加修改 -->
    <el-dialog :title="row.title" :visible.sync="dialogxlVisible" width="35%">
      <xladdsetform :listrow="row" :dialogxlVisible="dialogxlVisible" @dialogxlChanged="childchangedxl($event)"></xladdsetform>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import dladdsetform from './components/dladdsetform'
import xladdsetform from './components/xladdsetform'
export default {
  components: { dladdsetform, xladdsetform },
  name: 'hyzlgl',
  data() {
    return {
      dialogdlVisible: false, //大类
      dialogxlVisible: false, //小类
      dllist: [], //大类data
      xltable: [], //小类data
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100, //总页数
      },
      loading: true,
      orderBy: '',
      row: {}, //小类选中行
      showdldialog: {}, //大类修改
    }
  },
  created: function() {
    this.onloadtabledl();
    this.onloadtablexl();
  },
  methods: {
    handleCurrentChangexl(val) { //选中小类
      this.toggleSelection(val)
    },
    setstartu(lx) { //添加、修改大类 
      this.showdldialog.btn = lx;
      if (lx == "添加") { //选择大类修改
        this.showdldialog.title = "添加大类";
      } else {
        this.showdldialog.title = "修改大类";
        if (!this.showdldialog.currentdlRow) return this.$message({ type: 'warning', message: "未选择大类" });
      }
      this.dialogdlVisible = true;
    },
    setstartuxl(lx) { //添加、修改小类 
      if (lx == "添加") { //选择小类修改
        if (!this.showdldialog.currentdlRow) return this.$message({ type: 'warning', message: "未选择大类" });
        this.row.btn = lx;
        this.row.title = "添加小类";
        request({ url: "card/dic/getMaxXLCode.do", method: 'post', data: { parentName: this.showdldialog.currentdlRow.parentName, parentCode: this.showdldialog.currentdlRow.parentCode } }).then((response) => {
          this.row.xldm = response.data.data;
          this.dialogxlVisible = true;
        }).catch((err) => {
          this.$message({ type: 'error', message: "请检查网络连接" });
        });
        this.row.currentdlRow = this.showdldialog.currentdlRow;
      } else {
        this.row = lx;
        this.row.title = "修改小类";
        this.row.btn = "修改";
        this.dialogxlVisible = true;
      }

    },
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
    onloadtabledl() { //查询大类
      request({ url: 'card/dic/getalldl.do', method: 'post', data: {} }).then((response) => {
        this.dllist = response.list; //table赋值值
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接" });
      })
    },

    onloadtablexl(val) { //查询小类
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        parentName: val ? val.parentName : '',
        parentCode: val ? val.parentCode : '',
      };
      request({ url: 'card/dic/getallchildcode.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        this.xltable = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
        this.$message({ type: 'error', message: "请检查网络连接" });
      });
    },
    deletetype(val, type) { //删除 大类，小类
      let titledel;
      let url;
      var datalb;
      if (type == "dl") {
        if (!this.showdldialog.currentdlRow) return this.$message({ type: 'warning', message: "未选择大类" });
        titledel = '大类 ” ' + this.showdldialog.currentdlRow.parentName;
        url = "card/dic/deleteparentdic.do";
        datalb = { parentCode: this.showdldialog.currentdlRow.parentCode };
      } else {
        titledel = '小类 ” ' + val.name;
        url = "card/dic/deletexl.do";
        datalb = { parentCode: val.parentCode, code: val.code };
      }
      this.$confirm('此操作将删除' + titledel + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: url, method: 'post', data: datalb }).then((response) => {
          if (response.data.code == "1") {
            if (type == "dl") this.onloadtabledl();
            this.onloadtablexl({ parentCode: val.parentCode, parentName: val.parentName });
            this.$message({ type: 'success', message: response.data.msg });
          } else {
            this.$message({ type: 'error', message: response.data.msg });
          }
        }).catch((err) => {
          this.$message({ type: 'error', message: "请检查网络连接" });
        });

      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    childchanged(childdata) { //接收大类组件参数
      this.dialogdlVisible = false;
      this.onloadtabledl();
    },
    childchangedxl(childdata) { //接收小类组件参数
      this.dialogxlVisible = false;
      this.onloadtablexl(this.showdldialog.currentdlRow);
    },
    selectdl(val) { //选择大类
      this.showdldialog.currentdlRow = val;
      this.onloadtablexl(val);
    }
  }
}

</script>
<style scoped>
/*scoped*/

.smain {
  padding: 10px;
  overflow: hidden;
}

div.clearfix {
  /*padding: 10px 20px;*/
}

.carddl {
  /*position: absolute;*/
  /*top: 93px;*/
  /*width: 23%;*/
  float: left;
  width: 22%;
}

.cardxl {
  /*position: relative;*/
  /*left: 350px;*/
  /*width: 70%;*/
  position: relative;
  left: 1%;
  width: 77%;
  padding: 5px;
}

.dllist {
  padding: 5px 0;
}

</style>
