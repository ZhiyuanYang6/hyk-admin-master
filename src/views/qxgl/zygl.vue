<template>
  <div class="smain qxsz">
    <el-card class="box-card botom" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>菜单列表</span>
        <div style="margin:5px"></div>
      </div>
      <el-tree :data="zyglmenu" node-key="id" :expand-on-click-node="false" default-expand-all :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
        <el-button  type="text" v-show="data.children" size="mini" @click="() => setend(data,'增加','addmenuURL')">添加</el-button>
        <el-button  type="text" v-show="data.children" size="mini" @click="() => setend(data,'修改','setmenuURL')">修改</el-button>
        <el-button  type="text" v-show="data.children"  size="mini"  @click="() => removeRow(data,node,'菜单','menuURL')">删除</el-button>
        </span>
        </span>
        <!-- </span> -->
      </el-tree>
    </el-card>
    <el-card class="feature" shadow="false" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>功能列表</span>
        <el-button style="float: right;margin-left: 10px;" type="primary" size="mini" @click="setrole({addrent:'',name:'',id:''},'新增','addFunURL')">新增</el-button>
      </div>
      <el-table :data="tableData" border v-loading="loading">
        <!-- <el-table-column type="index" label="序号" align="center"></el-table-column> -->
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="功能名称" align="center"></el-table-column>
        <el-table-column prop="url" label="功能URL" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="setrole(scope.row,'修改','setFunURL')">修改</el-button>
            <el-button type="text" size="small" @click="removeRow(scope.row,'','功能','funURL')">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改功能信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="formInline" :rules="rules2" size="small" ref="formInline" class="demo-form-inline" label-width="80px">
        <el-form-item label="功能名称" prop="name">
          <el-input v-model="formInline.name" placeholder="功能名称"></el-input>
        </el-form-item>
        <el-form-item label="功能地址" prop="addrent">
          <el-input v-model="formInline.addrent" placeholder="功能地址"></el-input>
        </el-form-item>
        <el-form-item label="功能序号" prop="id">
          <el-input v-model="formInline.id" placeholder="功能序号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setrole(false)">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog title="修改菜单列表" :visible.sync="dialogVisibleMenu" width="30%">
      <el-form :model="formInlineMenu" :rules="rules2" size="small" ref="formInlineMenu" class="demo-form-inline" label-width="80px">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="formInlineMenu.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="资源地址" prop="path">
          <el-input v-model="formInlineMenu.path" placeholder="角色序号"></el-input>
        </el-form-item>
        <el-form-item label="资源序号" prop="id">
          <el-input v-model="formInlineMenu.id" placeholder="角色序号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleMenu = false">取 消</el-button>
    <el-button type="primary" @click="setend(false)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'txmccx',
  data() {
    var validdlmust = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.toString();
        value = (!!value) ? value.replace(/(^\s*)|(\s*$)/g, '') : '';
        if (!value) return callback(new Error('内容不能为空'));
        setTimeout(() => {
          callback();
        }, 400);
      }
    };
    return {
      formInline: {
        addrent: '',
        name: '',
        id: '',
      },
      dialogVisible: false,
      formInlineMenu: {
        path: '',
        name: '',
        id: '',
      },
      dialogVisibleMenu: false,
      rules2: {
        addrent: [{ validator: validdlmust, trigger: 'blur' }],
        name: [{ validator: validdlmust, trigger: 'blur' }],
        id: [{ validator: validdlmust, trigger: 'blur' }],
        path: [{ validator: validdlmust, trigger: 'blur' }],
      },
      tableData: [],
      orderBy: '',
      loading: true,
      defaultProps: { //树结构
        children: 'children',
        label: 'name'
      },
      zyglmenu: '', //已选中菜单
    };
  },
  computed: {
    ...mapGetters([
      'permission_routers', //可授权菜单
    ]),
  },
  watch: {
    dialogVisible: function(data, olddata) {
      if (data) {} else { this.$refs['formInline'].resetFields() }
    },
    dialogVisibleMenu: function(data, olddata) {
      if (data) {} else { this.$refs['formInlineMenu'].resetFields() }
    }
  },
  created: function() {
    this.zyglmenu = this.permission_routers;
    this.onloadtable();
  },
  methods: {
    setend(row, lx, url) { //修改、添加菜单
      if (row) {
        this.formInlineMenu = { path: row.path, name: row.name, id: row.id, lx: lx, url: url };
        if (lx === "增加") this.formInlineMenu = { path: '', name: '', id: '', lx: lx, url: url };
        this.dialogVisibleMenu = true;
        return;
      }
      let data = {
        addrent: this.formInlineMenu.addrent,
        name: this.formInlineMenu.name,
        id: this.formInlineMenu.id,
      };
      this.$refs['formInlineMenu'].validate((valid) => {
        if (valid) {
          // request({ url: this.formInlineMenu.url, method: 'post', data: data }).then(response => {
          this.dialogVisibleMenu = false;
          this.$message({ type: 'success', message: this.formInlineMenu
.lx + '菜单 “ ' + this.formInlineMenu.name + ' ” ' + '成功' });
          this.onloadtable1();
          // }).catch(error => {
          // Message.error("error：" + "请检查网络是否连接");
          // });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    setrole(row, lx, url) { //修改、添加 功能
      if (row) {
        this.formInline = { addrent: row.addrent, name: row.name, id: row.id, lx: lx, url: url };
        this.dialogVisible = true;
        return;
      }
      let data = {
        addrent: this.formInline.addrent,
        name: this.formInline.name,
        id: this.formInline.id,
      };
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          // request({ url: this.formInline.url, method: 'post', data: data }).then(response => {
          this.dialogVisible = false;
          this.$message({ type: 'success', message: this.formInline.lx + '功能 “ ' + this.formInline.name + ' ” ' + '成功' });
          this.onloadtable();
          // }).catch(error => {
          // Message.error("error：" + "请检查网络是否连接");
          // });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    removeRow(row, node, lx, url) { //删除菜单、功能
      this.$confirm('此操作将删除' + lx + ' “ ' + row.name + ' “ ,  是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // request({ url: url, method: 'post', data: { name: row.name, id: row.id } }).then(response => {
        Message.success(lx + " ‘ " + row.name + " ’ 成功");
        this.onloadtable();
        this.onloadtable1();
        // }).catch(error => {
        // Message.error("error：" + "请检查网络是否连接");
        // });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    onloadtable() { //查询功能
      var txmxcxData = {};
      console.log('刷新了功能');
      // request({ url: 'mall/sh/searchsh.do', method: 'post', data: txmxcxData }).then(response => {
      this.loading = false;
      this.tableData = [{ "id": 1610101572003, "name": "数据字典", "pid": 1610101532003, "seq": 71, "url": "/systemmenu/systemdatadic.do" }, { "description": "memberspointMenu", "icon": "icon-gift", "id": 1703141548000, "name": "积分管理", "seq": 9 }, { "description": "facetofaceMenu", "icon": "icon-flag\t", "id": 1701031034001, "name": "面对面购买", "seq": 12 }, { "id": 1701031034000, "name": "信息反馈", "pid": 1611151531000, "seq": 1, "url": "/feedback/consult.do" }, { "id": 1610251110085, "name": "卡务管理", "pid": 1609301532001, "seq": 25, "url": "/merchant/merchantcardmanager.do" }, { "id": 1610101552001, "name": "消费次数统计", "pid": 1610101532001, "seq": 51, "url": "/statistics/spendTimeStatistics.do" }, { "id": 1610101552002, "name": "消费金额统计", "pid": 1610101532001, "seq": 52, "url": "/statistics/buyMoneyStatistics.do" }, { "description": "profileMenu", "icon": "icon-info-sign", "id": 1609301534001, "name": "个人信息", "seq": 4 }, { "description": "goodsorderMenu", "icon": "icon-list", "id": 1703141447000, "name": "商品订购", "seq": 10 }, { "id": 1609301534003, "name": "商户查询", "pid": 1609301532001, "seq": 22, "url": "/merchant/menuquery.do" }, { "id": 1609301534002, "name": "商户注册", "pid": 1609301532001, "seq": 21, "url": "/merchant/menuregister.do" }, { "id": 1704151150000, "name": "微信转账查询", "pid": 1609301532001, "seq": 27, "url": "/merchant/wxtransferQuery.do" }, { "id": 1704251107017, "name": "取货数量统计", "pid": 1703141447000, "seq": 103, "url": "/goodsorder/pickupstatisticsmanager.do" }, { "id": 1609301534005, "name": "商户设置", "pid": 1609301532001, "seq": 24, "url": "/merchant/menusetpayment.do" }, { "id": 1609301534004, "name": "商户缴费", "pid": 1609301532001, "seq": 23, "url": "/merchant/menupayment.do" }, { "id": 1706152023000, "name": "特价商品管理", "pid": 1706151018000, "seq": 1, "url": "/goodstime/goods.do" }, { "id": 1704251107018, "name": "订单管理", "pid": 1703141447000, "seq": 105, "url": "/goodsorder/unsubscribemanager.do" }, { "id": 1706200910154, "name": "宣传栏管理", "pid": 1703141447000, "seq": 108, "url": "/goodsorder/xclmanager.do" }, { "id": 1706200930184, "name": "商品仓库", "pid": 1703141447000, "seq": 106, "url": "/goodsorder/gotogoodsstoremanage.do" }, { "id": 1706200914160, "name": "商品管理", "pid": 1703141447000, "seq": 107, "url": "/goodsorder/goodsmanage.do" }, { "id": 1801050945000, "name": "会员消费统计", "pid": 1610101532001, "seq": 54, "url": "/statistics/gotomemberconsumestatistics.do" }, { "description": "memberMenu", "icon": "icon-gift", "id": 1609301533001, "name": "会员管理", "seq": 3 }, { "id": 1610101562002, "name": "菜单权限管理", "pid": 1610101532002, "seq": 62, "url": "/authorization/menuIndex.do" }, { "id": 1705171524000, "name": "订单查询", "pid": 1701031034001, "seq": 111, "url": "/mdmgm/ordermanage.do" }, { "id": 1610101562003, "name": "功能权限管理", "pid": 1610101532002, "seq": 63, "url": "/authorization/operateIndex.do" }, { "id": 1612141706000, "name": "最后消费时间统计", "pid": 1610101532001, "seq": 53, "url": "/statistics/spendInactiveStatistics.do" }, { "id": 1610101562001, "name": "用户信息管理", "pid": 1610101532002, "seq": 61, "url": "/authorization/userIndex.do" }, { "description": "systemMenu", "icon": "icon-cogs", "id": 1610101532003, "name": "系统管理", "seq": 7 }, { "description": "authorizationMenu", "icon": "icon-lock", "id": 1610101532002, "name": "权限管理", "seq": 6 }, { "description": "statisticsMenu", "icon": "icon-bar-chart", "id": 1610101532001, "name": "统计分析", "seq": 5 }, { "id": 1610101562004, "name": "资源管理", "pid": 1610101532002, "seq": 64, "url": "/authorization/resourceIndex.do" }, { "id": 1609301536002, "name": "商户资料", "pid": 1609301534001, "seq": 42, "url": "/profile/gotomerchantdata.do" }, { "id": 1704251108019, "name": "账目核对", "pid": 1703141447000, "seq": 104, "url": "/goodsorder/accountmanage.do" }, { "id": 1609301536003, "name": "商户缴费", "pid": 1609301534001, "seq": 43, "url": "/profile/gotomerchantpay.do" }, { "id": 1706200938191, "name": "取货明细管理", "pid": 1703141447000, "seq": 101, "url": "/goodsorder/gotoqhmxmanager.do" }, { "id": 1609301536001, "name": "会员资料", "pid": 1609301534001, "seq": 41, "url": "/profile/gotomemberdata.do" }, { "id": 1609301536006, "name": "消费明细", "pid": 1609301534001, "seq": 46, "url": "/profile/gotodealdetail.do" }, { "id": 1609301536007, "name": "购买设置", "pid": 1609301534001, "seq": 47, "url": "/profile/gotobuyconfig.do" }, { "description": "merchantMenu", "icon": "icon-group", "id": 1609301532001, "name": "商户管理", "seq": 2 }, { "id": 1704251108020, "name": "客服中心", "pid": 1703141447000, "seq": 110, "url": "/goodsorder/feedbackquestion.do" }, { "id": 1609301536004, "name": "卡务管理", "pid": 1609301534001, "seq": 44, "url": "/profile/gotocardmanage.do" }, { "id": 1609301536005, "name": "会员缴费", "pid": 1609301534001, "seq": 45, "url": "/profile/gotomemberpay.do" }, { "id": 1801151719000, "name": "会员卡设置", "pid": 1609301532001, "seq": 31, "url": "/merchant/merchant_buyConfig.do" }, { "id": 1705171525002, "name": "销售统计", "pid": 1701031034001, "seq": 113, "url": "/mdmgm/salesStatistics.do" }, { "id": 1610281312277, "name": "密钥管理", "pid": 1610101532003, "seq": 73, "url": "/system/keyManage.do" }, { "id": 1705171525001, "name": "取货查询", "pid": 1701031034001, "seq": 112, "url": "/mdmgm/orderdetailsmanage.do" }, { "id": 1706141431197, "name": "交易退款", "pid": 1609301532001, "seq": 29, "url": "/merchant/chtkQuery.do" }, { "id": 1704251109021, "name": "提醒设置", "pid": 1703141447000, "seq": 111, "url": "/goodsorder/gotogoodsordermanage.do" }, { "id": 1707041754000, "name": "机器设置", "pid": 1703141447000, "seq": 112, "url": "/goodsorder/gotomachinesmanage.do" }, { "id": 1706200924176, "name": "预订卡管理", "pid": 1703141447000, "seq": 109, "url": "/goodsorder/bookcardshow.do" }, { "id": 1611071425000, "name": "优惠设置", "pid": 1609301532001, "seq": 26, "url": "/merchant/merchantBenefitSet.do" }, { "id": 1609301535003, "name": "会员查询", "pid": 1609301533001, "seq": 33, "url": "/member/gotomemberquery.do" }, { "id": 1706061657012, "name": "支付宝转账查询", "pid": 1609301532001, "seq": 28, "url": "/merchant/zfbtransferQuery.do" }, { "id": 1609301535002, "name": "会员注册（业务员）", "pid": 1609301533001, "seq": 32, "url": "/member/gotosalesmanregister.do" }, { "id": 1609301535001, "name": "会员注册", "pid": 1609301533001, "seq": 31, "url": "/member/gotomemberregister.do" }, { "description": "indexMenu", "icon": "icon-home", "id": 1609301531000, "name": "首页", "seq": 1, "url": "/index.do" }, { "id": 1609301535005, "name": "充值明细", "pid": 1609301533001, "seq": 35, "url": "/member/gotomemberrechargedetail.do" }, { "id": 1610141717000, "name": "授权管理", "pid": 1610101532003, "seq": 72, "url": "/system/authorizationManage.do" }, { "description": "goodstimeMenu", "icon": "icon-list", "id": 1706151018000, "name": "特价商品管理", "seq": 13 }, { "id": 1706191854000, "name": "交易记录查询", "pid": 1609301532001, "seq": 30, "url": "/merchant/transctoinrecode.do" }, { "description": "feedbackMenu", "icon": "icon-comments", "id": 1611151531000, "name": "信息反馈", "seq": 8 }, { "id": 1704251104015, "name": "积分规则", "pid": 1703141548000, "seq": 91, "url": "/point/gotomemberpointmanage.do" }, { "id": 1704251106016, "name": "订货数量统计", "pid": 1703141447000, "seq": 102, "url": "/goodsorder/orderstatisticsmanager.do" }];
      // }).catch(error => {
      // Message.error("error：" + "请检查网络是否连接");
      // });
    },
    onloadtable1() { //查询菜单
      // request({ url: 'mall/sh/searchsh.do', method: 'post', data: txmxcxData }).then(response => {
      // this.zyglmenu = [];
      console.log('我给菜单刷新了')
      // }).catch(error => {
      // Message.error("error：" + "请检查网络是否连接");
      // });
    }
  }
};

</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.smain {
  padding: 10px;
  position: relative;
}

.smain:before,
.smain:after {
  display: table;
  content: "";
  clear: both
}

.box-card {
  width: 35%;
  position: relative;
  float: left;
  margin-right: 30px;
}

.feature {
  /*position: absolute;*/
  width: 60%;
}

.el-table {
  border: 0;
}

.el-form-item {
  margin: 15px 0;
}

</style>
