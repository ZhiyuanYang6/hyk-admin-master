<template>
  <div class="smain">
    <el-form ref="form" :model="formInline" label-width="80px" size="small" label-position="left">
      <el-form-item label="标题">
        <el-input v-model="formInline.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="渠道">
        <el-select v-model="formInline.qdId1" filterable placeholder="消息类型">
          <el-option v-for="item in optjszt" :key="item.value" :label="item.qdName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" v-show="(listrow.btn=='发布')">
        <el-radio-group v-model="formInline.yhlx" size="small">
          <el-radio-button label=0>用户</el-radio-button>
          <el-radio-button label=1>会员等级</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户" v-if="formInline.yhlx==0">
        <el-input disabled v-model="formInline.user" placeholder="查询选择" style="width:280px;"></el-input>
        <el-button type="warning" @click="settableuser()" v-if="(listrow.btn!=='修改')" style="margin-left: 10px">查询</el-button>
      </el-form-item>
      <el-form-item label="会员等级" v-else>
        <el-checkbox-group v-model="formInline.memberLevel" :disabled="(listrow.btn=='修改')">
          <el-checkbox label="1" name="type">普通</el-checkbox>
          <el-checkbox label="2" name="type">银卡</el-checkbox>
          <el-checkbox label="3" name="type">金卡</el-checkbox>
          <el-checkbox label="4" name="type">铂金</el-checkbox>
          <el-checkbox label="5" name="type">钻石</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="消费类型">
        <el-radio-group v-model="formInline.type" size="small">
          <el-radio-button label="0">公告</el-radio-button>
          <el-radio-button label="1">私信</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息内容">
        <el-input type="textarea" :rows="5" v-model="formInline.detail"></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button style="margin-left:5%;" type="info" @click="resetForm">取消</el-button>
        <el-button style="float: right;margin-right:35%;" type="primary" @click="saveMessage('form')">{{listrow.btn}}</el-button>
      </el-form-item>
    </el-form>
    <!-- el-dialog -->
    <el-dialog title="用户列表" :visible.sync="dialogTableUser" width="40%" append-to-body center>
      <el-table :data="tableData1" ref="multipleTable" border style="width:100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column prop="id" label="用户id" align="center"></el-table-column>
        <el-table-column prop="name" label="用户名" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableUser = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request';
export default {
  props: ['listrow', "dialogTableVisible"],
  data() {
    return {
      formInline: {
        title: '',
        qdId1: '',
        user: '',
        yhlx: '',
        hydj: '',
        type: '',
        detail: ''
      },
      optjszt: [
        { value: '0', label: '结算状态' },
        { value: '1', label: '已结算' },
        { value: '2', label: '未结算' }
      ],
      dialogTableUser: false,
      tableData1: [],
      tablelistrow: '',
    };
  },
  watch: {
    dialogTableVisible: function(data, olddata) {
      if (data) {
        this.initialize();
      } else {
        this.$refs['form'].resetFields();
      }
    },
    dialogTableUser: function(data, olddata) {
      // if (data) { this.settableuser(); }
    }
  },
  created: function() {
    this.initialize();
  },
  methods: {
    saveMessage(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url;
          let queryShjData;
          if (this.listrow.btn === "修改") {
            url = "card/message/updateMessage.do";
            console.log(this.formInline);
            queryShjData = {
              title: this.formInline.title,
              qd: this.formInline.qdId1,
              id: this.formInline.id,
              xflx: this.formInline.type,
              messagetext: this.formInline.detail,
            };
          } else {
            url = "card/message/addMultiMessage.do";
            queryShjData = {
              title: this.formInline.title,
              qd: this.formInline.qdId1,
              yhlx: this.formInline.yhlx,
              id: this.formInline.id,
              hydj: this.formInline.memberLevel,
              xflx: this.formInline.type,
              messagetext: this.formInline.detail,
            };
          }
          request({ url: url, method: 'post', data: queryShjData }).then((response) => {
            debugger
            if (response.code == "1") {
              this.$message({ type: 'success', message: response.msg });
            } else {
              this.$message({ type: 'error', message: response.msg });
            }
            this.resetForm();
            this.$refs['form'].resetFields();
          }).catch((err) => {});
        }
      });
    },
    dialogUser() {
      request({ url: 'card/member/queryAllmember.do', method: 'post', data: {} }).then((response) => {
        this.tableData1 = response.data.data;
      }).catch((err) => {});
    },
    settableuser(row) {
      this.dialogTableUser = true;
      if (this.listrow.onece) { return; }
      setTimeout(() => {
        this.listrow.onece = true;
        for (let key in this.tableData1) {
          if (this.tableData1[key].name === this.formInline.user) {
            this.$refs.multipleTable.toggleRowSelection(this.tableData1[key]);
          }
        }
      }, 1);
    },
    queryAllQd() {
      request({ url: 'card/qd/queryAllQd.do', method: 'post', data: {} }).then((response) => {
        this.optjszt = response.data.data;
      }).catch((err) => {});
    },
    handleSelectionChange(val) {
      this.formInline.user = "";
      this.formInline.id = [];
      for (var i = 0; i < val.length; i++) {
        this.formInline.id.push(val[i].id);
        if (i === 0) {
          this.formInline.user = val[i].name;
        } else if (val === "") {
          this.formInline.user = "";
        } else {
          this.formInline.user += "、" + val[i].name;
        }
      }
    },
    initialize() { ////////////////////////进入初始化
      this.listrow.onece = false;
      this.dialogUser();
      this.queryAllQd();
      if (this.listrow.btn === "修改") {
        this.formInline = this.listrow;
        if (this.listrow.memberLevel !== "") {
          this.formInline.yhlx = 1;
          this.formInline.memberLevel = (typeof this.formInline.memberLevel !== 'string') ? this.formInline.memberLevel : [this.formInline.memberLevel];
        } else {
          this.formInline.user = this.listrow.name;
          this.formInline.yhlx = 0;
        }
      } else {
        this.formInline = { memberLevel: [], yhlx: 0 };
      }
    },

    resetForm(formName) {
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
  }
};

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
}

div.el-select,
div.el-textarea,
div.el-input {
  width: 350px;
}

.el-checkbox+.el-checkbox {
  margin-left: 10px;
}

div.el-dialog__footer {
  padding: 19px 0;
}

</style>
