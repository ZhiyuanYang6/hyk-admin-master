<template>
  <div class="smain qxsz">
    <el-card class="box-card" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
      </div>
      <el-table :data="tableData" border style="width: 100%" max-height="260" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column fixed prop="name" style="color:red;height:20px;" label="排列序号" align="center"></el-table-column>
        <el-table-column fixed prop="name" label="角色编号" align="center"></el-table-column>
        <el-table-column fixed prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small">修改</el-button>
            <el-button type="text" size="small">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card body" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>可授予功能列表</span>
        <el-checkbox style="float: right; padding: 3px 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
      <el-checkbox-group v-model="checkList">
        <div class="checkliststy" v-for="item in checkopt" :key="item.id">
          <el-checkbox :label="item">{{item.name}}</el-checkbox>
        </div>
      </el-checkbox-group>
    </el-card>
    <el-card class="box-card botom" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
      </div>
      <el-table :data="tableData" border style="width: 100%" max-height="260" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column fixed prop="name" style="color:red;height:20px;" label="排列序号" align="center"></el-table-column>
        <el-table-column fixed prop="name" label="角色编号" align="center"></el-table-column>
        <el-table-column fixed prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button type="text" size="small">修改</el-button>
            <el-button type="text" size="small">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'txmccx',
  data() {
    return {
      formInline: {
        hymc: '',
        sjh: '',
        yhkh: '',
        sj: '',
        pjdj: '',
      },
      checkopt: [
        { "id": 1610140929000, "name": "商户注册_注册", "description": null, "seq": 1, "status": 1, },
        { "id": 1610140932001, "name": "商户查询_查询", "description": null, "seq": 2, "status": 1, },
        { "id": 1610140933002, "name": "商户查询_编辑", "description": null, "seq": 3, "status": 1, },
        { "id": 1610140933003, "name": "商户查询_删除", "description": null, "seq": 4, "status": 1, },
        { "id": 1610140934004, "name": "商户查询_修改", "description": null, "seq": 5, "status": 1, },
        { "id": 1610140935005, "name": "商户缴费_查询", "description": null, "seq": 6, "status": 1, },
        { "id": 1610140935006, "name": "商户缴费_放大镜查询", "description": null, "seq": 7, "status": 1, },
        { "id": 1610140936007, "name": "商户缴费设置_查询", "description": null, "seq": 8, "status": 1, },
        { "id": 1610140936008, "name": "商户缴费设置_放大镜查询", "description": null, "seq": 9, "status": 1, },
        { "id": 1610140936009, "name": "商户缴费设置_放大镜查询", "description": null, "seq": 9, "status": 1, },
        { "id": 1610140937010, "name": "会员充值缴费消费_下拉框加载商户", "description": null, "seq": 10, "status": 1, },
      ],
      tableData: [{
        name: '王小虎',
      }],
      currentRow: "",
      checkAll: false,
      isIndeterminate: true,
      checkList: [],
    };
  },
  watch: {
    checkList: function(data, olddata) {
      console.log(data);
    }
  },
  created: function() {
    // this.onloadtable1();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleCheckAllChange(val) {
      // this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    onloadtable1() { //查询
      this.timeFormat();
      var txmxcxData = {};
      request({ url: 'mall/spxq/searchspxq.do', method: 'post', data: txmxcxData })
        .then(response => {
          this.loading = false;
          this.tableData = response.list;
          this.listQuery.totalCount = response.total;
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        });
    },
  }
}

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
}

.el-table {
  /*border-bottom: 1px solid #ebeef5;*/
  border: 0;
  cursor: pointer;
}

.box-card {
  width: 49%;
  float: left;
  margin-left: 10px;
}

div.botom body {

  margin-left: 0;
}

div.botom {
  margin-top: 10px;
}

.checkliststy {
  padding: 5px;
  width: 30%;
  float: left;
}

</style>
