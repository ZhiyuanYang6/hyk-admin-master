<template>
  <div class="smain">
    <el-form ref="form" :model="formInline" label-width="80px" size="small" label-position="left">
      <el-form-item label="标题">
        <el-input v-model="formInline.title" style="width: 200px;" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="渠道">
        <el-select v-model="formInline.qd" filterable placeholder="消息类型" style="width:200px;">
          <el-option v-for="item in optjszt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户">
        <el-input disabled v-model="formInline.user" style="width: 200px;" placeholder=""></el-input>
        <el-button type="warning" @click="dialogUser()" style="margin-left: 20px">查询</el-button>
      </el-form-item>
      <el-form-item label="会员等级">
        <el-checkbox-group v-model="formInline.hydj">
          <el-checkbox label="0" name="type">钻石</el-checkbox>
          <el-checkbox label="1" name="type">黄金</el-checkbox>
          <el-checkbox label="2" name="type">白银</el-checkbox>
          <el-checkbox label="3" name="type">青铜</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="消费类型">
        <el-radio-group v-model="formInline.xflx" size="small">
          <el-radio-button label="0">公告</el-radio-button>
          <el-radio-button label="1">私信</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息内容">
        <el-input type="textarea" :rows="5" v-model="formInline.messagetext" style="width:280px;"></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button style="margin-left:5%;" type="info" @click="dialogTableVisible=false">取消</el-button>
        <el-button style="float: right;margin-right:35%;" type="primary" @click="ADSubmit">发布</el-button>
      </el-form-item>
    </el-form>
    <!-- el-dialog -->
    <el-dialog title="用户列表" :visible.sync="dialogTableUser" width="40%" append-to-body center>
      <el-table :data="tableData1
" border style="width:100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column prop="userid" label="用户id" align="center"></el-table-column>
        <el-table-column prop="user_name" label="用户名" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableUser = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["dialogTableVisible"],
  data() {
    return {
      formInline: {
        title: '',
        qd: '',
        user: '',
        hydj: ["0", '1'],
        xflx: '0',
        messagetext: ''
      },
      optjszt: [
        { value: '0', label: '结算状态' },
        { value: '1', label: '已结算' },
        { value: '2', label: '未结算' }
      ],
      dialogTableUser: false,
      tableData1: [
        { user_name: '张三', userid: '001', },
        { user_name: '李四', userid: '002', },
        { user_name: '王五', userid: '003', },
        { user_name: '麻子', userid: '004', }
      ],
    }
  },
  methods: {
    userBtn() {

    },
    dialogUser() {
      // debugger;
      this.dialogTableUser = true;
    },
    handleSelectionChange(val) {
      this.formInline.user = "";
      for (var i = 0; i < val.length; i++) {
        if (i == 0) {
          this.formInline.user = val[i].user_name;
        } else if (val == "") {
          debugger;
          this.formInline.user = "";
        } else {
          this.formInline.user += "、" + val[i].user_name;
        }
      }
    },
    ADSubmit() {
      this.$emit("dialog1Changed", false); //发送参数到父组件 事件名，参数
    }
  }
}

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
}

.el-checkbox+.el-checkbox {
  margin-left: 10px;
}

div.el-dialog__footer {
  padding: 19px 0;
}

</style>
