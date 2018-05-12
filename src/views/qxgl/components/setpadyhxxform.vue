<template>
  <div class="smain">
    <el-form ref="form" :rules="rules2" class="addsublime" label-width="100px" :inline="false" :model="form">
      <el-form-item label="登录名" prop="dlm">
        <el-input v-model="form.dlm"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="dlm">
        <el-input v-model="form.dlm"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="dlm">
        <el-input v-model="form.dlm"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="dlm">
        <el-input v-model="form.dlm"></el-input>
      </el-form-item>
      <el-form-item label="所属角色" prop="ssjs">
        <el-select v-model="form.ssjs" multiple collapse-tags placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
export default {
  props: ["dialogVisible"],
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
    };
    return {
      form: {
        dlm: '',
        ssjs: '',
      },
      rules2: {
        dlm: [{ validator: validdlmc, trigger: 'blur' }],
        ssjs: [{ validator: validdlmc, trigger: 'blur' }],
      },
      options: [
        { value: '0', label: '商户角色' },
        { value: '1', label: '会员角色' },
        { value: '2', label: '商户管理角色' },
        { value: '3', label: '商品预定' },
        { value: '4', label: '面对面购买' },
        { value: '5', label: '特价商品设置' },
        { value: '6', label: '用户增加会员功能' },
      ],
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
      this.$emit("dialog1Changed", 2);
    },
    initialize() { ////////////////////////进入初始化
      this.form = { dlm: '', ssjs: [], };
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
