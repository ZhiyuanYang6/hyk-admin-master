<template>
  <div class="zlmain">
    <hr>
    <!-- <el-card class="box-card" :body-style="{padding:'0px 10px'}"> -->
    <div class="del">
      <!--         <p>
          <span>会员等级：</span>
          <span>{{listrow.level}}</span>
        </p>
        <p>
          <span>手机号 &nbsp;&nbsp;：</span>
          <span>{{listrow.phone}}</span>
        </p>
        <p></p> -->
      <div style="text-align: center;">
        <el-button type="danger" size="mini" round @click="rzsubmit(2,'warning')">审核不通过</el-button>
      </div>
    </div>
    <div class="del" style="padding-right: 20px;">
      <!--   <p>
          <span>姓名 &nbsp;&nbsp;：</span style="margin-right:5px;">
        <span>{{listrow.name}}</span>
        </p>
        <p>
          <span>身份证：</span>
          <span>{{listrow.idCard}}</span>
        </p>
        <p></p> -->
      <div style="text-align: center;">
        <el-button size="mini" type="success" round class="passbtn" @click="rzsubmit(1,'success')">审核通过</el-button>
      </div>
    </div>
    <!-- </el-card> -->
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['listrow'],
  data() {
    return {
      form: {
        exitfd: '',
      },
    };
  },
  methods: {
    rzsubmit(val, lx) {
      var queryShjData = {
        checkStatus: val,
        id: this.listrow.id,
        memberId: this.listrow.memberId,
        productId: this.listrow.productId,
        je: this.listrow.je,
      }
      request({ url: 'card/memberpercentagetemp/updateCheckState.do', method: 'post', data: queryShjData }).then((response) => {
        this.$message({ type: lx, message: "审核状态成功修改为" + (val == 1 ? "通过" : '不通过') });
        this.resetForm();
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接" });
      })
    },
    resetForm(formName) {
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
  },
}

</script>
<style scoped>
/*scoped*/

.zlmain {
  position: relative;
  height: 90px;
  top: 20px;
}

.fr {
  float: right;
}

hr {
  margin-top: -20px;
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
