<template>
  <div class="smain">
    <el-form ref="form" class="addsublime" label-width="100px" :inline="false" :model="form">
      <el-form-item label="登录名">
        <el-input v-model="form.loginName" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属角色" prop="ssjs" v-show="!listrow.btn">
        <el-select v-model="form.ssjs" multiple placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" plain @click="ADSubmit">取消</el-button>
        <el-button class="subbtn" type="warning" @click="setsubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['listrow', "dialogVisible", 'options'],
  data() {
    return {
      form: {
        loginName: '',
        ssjs: '',
      },
    }
  },
  created: function() {
    this.initialize();
  },
  watch: {
    dialogVisible: function(data, olddata) {
      if (data) {
        this.initialize();
      }
    }
  },
  methods: {
    setsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form);
          // this.form.aaa = '';
          // this.form.ssjs.forEach(item => {
          //   this.form.aaa += item;
          // })
          // console.log(this.form.aaa);
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
      console.log(this.listrow);
      // this.form.loginName = this.listrow.loginName;
      // this.form.name = this.listrow.modifyName;
      // this.form.name = this.listrow.name;
      // this.form.name = this.listrow.name;
      // request({ url: url, method: 'post', data: dataDl }).then((response) => {
      // this.form.ssjs = response.data;
      // }).catch((err) => {
      // this.$message({ type: 'error', message: "请检查网络连接" });
      // });
      this.form = { loginName: this.listrow.loginName, ssjs: [1285655680, 1285655681] };
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
