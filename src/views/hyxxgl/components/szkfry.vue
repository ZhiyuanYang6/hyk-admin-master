<template>
  <div class="zlmain">
    <hr>
    <el-form ref="form" :rules="rules2" class="addsublime" :inline="true" :model="form">
      <el-form-item label="客服人员" prop="dlmc">
        <el-select v-model="form.customId" placeholder="请选择" clearable>
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" @click="lccpsetInfo('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['hyzlrow', 'dialogszkfryVisible'],
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
        customId: "",
        memberId: "",
      },
      rules2: {
        productName: [{ validator: validdlmc, trigger: 'blur' }],
      },
      options: []
    }
  },
  watch: {
    dialogszkfryVisible: function(data, olddata) {
      if (data) {
        this.initialize();
        this.$refs['form'].resetFields();
      }
    }
  },
  created: function() {
    this.initialize();
  },
  methods: {
    lccpsetInfo: function() {

      console.log(this.form.customId);
      console.log(this.hyzlrow.id);
      var queryShjData = {
        customId: this.form.customId,
        memberId: this.hyzlrow.id,
      }
      //用户没有选择客户人员提示操作用户
      if (!this.form.customId) {
        this.$message({ type: 'warning', message: '请选择客服人员' });
        return;
      }
      request({ url: 'card/membercustom/saveMemberCustomRelation.do', method: 'post', data: queryShjData }).then((response) => {
        debugger;
        if (response.code == "1") {
          // this.onloadtablexl({ parentCode: val.parentCode, parentName: val.parentName });
          this.$message({ type: 'success', message: response.msg });
          this.resetForm();
        } else {
          this.$message({ type: 'error', message: response.msg });
        }
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接" });
      })
    },
    initialize() { ////////////////////////进入初始化
      this.form = {
        customId: this.hyzlrow.customId,
      }
      this.options = this.hyzlrow.options;
      // request({ url: 'card/member/memberQueryPageList.do', method: 'post', data: this.form }).then((response) => {

      // }).catch((err) => {
      // this.loading = false
      // })
    },
    resetForm(formName) {
      this.$emit("childchanged", 0); //发送参数到父组件 事件名，参数
    },
  },
}

</script>
<style scoped>
.zlmain {
  padding: 10px;
}

.subbtn {
  position: relative;
  left: 200%;
  /*float: right;*/
}

</style>
