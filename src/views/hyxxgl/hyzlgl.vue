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
        <el-select v-model="formInline.hydj" filterable placeholder="请选择会员等级" style="width:150px;">
          <el-option v-for="item in opthydj" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.sfrz" filterable placeholder="请选择是否认证" style="width:150px;">
          <el-option v-for="item in optsfrz" :key="item.value" :label="item.label" :value="item.value">
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
        <el-button type="success">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="yglccp" label="已购理财产品" width="110" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="Ryglccp(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" sortable='custom' width="300" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="level" label="会员等级" align="center"> </el-table-column>
        <el-table-column label="是否认证" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.row,'hyrz')">{{scope.row.rzdata}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" width="50" align="center"> </el-table-column>
        <el-table-column prop="idCard" label="身份证" width="170" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" width="110" align="center"> </el-table-column>
        <el-table-column label="客服姓名" align="center">
          <template slot-scope="scope">
            <!--  <el-button type="text" size="mini" @click="dialogtable(scope.row,'customName')"></el-button> -->
            <el-button type="text" size="mini" @click="dialogtable(scope.row,'customName')">{{scope.row.customName}}</el-button>
            <span v-show="!scope.row.customName">未设置</span>
          </template>
        </el-table-column>
        <el-table-column prop="hqzje" label="活期余额(元)" width="110" align="center"> </el-table-column>
        <el-table-column prop="dqzje" label="定期余额(元)" width="110" align="center"> </el-table-column>
        <el-table-column prop="syjf" label="剩余积分
" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="130" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="130">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable( scope.row,'szkfxm')">设置客服人员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <!-- 理财产品 -->
    <el-dialog title="已购理财产品" width="60%" center :visible.sync="dialoglccpVisible">
      <div class="smain">
        <el-table :data="tableDataPurchased" v-loading="loading1" style="width:100%" border>
          <el-table-column prop="memberId" label="会员编号" align="center"> </el-table-column>
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
        <!-- 分页 -->
        <el-pagination background @size-change="handleSizeChangec" @current-change="handleCurrentChangec" :current-page="listQueryc.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQueryc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 客服人员详情 -->
    <el-dialog title="客服人员详情" width="40%" center :visible.sync="dialogkfryxqVisible">
      <kfxqxx :hyzlrow="row"></kfxqxx>
    </el-dialog>
    <el-dialog title="客服人员设置" width="40%" center :visible.sync="dialogszkfryVisible">
      <szkfry :hyzlrow="row" :dialogszkfryVisible="dialogszkfryVisible" @childchanged="childchanged($event)"></szkfry>
    </el-dialog>
    <!-- 会员认证详情 -->
    <el-dialog title="会员认证详情" width="40%" center :visible.sync="dialogkhyrzVisible">
      <hyrz :hyzlrow="row" @childchanged="childchanged($event)"></hyrz>
    </el-dialog>
  </div>
</template>
<script>
// import { dcShjxx, queryMachinesStatus, queryShj } from '@/api/shj'
import request from '@/utils/request'
import { Message } from 'element-ui'
import kfxqxx from './components/kfxqxx'
import hyrz from './components/hyrz'
import szkfry from './components/szkfry'

export default {
  components: { kfxqxx, hyrz, szkfry },
  name: 'hyzlgl',
  data() {
    return {
      formInline: {
        name: '',
        sjh: '',
        hydj: '',
        sfrz: '',
        sj: '',
      },
      optsfrz: [
        { value: '0', label: '未认证' },
        { value: '1', label: '已认证' },
        { value: '2', label: '认证未通过' }
      ],
      opthydj: [
        { value: '1', label: '黄金' },
        { value: '2', label: '钻石' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      listQueryc: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      tableDataPurchased: [],
      orderBy: "",
      row: '',
      loading: false,
      loading1: false,
      dialoglccpVisible: false,
      dialogkfryxqVisible: false,
      dialogkhyrzVisible: false,
      dialogszkfryVisible: false,
    }
  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
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
    handleSizeChangec(val) {
      this.listQueryc.pageSize = val; //修改已购理财产品每页数据量
      this.Ryglccp();
    },
    handleCurrentChangec(val) { //已购理财产品跳转第几页
      this.listQueryc.pageNum = val;
      this.Ryglccp();
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
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        name: this.formInline.name,
        sjh: this.formInline.sjh,
        hydj: this.formInline.hydj,
        sfrz: this.formInline.sfrz,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
      }
      request({ url: 'card/member/memberQueryPageList.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].sex = this.sexData(response.list[i].sex);
          response.list[i].level = this.memberLevel(response.list[i].level);
          response.list[i].rzdata = this.sfrzdata(response.list[i].checkStatus);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    getmemberlevel() {
      request({ url: 'card/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 2 } }).then((response) => {
        this.loadbtn = false;
        this.opthydj = response.data.data;
      }).catch((err) => {
        this.loading = false
      })
    },
    sexData(sex) { //不能用过滤器，很难受 金额
      if (sex == "1") {
        return "男";
      } else if (sex == "2") {
        return "女";
      } else {
        return "保密";
      }
    },
    sfrzdata(sfrz) { //不能用过滤器，很难受 金额
      if (sfrz == "1") {
        return "已认证";
      } else if (sfrz == "2") {
        return "认证未通过";
      } else if (sfrz == "3") {
        return "待认证";
      } else {
        return "待认证";
      }
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

    Ryglccp(index, row) {
      this.dialoglccpVisible = true;
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQueryc.pageNum,
        pageSize: this.listQueryc.pageSize,
        name: row.id,
      }
      request({ url: 'card/memberPercentage/queryMemberPercentage.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].level = this.memberLevel(response.list[i].level);
        }
        this.tableDataPurchased = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
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
    dialogtable(row, val) {
      // debugger;
      //this.row = row;
      if (val == "customName") {
        var queryShjData = {
          customId: row.customId,
        }
        request({ url: 'card/customService/queryCustomById.do', method: 'post', data: queryShjData }).then((response) => {
          this.loading = false; //关闭遮罩load
          this.row = response.data;
        }).catch((err) => {
          this.loading = false
        })
        this.dialogkfryxqVisible = true;
      } else if (val == "hyrz") {
        this.row = row;
        this.dialogkhyrzVisible = true;
      } else {
        request({ url: 'card/customService/queryCustoms.do', method: 'post', data: {} }).then((response) => {
          // this.loading = false; //关闭遮罩loadddddd
          this.row = row;
          this.row.options = response.data.data;
          this.dialogszkfryVisible = true;
        }).catch((err) => {
          this.loading = false
        })
      }
    },
    childchanged(childdata) { //接收大类组件参数
      this.dialogszkfryVisible = false;
      this.dialogkhyrzVisible = false;
      this.onloadtable1();
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
