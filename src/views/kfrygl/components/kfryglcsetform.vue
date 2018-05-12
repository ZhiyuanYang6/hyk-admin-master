<template>
  <div class="lccpupform">
    <hr>
    <el-form ref="form" :rules="rules2" class="addsublime" :inline="true" :model="form">
      <el-form-item label="客服名称" prop="dlmc">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="dlmc">
        <el-select v-model="form.sex" placeholder="请选择" clearable>
          <el-option v-for="item in listrow.options" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证" prop="dlmc">
        <el-input v-model="form.idCard"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="dlmc">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="dlmc">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="dlmc">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="dlmc">
        <el-input v-model="form.remark"></el-input>
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
        name: '',
        sex: '',
        idCard: '',
        phone: '',
        address: '',
        email: '',
        remark: '',
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
            url = "card/customService/modifyCustomService.do";
            console.log(this.listrow);
            debugger;
            dataDl = {
              id: this.listrow.id,
              name: this.form.name,
              sex: this.form.sex,
              idCard: this.form.idCard,
              phone: this.form.phone,
              address: this.form.address,
              email: this.form.email,
              remark: this.form.remark,
            };
          } else {
            url = "card/customService/addCustomService.do";
            dataDl = {
              name: this.form.name,
              sex: this.form.sex,
              idCard: this.form.idCard,
              phone: this.form.phone,
              address: this.form.address,
              email: this.form.email,
              remark: this.form.remark,
            };
          }

          console.log(this.form);
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
