<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.qdbh" style="width: 120px;" placeholder="渠道编号/名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.lxr" style="width: 120px;" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.sjh" style="width: 120px;" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.lx" filterable placeholder="类型" style="width:150px;">
          <el-option v-for="item in optlx" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="success" @click="onloadtable1()">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="qdbh" sortable='custom' width="120" label="渠道编号" align="center"> </el-table-column>
        <el-table-column prop="qdmc" label="渠道名称" align="center"> </el-table-column>
        <el-table-column prop="lxr" label="联系人" align="center"> </el-table-column>
        <el-table-column prop="sjh" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="lx" label="类型" align="center"> </el-table-column>
        <el-table-column prop="bz" label="备注" align="center"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
      </el-table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
const defaultabletitle = ["渠道编号", '渠道名称', "联系人", "手机号", "类型", "备注"];
export default {
  name: 'txmccx',
  data() {
    return {
      formInline: {
        qdbh: '',
        lxr: '',
        sjh: '',
        lx: '',
      },
      optlx: [
        { value: '1', label: '类型' },
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [{
          qdbh: "001",
          qdmc: "酒店",
          lxr: "张三",
          sjh: "13877766666",
          lx: "",
          bz: "",
        },
        {
          qdmc: "休闲农庄",
        }
      ],
      orderBy: [],
      loading: false,
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
