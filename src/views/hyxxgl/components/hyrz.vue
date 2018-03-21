<template>
  <div class="zlmain">
    <el-card class="box-card" :body-style="{padding:'0px 10px'}">
      <div class="del">
        <p>
          <span>会员等级：</span>
          <span>{{hyzlrow.hydj}}</span>
        </p>
        <p>
          <span>手机号 &nbsp;&nbsp;：</span>
          <span>{{hyzlrow.sjh}}</span>
        </p>
        <p></p>
        <div style="text-align: center;">
          <el-button type="danger" size="mini" round>认证不通过</el-button>
        </div>
      </div>
      <div class="del" style="padding-right: 20px;">
        <p>
          <span>姓名 &nbsp;&nbsp;：</span style="margin-right:5px;">
        <span>{{hyzlrow.xm}}</span>
        </p>
        <p>
          <span>身份证：</span>
          <span>{{hyzlrow.sfz}}</span>
        </p>
        <p></p>
        <div style="text-align: center;">
          <el-button size="mini" type="success" round>认证通过</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    hyzlrow: {
      type: Object
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

</style>
