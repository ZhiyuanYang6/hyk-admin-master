<template>
  <div class="zlmain">
    <hr>
    <el-card class="box-card" :body-style="{padding:'0px 10px'}">
      <div class="del">
        <p>
          <span>姓&nbsp;&nbsp; 名&nbsp;&nbsp;：</span>
          <span>{{hyzlrow.name}}</span>
        </p>
        <p>
          <span>邮&nbsp;&nbsp; 箱&nbsp;&nbsp;：</span>
          <span>{{hyzlrow.email}}</span>
        </p>
      </div>
      <div class="del" style="padding-right: 20px;">
        <p>
          <span>联系电话：</span>
          <span>{{hyzlrow.phone}}</span>
        </p>
        <p>
          <span>联系地址：</span>
          <span>{{hyzlrow.address}}</span>
        </p>
      </div>
    </el-card>
  </div>
</template>
<script type="text/javascript">
export default {
  props: ["hyzlrow"],
  data() {
    return {
      kfzl: {}
    }
  }
}

</script>
<style type="text/css" scoped>
.zlmain {
  position: relative;
  height: 180px;
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
