<template>
  <div class="lccpupform">
    <hr>
    <el-form ref="form" :rules="rules2" class="addsublime" :inline="true" :model="form">
      <el-form-item label="产品名称" prop="dlmc">
        <el-input v-model="form.productName"></el-input>
      </el-form-item>
      <el-form-item label="会员等级" prop="dlmc">
        <el-select v-model="form.memberLevel" placeholder="请选择" clearable>
          <el-option v-for="item in listrow.options" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="利率时长(天)" prop="dlmc">
        <el-input v-model="form.days"></el-input>
      </el-form-item>
      <el-form-item label="利率" prop="dlmc">
        <el-input v-model="form.percentage"></el-input>
      </el-form-item>
      <el-form-item label="起投金额" prop="dlmc">
        <el-input v-model="form.startJe"></el-input>
      </el-form-item>
      <el-form-item label="倍增金额" prop="dlmc">
        <el-input v-model="form.addJe"></el-input>
      </el-form-item>
      <el-form-item label="封顶金额(单用户)" prop="dlmc">
        <el-input v-model="form.fdJe"></el-input>
      </el-form-item>
      <el-form-item label="产品上线金额" prop="dlmc">
        <el-input v-model="form.maxJe"></el-input>
      </el-form-item>
      <el-form-item label="退出费率" prop="dlmc">
        <el-input v-model="form.exitpercentage"></el-input>
      </el-form-item>
      <el-form-item label="退出免手续费期限" prop="dlmc">
        <el-input v-model="form.exitnpdays"></el-input>
      </el-form-item>
      <el-form-item label="单日用户最多可退金额" prop="dlmc">
        <el-input v-model="form.exitmax"></el-input>
      </el-form-item>
      <el-form-item label="单日产品最多可退金额" prop="dlmc">
        <el-input v-model="form.exitfd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" @click="lccpsetInfo('form')">{{listrow.btn}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['listrow', "dialogdlVisible"],
  data() {
    var validdlmc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('大类名称不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('大类名称不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      form: {
        id: '',
        productName: '',
        memberLevel: '',
        days: '',
        percentage: '',
        startJe: '',
        addJe: '',
        fdJe: '',
        maxJe: '',
        exitpercentage: '',
        exitnpdays: '',
        exitmax: '',
        exitfd: '',
      },
      rules2: {
        productName: [{ validator: validdlmc, trigger: 'blur' }],
      },
    }
  },

  watch: {
    dialogdlVisible: function(data, olddata) {
      this.$refs['form'].resetFields();
      this.initialize();
    }
  },
  created: function() {
    this.initialize();
  },
  methods: {
    lccpsetInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url;
          var dataDl;
          if (this.listrow.btn == "修改") {
            url = "card/percentageSetting/modifyPercentageSetting.do";
            console.log(this.listrow);
            debugger;
            dataDl = {
              id: this.listrow.id,
              productName: this.form.productName,
              memberLevel: this.form.memberLevel,
              days: this.form.days,
              percentage: this.form.percentage,
              startJe: this.form.startJe,
              addJe: this.form.addJe,
              fdJe: this.form.fdJe,
              maxJe: this.form.maxJe,
              exitpercentage: this.form.exitpercentage,
              exitnpdays: this.form.exitnpdays,
              exitmax: this.form.exitmax,
              exitfd: this.form.exitfd,
            };
          } else {
            url = "card/percentageSetting/addPercentageSetting.do";
            dataDl = {
              productName: this.form.productName,
              memberLevel: this.form.memberLevel,
              days: this.form.days,
              percentage: this.form.percentage,
              startJe: this.form.startJe,
              addJe: this.form.addJe,
              fdJe: this.form.fdJe,
              maxJe: this.form.maxJe,
              exitpercentage: this.form.exitpercentage,
              exitnpdays: this.form.exitnpdays,
              exitmax: this.form.exitmax,
              exitfd: this.form.exitfd,
            };
          }
          request({ url: url, method: 'post', data: dataDl }).then((response) => {
            if (response.data.code == "1") {
              this.$message({ type: 'success', message: response.data.msg });
            } else {
              this.$message({ type: 'error', message: response.data.msg });
            }
            this.resetForm('from');
          }).catch((err) => {
            this.$message({ type: 'error', message: "请检查网络连接" });
          });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    initialize() { ////////////////////////进入初始化
      if (this.listrow.btn == "修改") {
        console.log(this.listrow);
        this.form = this.listrow;
      } else {
        this.form = { productName: '', hydj: '', llsc: '', };
      }
    },
    resetForm(formName) {
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
  },
}

</script>
<style scoped>
/*scoped*/

.smain {
  padding: 10px;
}


div.el-input {
  width: 210px;
  margin-right: 10px;
}

div.el-select {
  width: 210px;
}

.subbtn {
  position: relative;
  left: 950%;
  /*float: right;*/
}

.el-form,
.addsublime {
  padding: 20px 0;
}

</style>
