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
          <el-option v-for="item in opthydj" :key="item.value" :label="item.label" :value="item.value">
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
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
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
        <el-table-column prop="id" sortable='custom' width="110" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="level" label="会员等级" align="center"> </el-table-column>
        <el-table-column label="是否认证" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row,'sfrz')">{{scope.row.sfrz}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row,'xm')">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="50" align="center"> </el-table-column>
        <el-table-column prop="idCard" label="身份证" width="170" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" width="110" align="center"> </el-table-column>
        <el-table-column label="客服姓名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row,'kfxm')">{{scope.row.customName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="hqzje" label="活期余额(元)" width="110" align="center"> </el-table-column>
        <el-table-column prop="dqzje" label="定期余额(元)" width="110" align="center"> </el-table-column>
        <el-table-column prop="zjf" label="剩余积分" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="130" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
// import { dcShjxx, queryMachinesStatus, queryShj } from '@/api/shj'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
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
        { value: '1', label: '已认证' },
        { value: '2', label: '未认证' }
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
      tableData: [],
      orderBy: "",
      loading: false,
    }
  },
  created: function() {
    this.$store.dispatch('getNewDate', this.formInline);
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
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
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
    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
      if (this.formInline.sj) {
        this.$store.dispatch('timeFormat', this.formInline);
      } else {
        this.$store.dispatch('getNewDate', this.formInline);
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
      // }
    },
    Ryglccp(index, row) {
      this.$router.push('/lccpgl/lccpcx');
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
