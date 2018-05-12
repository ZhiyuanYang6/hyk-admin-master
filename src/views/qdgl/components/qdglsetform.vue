<template>
  <div class="lccpupform">
    <hr>
    <el-form ref="form" :rules="rules2" class="addsublime" label-width="80" :inline="true" :model="form">
      <el-form-item label="渠道名称" prop="dlmc">
        <el-input v-model="form.qdName"></el-input>
      </el-form-item>
      <el-form-item label="渠道类型" prop="dlmc">
        <el-select v-model="form.type" placeholder="请选择" clearable>
          <el-option v-for="item in listrow.options" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="dlmc">
        <el-input v-model="form.linkMan"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="dlmc">
        <el-input v-model="form.phone"></el-input>
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
        qdName: '',
        type: '',
        linkMan: '',
        phone: '',
        remark: '',
      },
      rules2: {
        productName: [{ validator: validdlmc, trigger: 'blur' }],
      },
    }
  },

  watch: {
    dialogdlVisible: function(data, olddata) {
      if (data) {
        this.$refs['form'].resetFields();
        this.initialize();
      }
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
            url = "card/qd/modifyqd.do";
            console.log(this.listrow);
            debugger;
            dataDl = {
              id: this.listrow.id,
              qdName: this.form.qdName,
              type: this.form.type,
              linkMan: this.form.linkMan,
              phone: this.form.phone,
              remark: this.form.remark,
            };
          } else {
            url = "card/qd/addqd.do";
            dataDl = {
              qdName: this.form.qdName,
              type: this.form.type,
              linkMan: this.form.linkMan,
              phone: this.form.phone,
              remark: this.form.remark,
            };
          }
          console.log(this.form);
          request({ url: url, method: 'post', data: dataDl }).then((response) => {
            debugger;
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
  left: 300%;
  /*float: right;*/
}

.el-form,
.addsublime {
  padding: 20px 0;
}

</style>
