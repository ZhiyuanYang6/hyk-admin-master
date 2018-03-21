<template>
  <div class="zlmain">
    <el-card class="box-card" :body-style="{padding:'0px 10px'}">
      <div class="del">
        <p>
          <span>生&nbsp;&nbsp; 日&nbsp;&nbsp;：</span>
          <span>{{hyzl.sr}}</span>
        </p>
        <p>
          <span>邮&nbsp;&nbsp; 箱&nbsp;&nbsp;：</span>
          <span>{{hyzl.yx}}</span>
        </p>
        <p>
          <span>银行卡1：</span>
          <span>{{hyzl.yhk1}}</span>
        </p>
      </div>
      <div class="del" style="padding-right: 20px;">
        <p>
          <span>联系地址：</span>
          <span>{{hyzl.lxdz}}</span>
        </p>
        <p>
          <span>所属地区：</span>
          <span>{{hyzl.ssqy}}</span>
        </p>
        <p>
          <span>银行卡 2：</span>
          <span>{{hyzl.yhk2}}</span>
        </p>
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
  },
  data() {
    return {
      hyzl: {
        sr: "11月23日",
        yx: "132999@qq.com",
        lxdz: "长沙市岳麓区",
        ssqy: "湖南省长沙市",
        yhk1: "62888",
        yhk2: "690988"
      }
    }
  }
}

</script>
<style type="text/css" scoped>
.zlmain {
  position: relative;
  height: 200px;
  top: 20px;
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
