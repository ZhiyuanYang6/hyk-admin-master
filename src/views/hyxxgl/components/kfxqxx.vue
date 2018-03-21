<template>
  <div class="zlmain">
    <el-card class="box-card" :body-style="{padding:'0px 10px'}">
      <div class="del">
        <p>
          <span>姓&nbsp;&nbsp; 名&nbsp;&nbsp;：</span>
          <span>{{kfzl.xm}}</span>
        </p>
        <p>
          <span>邮&nbsp;&nbsp; 箱&nbsp;&nbsp;：</span>
          <span>{{kfzl.yx}}</span>
        </p>
      </div>
      <div class="del" style="padding-right: 20px;">
        <p>
          <span>联系电话：</span>
          <span>{{kfzl.lxdh}}</span>
        </p>
        <p>
          <span>联系地址：</span>
          <span>{{kfzl.lxdz}}</span>
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
      kfzl: {
        xm: "李四",
        yx: "430123455@qq.com",
        lxdh: "13811111122",
        lxdz: "湖南省长沙市"
      }
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
