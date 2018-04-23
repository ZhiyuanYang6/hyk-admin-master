<template>
  <div class="smain">
    <el-card class="box-card carddl" :body-style="{ padding: '5px 10px' }">
      <div slot="header" class="clearfix">
        <span>大类</span>
        <el-button style=" padding: 3px;margin-left:70px;" @click="setstartu('添加大类')" type="text">添加</el-button>
        <el-button style=" padding: 3px;" type="text" @click="setstartu('修改大类')">修改</el-button>
        <el-button style=" padding: 3px" type="text" @click="deletetype('dl')">删除</el-button>
      </div>
      <el-table highlight-current-row @current-change="handleCurrentChange" :data="dllist" style="width:100%; cursor:pointer;" :show-header="false">
        <el-table-column prop="value"></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card cardxl" :body-style="{ padding: '5px 10px' }">
      <div slot="header" class="clearfix">
        <span>小类</span>
        <el-button style="padding: 3px;margin-left:20px;" type="text" @click="setstartu('添加小类')">添加</el-button>
        <el-button style="padding: 3px;" type="text" @click="setstartu('修改小类')">修改</el-button>
        <el-button style="padding: 3px" type="text" @click="deletetype">删除</el-button>
      </div>
      <el-table ref="multipleTable" :data="xltable" v-loading="loading" style="width:100%;cursor:pointer;" border highlight-current-row @current-change="handleCurrentChangexl" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="110" label="操作" align="center"></el-table-column>
        <el-table-column prop="dldm" label="大类代码" align="center"> </el-table-column>
        <el-table-column prop="dlmc" label="大类名称" align="center"> </el-table-column>
        <el-table-column prop="xldm" label="小类代码" align="center"> </el-table-column>
        <el-table-column prop="xlmc" label="小类名称" align="center"> </el-table-column>
        <el-table-column prop="bz" label="备注" align="center"> </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="showdialog.title" :visible.sync="dialogVisible" width="40%">
      <el-form :model="formInline" size="small" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.name" style="width: 120px;" placeholder="姓名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'hyzlgl',
  data() {
    return {
      dialogVisible: false,
      dllist: [
        { value: '支付类型', label: 0 },
        { value: '商户等级', label: 1 },
        { value: '会员等级', label: 2 },
        { value: '会员卡等级', label: 3 },
        { value: '会员卡状态', label: 4 },
      ],
      xltable: [],
      tableData: [
        { dldm: '10', dlmc: "支付类型", xldm: "0", xlmc: "正常", bz: "" },
        { dldm: '10', dlmc: "支付类型", xldm: "1", xlmc: "未激活", bz: "" },
        { dldm: '10', dlmc: "支付类型", xldm: "2", xlmc: "注销", bz: "" },
        { dldm: '10', dlmc: "支付类型", xldm: "3", xlmc: "停用", bz: "" },
        { dldm: '10', dlmc: "支付类型", xldm: "4", xlmc: "挂失", bz: "" },
      ],
      tableData1: [
        { dldm: '10', dlmc: "商户等级", xldm: "0", xlmc: "正常", bz: "" },
        { dldm: '10', dlmc: "商户等级", xldm: "1", xlmc: "未激活", bz: "" },
        { dldm: '10', dlmc: "商户等级", xldm: "2", xlmc: "注销", bz: "" },
        { dldm: '10', dlmc: "商户等级", xldm: "3", xlmc: "停用", bz: "" },
        { dldm: '10', dlmc: "商户等级", xldm: "4", xlmc: "挂失", bz: "" },
      ],
      tableData2: [
        { dldm: '10', dlmc: "会员等级", xldm: "0", xlmc: "正常", bz: "" },
        { dldm: '10', dlmc: "会员等级", xldm: "1", xlmc: "未激活", bz: "" },
        { dldm: '10', dlmc: "会员等级", xldm: "2", xlmc: "注销", bz: "" },
        { dldm: '10', dlmc: "会员等级", xldm: "3", xlmc: "停用", bz: "" },
        { dldm: '10', dlmc: "会员等级", xldm: "4", xlmc: "挂失", bz: "" },
      ],
      tableData3: [
        { dldm: '10', dlmc: "会员卡状态", xldm: "0", xlmc: "正常", bz: "" },
        { dldm: '10', dlmc: "会员卡状态", xldm: "1", xlmc: "未激活", bz: "" },
        { dldm: '10', dlmc: "会员卡状态", xldm: "2", xlmc: "注销", bz: "" },
        { dldm: '10', dlmc: "会员卡状态", xldm: "3", xlmc: "停用", bz: "" },
        { dldm: '10', dlmc: "会员卡状态", xldm: "4", xlmc: "挂失", bz: "" },
      ],
      tableData4: [
        { dldm: '10', dlmc: "会员卡等级", xldm: "0", xlmc: "正常", bz: "" },
        { dldm: '10', dlmc: "会员卡等级", xldm: "1", xlmc: "未激活", bz: "" },
        { dldm: '10', dlmc: "会员卡等级", xldm: "2", xlmc: "注销", bz: "" },
        { dldm: '10', dlmc: "会员卡等级", xldm: "3", xlmc: "停用", bz: "" },
        { dldm: '10', dlmc: "会员卡等级", xldm: "4", xlmc: "挂失", bz: "" },
      ],
      loading: false,
      currentdlRow: '', //选中的大类
      currentxlRow: '', //选中的小类
      showdialog: {}, //展示的弹框
      formInline: {
        dlmc: "",
        xldm: "",
        xlmc: '',
        bz: "",
      },
    }
  },
  created: function() {
    this.xltable = this.tableData1;
    this.currentdlRow = this.dllist[0];
    this.currentxlRow = this.xltable[0];
    // this.onloadtable1();
  },
  methods: {
    handleCurrentChange(val) { //选中大类
      this.currentdlRow = val;
      if (val.value == "会员卡等级") {
        this.xltable = this.tableData4
      } else if (val.value == "会员卡状态") {
        this.xltable = this.tableData3
      } else if (val.value == "会员等级") {
        this.xltable = this.tableData2;
      } else if (val.value == "商户等级") {
        this.xltable = this.tableData1;
      } else {
        this.xltable = this.tableData;
      }
      console.log(this.currentdlRow)
    },
    handleCurrentChangexl(val) { //选中小类
      this.toggleSelection(val)
    },
    setstartu(dldata, xldata) { //添加、修改大类  添加 、修改小类
      this.dialogVisible = true;
      this.showdialog.title = dldata;
      console.log(dldata)
      if (dldata) { //选择大类修改删除
        console.log(this.currentdlRow)
      } else { //选择小类修改删除
        console.log(this.currentxlRow)
      }
    },
    toggleSelection(rows) { //选中小类check
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(rows);
    },
    handleSelectionChange(val) { //选中小类check
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection();
      } else if (val.length > 0) {
        this.currentxlRow = val[0];
      }
    },
    deletetype(val) { //删除
      console.log(this.currentxlRow)
      console.log(this.currentdlRow)
      var data = {};
      data.dltitle = this.currentdlRow.value;
      if (val == 'dl') {
        data.xltitle = "";
      } else {
        if (!this.currentxlRow) {
          this.$message({ type: 'info', message: '未选择小类' });
        }
        data.xltitle = this.currentxlRow.xlmc;
      }
      this.$confirm('此操作将删除大类 ” ' + data.dltitle + data.xltitle + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功!' });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    }
  }
}

</script>
<style scoped>
/*scoped*/

.smain {
  padding: 10px;
}

div.clearfix {
  /*padding: 10px 20px;*/
}

.carddl {
  position: absolute;
  top: 93px;
  width: 23%;
}

.cardxl {
  position: relative;
  left: 350px;
  width: 70%;
}

.dllist {
  padding: 5px 0;
}

</style>
