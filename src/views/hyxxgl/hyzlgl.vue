<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.xm" style="width: 120px;" placeholder="姓名"></el-input>
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
        <el-select v-model="formInline.zcsj" filterable placeholder="请选择时间类型" style="width:150px;">
          <el-option v-for="item in optzcsj" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" @click="dialogtable1()">导出Excel</el-button>
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
        <el-table-column prop="hybh" sortable='custom' width="110" label="会员编号" align="center"> </el-table-column>
        <el-table-column prop="hydj" label="会员等级" align="center"> </el-table-column>
        <el-table-column prop="sfrz" label="是否认证" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row,'sfrz')">{{scope.row.sfrz}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="xm" label="姓名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row,'xm')">{{scope.row.xm}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="xb" label="性别" width="50" align="center"> </el-table-column>
        <el-table-column prop="sfz" label="身份证" width="170" align="center"> </el-table-column>
        <el-table-column prop="sjh" label="手机号" width="110" align="center"> </el-table-column>
        <el-table-column prop="kfxm" label="客服姓名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogtable(scope.$index, scope.row,'kfxm')">{{scope.row.kfxm}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="hqye" label="活期余额(元)" width="110" align="center"> </el-table-column>
        <el-table-column prop="dqye" label="定期余额(元)" width="110" align="center"> </el-table-column>
        <el-table-column prop="syjf" label="剩余积分" align="center"> </el-table-column>
        <el-table-column prop="zcsj" label="注册时间" width="130" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <!--  会员认证对话框-->
    <el-dialog title="会员认证" width="40%" :visible.sync="dialogdelVisible1">
      <hyrz :hyzlrow="hyzlrow"></hyrz>
      <!-- <hr> -->
      <!--    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogdelVisible1 = false">确 定</el-button>
      </div> -->
    </el-dialog>
    <!--  会员详情信息对话框-->
    <el-dialog title="会员详情信息" width="40%" :visible.sync="dialogdelVisible2">
      <hyxqxx :hyzlrow="hyzlrow"></hyxqxx>
      <!-- <hr> -->
      <!--      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogdelVisible2= false">关 闭</el-button>
      </div> -->
    </el-dialog>
    <!--  客服详情信息对话框-->
    <el-dialog title="客服详情信息" :visible.sync="dialogdelVisible3" width="40%">
      <kfxqxx :hyzlrow="hyzlrow"></kfxqxx>
      <!-- <hr> -->
      <!--       <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogdelVisible3 = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
// import { dcShjxx, queryMachinesStatus, queryShj } from '@/api/shj'
import axios from 'axios'
import kfxqxx from './components/kfxqxx'
import hyxqxx from './components/hyxqxx'
import hyrz from './components/hyrz'
import { Message } from 'element-ui'

export default {
  components: { kfxqxx, hyxqxx, hyrz },
  name: 'wdshj',
  data() {
    return {
      formInline: {
        xm: '',
        sjh: '',
        hydj: '',
        sfrz: '',
        zcsj: '',
      },
      formInline3: {
        jqlx: "",
        jqbh: "",
        pch: "",
      },
      opthydj: [
        { value: '1', label: '钻石' },
        { value: '2', label: '黄金' }
      ],
      optsfrz: [
        { value: '1', label: '已认证' },
        { value: '2', label: '未认证' }
      ],
      optzcsj: [
        { value: '1', label: '注册时间' }
      ],
      dialogdelVisible1: false,
      dialogdelVisible2: false,
      dialogdelVisible3: false,
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [{
        yglccp: '查看',
        hybh: '001',
        hydj: '钻石',
        sfrz: '已认证',
        xm: '张三',
        xb: "男",
        sfz: "430524198905642154",
        sjh: "15945687512",
        kfxm: "李四",
        hqye: "1000",
        dqye: "100000",
        syjf: '7890',
        zcsj: '2008-09-10'
      }],
      orderBy: [],
      loading: false,
      data2: {},
      hyzlrow: {},
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
    onloadtable1() { //售货机查询
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
    Ryglccp(index, row) {
      this.$router.push('/lccpgl/lccpcx');
    },
    dialogtable(index, row, lx) {
      this.hyzlrow = row;
      console.log(this.hyzlrow);
      if (lx === "sfrz") {
        this.dialogdelVisible1 = true;
      } else if (lx === "xm") {
        this.dialogdelVisible2 = true;
      } else {
        this.dialogdelVisible3 = true;
      }
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
