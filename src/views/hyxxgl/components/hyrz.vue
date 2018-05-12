<template>
  <div class="zlmain">
    <el-card class="box-card" :body-style="{padding:'0px 10px'}">
      <div class="del">
        <p>
          <span>会员等级：</span>
          <span>{{hyzlrow.level}}</span>
        </p>
        <p>
          <span>手机号 &nbsp;&nbsp;：</span>
          <span>{{hyzlrow.phone}}</span>
        </p>
        <p></p>
        <div style="text-align: center;">
          <el-button type="danger" size="mini" round @click="rzsubmit(2)">认证不通过</el-button>
        </div>
      </div>
      <div class="del" style="padding-right: 20px;">
        <p>
          <span>姓名 &nbsp;&nbsp;：</span style="margin-right:5px;">
        <span>{{hyzlrow.name}}</span>
        </p>
        <p>
          <span>身份证：</span>
          <span>{{hyzlrow.idCard}}</span>
        </p>
        <p></p>
        <div style="text-align: center;">
          <el-button size="mini" type="success" round class="passbtn" @click="rzsubmit(1)">认证通过</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script type="text/javascript">
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['hyzlrow'],
  data() {
    return {}
  },
  methods: {
    rzsubmit(val) {
      console.log(val);
      console.log(this.hyzlrow.id);
      var queryShjData = {
        checkStatus: val,
        memberId: this.hyzlrow.id,
      }
      request({ url: 'card/member/updateCheckStatusByMemberId.do', method: 'post', data: queryShjData }).then((response) => {
        this.$message({ type: 'success', message: "认证状态成功修改为" + val ? "通过" : '不通过' });
        this.resetForm();
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接" });
      })
    },
    resetForm(formName) {
      this.$emit("childchanged", 0); //发送参数到父组件 事件名，参数
    },
  }
}

</script>
<style type="text/css" scoped>
.zlmain {
  position: relative;
  height: 200px;
  top: 20px;
}

.fr {
  float: right;
}

div.del {
  float: left;
  width: 50%;
  padding: 10px 0;
}

div.del p {
  float: left;
  margin: 5px;
  width: 100%;
}

.passbtn {
  padding: 10px 30px;
}

</style>
