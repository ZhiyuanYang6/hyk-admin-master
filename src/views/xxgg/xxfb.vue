<template>
  <div class="smain">
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.mbmc" style="width: 140px;" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.mbmc" style="width: 140px;" placeholder="渠道id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.jszt" filterable placeholder="消息类型" style="width:150px;">
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
        <el-button type="warning" @click="addSubmit" style="padding:9px 25px;"> + </el-button>
      </el-form-item>
    </el-form>
    <div class="stable">
      <el-table :data="tableData1" v-loading="loading" @sort-change="sortChange" style="width:100%" border>
        <el-table-column prop="mbmc" sortable='custom' label="用户id" align="center"> </el-table-column>
        <el-table-column prop="mbmc" label="渠道id" align="center"> </el-table-column>
        <el-table-column prop="mbmc" label="会员等级" align="center"> </el-table-column>
        <el-table-column prop="mbmc" label="消息类型" align="center"> </el-table-column>
        <el-table-column prop="mbmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="mbmc" label="状态" align="center"> </el-table-column>
        <el-table-column prop="cjsj" label="创建时间" align="center"> </el-table-column>
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
    <el-dialog title="发布消息" :visible.sync="dialogTableVisible" width="38%">
      <!-- dialog1Changed子组件修改参数事件 -->
      <xxgg-xxfb :childdata="dialogTableVisible" @dialog1Changed="childchanged($event)"></xxgg-xxfb>
    </el-dialog>
  </div>
</template>
<script>
import xxggXxfb from './components/xxggXxfb'

export default {
  components: {
    xxggXxfb
  },
  data() {
    return {
      formInline: {
        mbmc: ''
      },
      optjszt: [
        { value: '0', label: '结算状态' },
        { value: '1', label: '已结算' },
        { value: '2', label: '未结算' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100, //总页数
      },
      tableData1: [{
        mbmc: '商学院正门',
        cjsj: '2017-11-25',
        cz: '保养',
        bz: '打机油',
      }],
      loading: false,
      dialogTableVisible: false
    }
  },
  created: function() {
    this.$store.dispatch('getNewDate', this.formInline);
    // this.onloadtable();
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
        mbmc: this.formInline.mbmc,
      }
      this.loading = false;
      // console.log(queryShjData);
      // axios.post('http://192.168.1.112:8092/Shjgl/queryShj', queryShjData)
      // .then(response => {
      // this.loading = false;
      // this.tableData1 = response.data.data;
      // console.log(response.data);
      // })
      // .catch(error => {
      // Message.error("error：" + "请检查网络是否连接");
      // })
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
