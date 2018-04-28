<template>
  <div class="smain">
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 140px;" placeholder="用户编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.qdbh" style="width: 140px;" placeholder="渠道编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.xxlx" filterable placeholder="消息类型" style="width:150px;">
          <el-option v-for="item in optjszt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable()">查询</el-button>
        <el-button type="warning" @click="addSubmit" style="padding:9px 25px;">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="stable">
      <el-table :data="tableData" v-loading="loading" @sort-change="sortChange" style="width:100%" border>
        <el-table-column prop="userId" sortable='custom' label="用户编号" align="center"> </el-table-column>
        <el-table-column prop="qdId" label="渠道编号" align="center"> </el-table-column>
        <el-table-column prop="memberLevel" label="会员等级" align="center"> </el-table-column>
        <el-table-column prop="type" label="消息类型" align="center"> </el-table-column>
        <el-table-column prop="title" label="标题" align="center"> </el-table-column>
        <el-table-column prop="state" label="状态" align="center"> </el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center"> </el-table-column>
        <el-table-column prop="cz" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable1(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
      </el-pagination>
    </div>
    <!-- el-dialog -->
    <el-dialog title="发布消息" :visible.sync="dialogTableVisible" width="80%">
      <!-- dialog1Changed子组件修改参数事件 -->
      <xxgg-xxfb :childdata="dialogTableVisible" @dialog1Changed="childchanged($event)"></xxgg-xxfb>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'

export default {
  name: 'xxggXxfb',
  data() {
    return {
      formInline: {
        hybh: '',
        qdbh: '',
        xxlx: ''
      },
      optjszt: [
        { value: '0', label: '全部' },
        { value: '1', label: '有效' },
        { value: '2', label: '无效' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100, //总页数
      },
      tableData: [],
      orderBy: '',
      loading: false,
      dialogTableVisible: false
    }
  },
  created: function() {
    this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable();
  },
  methods: {
    addSubmit() { //添加模板界面
      this.dialogTableVisible = true;
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
    onloadtable() { //模板查询
      this.timeFormat()
      var queryShjData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        hybh: this.formInline.hybh,
        qdbh: this.formInline.qdbh,
        xxlx: this.formInline.xxlx,
        startTime: this.formInline.startTime,
        endTime: this.formInline
          .endTime,
      }
      request({ url: 'card/message/messageQueryPageList.do', method: 'post', data: queryShjData }).then((response) => {
        this.loading = false; //关闭遮罩load
        for (var i = 0; i < response.list.length; i++) { //格式化参数 
          response.list[i].memberLevel = this.memberData(response.list[i].memberLevel);
          response.list[i].state = this.messageStatus(response.list[i].state);
        }
        this.tableData = response.list; //table赋值值
        this.listQuery.totalCount = response.total; //赋值总页数
      }).catch((err) => {
        this.loading = false
      })
    },
    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
      if (this.formInline.sj) {
        this.$store.dispatch('timeFormat', this.formInline);
      } else {
        this.$store.dispatch('getNewDate', this.formInline);
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
    },
    memberData(memberLevel) { //不能用过滤器，很难受  结算状态
      if (memberLevel == 1) {
        return "普通";
      } else if (memberLevel == 2) {
        return "白金";
      } else {
        return "钻石";
      }
    },
    messageStatus(state) { //不能用过滤器，很难受  结算状态
      if (state == 1) {
        return "有效";
      } else {
        return "失效";
      }
    },
    childchanged(childdata) { //接收子组件参数
      this.dialogTableVisible = childdata;
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

</style>
