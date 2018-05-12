<template>
  <div class="smain" @mouseover="Moveradd()">
    <el-card class="box-card img" :body-style="{padding:'5px'}">
      <img src="http://pic.qiantucdn.com/58pic/28/40/34/96758PIC9y6_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center/crop/0x1009a0a0"></img>
    </el-card>
    <el-card class="box-card sp" :body-style="{padding:'5px'}">
      <span class="title">商品</span>
      <el-table size="mini" :data="tableData1" class="table1" border>
        <el-table-column prop="name" label="名称" align="center"> </el-table-column>
        <el-table-column prop="dj" sortable='custom' label="单价" align="center"> </el-table-column>
        <el-table-column prop="sl" label="数量" align="center"> </el-table-column>
        <el-table-column prop="je" label="金额" align="center"> </el-table-column>
        <el-table-column prop="yh" label="优惠" align="center"> </el-table-column>
        <el-table-column prop="je" label="金额" align="center"></el-table-column>
        <el-table-column prop="xq" label="详情" align="center"></el-table-column>
        <el-table-column prop="bz" label="备注" align="center"></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card md" :body-style="{padding:'5px'}">
      <span class="title">门店</span>
      <div class="mdList mdLeft">
        <p><span>机器类型</span><span class="fr">{{mdlist.lx}}</span></p>
        <p><span>机器编码</span><span class="fr">{{mdlist.jqbm}}</span></p>
        <p><span>交易号</span><span class="fr">{{mdlist.jyh}}</span></p>
        <p><span>货道</span><span class="fr">{{mdlist.hd}}</span></p>
        <p><span>出货数量</span><span class="fr">{{mdlist.chsl}}</span></p>
        <p><span>出货状态</span><span class="fr">{{mdlist.chzt}}</span></p>
        <p><span>出货时间</span><span class="fr">{{mdlist.chsj}}</span></p>
      </div>
      <div class="mdList">
        <p><span>收款方式</span><span class="fr">{{mdlist.skfs}}</span></p>
        <p><span>收款金额</span><span class="fr">{{mdlist.skje}}</span></p>
        <p><span>找零</span><span class="fr">{{mdlist.zl}}</span></p>
        <p>
          <span>交易前机器库存</span>
          <el-button type="text" class="fr">查看出货详情</el-button>
          <span class="fr">{{mdlist.jyqjqkc}}</span>
        </p>
        <p>
          <span>软件版本</span>
          <el-button type="text" class="fr">查看该版本详情</el-button>
          <span class="fr" style="color: #E7262C" v-if="mdlist.uphas">（需更新）</span>
          <span class="fr">{{mdlist.rjbb}}</span>
        </p>
        <p><span>订单创建时间</span><span class="fr">{{mdlist.ddcjsj}}</span></p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: ['listrow', "uploadimagehas"],
  data() {
    return {
      tableData1: [{
        name: "Galaxy S9",
        dj: "9999",
        sl: "1",
        je: "9999",
        yh: "200",
        xq: "暂无",
        bz: "暂无",
        img: "http://pic.qiantucdn.com/58pic/28/40/34/96758PIC9y6_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center/crop/0x1009a0a0"
      }],
      sfklist: {
        fkje: "2元",
        tkjl: "已退款2元",
        tksj: "2017-11-7 11:14:11",
        dqzt: "已全额退款",
        zfsj: "2017-11-7 11:14:11",
        zffs: "微信的扫码",
        jydh: "421000004987546513213213",
        shdh: "AA42100000498754651321321"
      },
      mdlist: {
        lx: "无人售货机",
        jqbm: "1605600001",
        jyh: "6214",
        hd: "001",
        chsl: "0",
        chzt: "卡货",
        chsj: "2017-11-14 12:11:11",
        skfs: "微信扫码",
        skje: "2元",
        zl: "0",
        jyqjqkc: "255",
        rjbb: "2.43",
        ddcjsj: "2017-11-14 12:11:11",
        uphas: "false"
      },
      onceover: false,
    }
  },
  created: function() { //创建组件初始化
    this.onceover = true;
  },
  watch: {
    uploadimagehas: function(data, olddata) {
      if (data) {
        // debugger;
        console.log("uploadimagehas：" + data)
        this.onceover = data;
      }
    }
  },
  methods: {
    Moveradd() { ////////////////////////创建后进入组件初始化
      if (this.onceover) {
        this.onceover = false;
        console.log(this.listrow)
      }
    },
  },
  ADSubmit() { //发送参数到父组件 事件名，参数
    this.onceover = true;
    this.$emit("dialog1Changed", 0);
  },
}

</script>
<style scoped>
.title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #696E76;
  border-bottom: 1px solid #B6BCCC;
}

p {
  margin: 5px;
}

.fr {
  float: right;
}

div.img {
  position: absolute;
  top: 72px;
  right: 30px;
  width: 250px;
  height: 202px;
}

div.el-card__body {
  padding: 5px;
}

img {
  width: 100%;
}

div.sp {
  width: 73%;
  position: relative;
  top: 0;
  left: -10px
}

div.md .el-button--medium {
  padding: 4px 5px;
}

div.md {
  width: 100%;
  position: relative;
  top: 100px;
  left: -10px;
  margin-bottom: 100px;
}

div.md .mdList {
  width: 30%;
  float: left;
  margin-left: 20%
}

div.md div.mdLeft {
  margin-left: 5%;
}

</style>
