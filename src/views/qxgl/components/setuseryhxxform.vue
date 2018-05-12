<template>
  <div class="smain">
    <el-form ref="form" :rules="rules2" class="addsublime" label-width="100px" :inline="false" :model="form">
      <el-form-item label="登录名" v-show="!listrow.btn">
        <el-input v-model="form.dlm"></el-input>
      </el-form-item>
      <el-form-item label="姓名" v-show="!listrow.btn">
        <el-input v-model="form.dlm"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="paw">
        <el-input v-model="form.paw"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="apaw">
        <el-input v-model="form.apaw"></el-input>
      </el-form-item>
      <el-form-item label="所属角色" prop="ssjs" v-show="!listrow.btn">
        <el-select v-model="form.ssjs" multiple placeholder="请选择">
          <el-option v-for="item in options.ssjsopt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发卡权限" prop="fkqx" v-show="!listrow.btn">
        <el-select v-model="form.fkqx" multiple collapse-tags placeholder="请选择">
          <el-option v-for="item in options.fkqxopt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" plain @click="ADSubmit">取消</el-button>
        <el-button class="subbtn" type="warning" @click="addsubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['listrow', "dialogVisible"],
  data() {
    var validpaw = (rule, value, callback) => {
      if (!value || value.length == 0) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.length ? value : value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('内容不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    var validapaw = (rule, value, callback) => {
      if (!value || value.length == 0) {
        return callback(new Error('内容不能为空'));
      } else {
        value = value.length ? value : value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('内容不能为空'));
        } else {
          if (this.form.paw !== value) {
            return callback(new Error('密码不一致'));
          }
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      form: {
        dlm: '',
        paw: '',
        apaw: '',
        ssjs: '',
      },
      rules2: {
        paw: [{ validator: validpaw, trigger: 'blur' }],
        apaw: [{ validator: validapaw, trigger: 'blur' }],
        // ssjs: [{ validator: validdlmc, trigger: 'blur' }],
        // fkqx: [{ validator: validdlmc, trigger: 'blur' }],
      },
      options: '',
    }
  },
  created: function() {
    this.initialize();
  },
  watch: {
    dialogVisible: function(data, olddata) {
      if (data) {
        this.$refs['form'].resetFields();
        this.initialize();
      }
    }
  },
  methods: {
    addsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          // request({ url: url, method: 'post', data: dataDl }).then((response) => {
          this.$message({ type: 'success', message: "添加成功" });
          this.ADSubmit();
          // }).catch((err) => {
          //   this.$message({ type: 'error', message: "请检查网络连接" });
          // });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    ADSubmit() { //发送参数到父组件 事件名，参数
      this.$emit("dialog1Changed", 1);
    },
    initialize() { ////////////////////////进入初始化
      // request({ url: url, method: 'post', data: dataDl }).then((response) => {
      this.options = {
        ssjsopt: [
          { value: '0', label: '商户角色' },
          { value: '1', label: '会员角色' },
          { value: '2', label: '商户管理角色' },
          { value: '3', label: '商品预定' },
          { value: '4', label: '面对面购买' },
          { value: '5', label: '特价商品设置' },
          { value: '6', label: '用户增加会员功能' },
        ],
        fkqxopt: [
          { value: '0', label: '充值权限' },
          { value: '1', label: '发卡权限' },
          { value: '2', label: '发密钥卡权限' },
          { value: '3', label: '注销卡权限' },
        ],
      }
      // }).catch((err) => {
      //   this.$message({ type: 'error', message: "请检查网络连接" });
      // });
      this.form = { dlm: 'aaa', ssjs: ['2', '1'], fkqx: ['0', '2'] };
      // this.form = this.listrow;
    },
  },
}

</script>
<style scoped>
.smain {}

.el-input {
  width: 300px;
}

.subbtn {
  margin: 0 40px;
}

.el-select {
  width: 300px;
}

</style>
