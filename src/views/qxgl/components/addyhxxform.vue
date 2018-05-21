<template>
  <div class="smain">
    <el-form ref="form" :rules="rules2" class="addsublime" label-width="100px" :inline="false" :model="form">
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="form.logname"></el-input>
      </el-form-item>
      <!-- <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item> -->
      <el-form-item label="密码" prop="paw">
        <el-input v-model="form.paw" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="pawagin">
        <el-input v-model="form.pawagin" type="password"></el-input>
      </el-form-item>
      <el-form-item label="所属角色">
        <el-select v-model="form.ssjs" multiple collapse-tags placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" plain @click="ADSubmit">取消</el-button>
        <el-button class="subbtn" type="warning" @click="addsubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  props: ['options', "dialogVisible"],
  data() {
    var validdlmc = (rule, value, callback) => {
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
    }
    var validdlpawagin = (rule, value, callback) => {
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
    }

    return {
      form: {
        logname: '',
        paw: '',
        pawagin: '',
        ssjs: '',
      },
      rules2: {
        logname: [{ validator: validdlmc, trigger: 'blur' }],
        username: [{ validator: validdlmc, trigger: 'blur' }],
        paw: [{ validator: validdlmc, trigger: 'blur' }],
        pawagin: [{ validator: validdlpawagin, trigger: 'blur' }],
      },
    }
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
          request({ url: "card/user/addUser.do", method: 'post', data: this.form }).then((response) => {
            this.$message({ type: 'success', message: "添加成功" });
            this.ADSubmit();
          }).catch((err) => {
            this.$message({ type: 'error', message: "请检查网络连接" });
          });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    ADSubmit() { //发送参数到父组件 事件名，参数
      this.$emit("dialog1Changed", 0);
    },
    initialize() { ////////////////////////进入初始化
      this.form = { dlm: '', ssjs: [] };
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
