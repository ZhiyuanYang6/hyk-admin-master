<template>
  <div>
    <el-form ref="form" class="addsublime" :rules="rules2" style="padding:30px 10px 10px 0;" :model="form" label-width="80px">
      <el-form-item label="小类代码" prop="xldm">
        <el-input v-model="form.xldm"></el-input>
      </el-form-item>
      <el-form-item label="小类名称">
        <el-input v-model="form.xlmc"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :rows="4" v-model="form.bz" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" @click="addXlInfo('form')">{{listrow.btn}}</el-button>
        <el-button class="subbtn" type="warning" @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['listrow', "dialogxlVisible"],
  data() {
    var validxldm = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('内容不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      form: {
        xldm: '',
        xlmc: '',
        bz: '',
      },
      rules2: {
        xldm: [{ validator: validxldm, trigger: 'blur' }],
      },
    }
  },
  watch: {
    dialogxlVisible: function(data, olddata) {
      this.$refs['form'].resetFields(); //重置表单
      this.initialize();
    }
  },
  created: function() {
    this.initialize();
  },
  methods: {
    addXlInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url;
          if (this.listrow.btn == "修改") {
            url = "card/dic/modifyxl.do";
          } else {
            url = "card/dic/addXlname.do";
          }
          var param = { parentName: this.form.dlmc, parentCode: this.form.dlcode, code: this.form.xldm, name: this.form.xlmc, remark: this.form.bz };
          request({ url: url, method: 'post', data: param }).then((response) => {
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
        this.form = { xldm: this.listrow.code, xlmc: this.listrow.name, bz: '', dlmc: this.listrow.parentName, dlcode: this.listrow.parentCode };
      } else {
        this.form = { dlmc: this.listrow.currentdlRow.parentName, dlcode: this.listrow.currentdlRow.parentCode, xldm: this.listrow.xldm };
      }
    },
    resetForm(formName) {
      this.$emit("dialogxlChanged", 0); //发送参数到父组件 事件名，参数
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
  width: 300px;
  margin-right: 20px;
}

div.el-textarea {
  width: 300px;
}

.subbtn {
  float: right;
  margin-right: 80px;
}

.el-form,
.addsublime {
  padding: 20px 0;
}

</style>
