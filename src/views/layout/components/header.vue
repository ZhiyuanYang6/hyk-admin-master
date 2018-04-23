<template>
  <div class="header">
    <el-row :gutter="10">
      <!--Logo area-->
      <el-col :xs="10" :sm="10" :md="{span:19,offset:1}">
        <div class="logo">
          <span class="logo_prefix">会员卡</span>
          <span class="logo_suffix">系统管理系统</span>
        </div>
      </el-col>
      <el-col style="  cursor: pointer" :xs="2" :sm="2" :md="1">
        <span style="color: #545C64;">1</span>
      </el-col>
      <el-col :xs="8" :sm="8" :md="2">
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span>
                <el-badge :value="3" class="sub item">
                  <i class="el-icon-date"></i></el-badge>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span class="pop-title">You have new tasks! </span>
              </el-dropdown-item>
              <el-dropdown-item v-for="task in tasks" :key="task.id" divided>
                <div class="task-div">
                  <span class="task-span task-tag">
                      <el-tag type="danger" v-if="task.rank==1">紧急</el-tag>
                      <el-tag type="warning" v-if="task.rank==2">重要</el-tag>
                      <el-tag type="success" v-if="task.rank==3">正常</el-tag>
                    </span>
                  <span class="task-span task-content">
                        {{task.content}}<br/><span class="task-time">截止：{{task.overTime}}</span>
                  </span>
                  <span class="task-span task-btn">
                      <el-button type="primary" size="mini">完成</el-button>
                    </span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :md="1">
        <div class="user-header">
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <img class="user-avatar" src="https://imgsa.baidu.com/forum/w%3D96/sign=8147fed0d1c8a786be2a460867091025/e6013af33a87e9509172ad4610385343fbf2b4b0.jpg">
              <!-- :src="avatar+'?imageView2/1/w/80/h/80'">
 -->
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="setting-div">
                  <router-link to="/">
                    <span class="setting-icon">
                    <i class="icon iconfont icon-yonghu"></i>
                  </span>
                    <span class="setting-string"> 首页</span>
                  </router-link>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <div class="setting-div">
                  <span class="setting-icon"><i class="icon iconfont icon-shezhi"></i></span>
                  <span class="setting-string"> 设置</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <div class="setting-div" @click="logout">
                  <span class="setting-icon"><i class="icon iconfont icon-084tuichu"></i></span>
                  <span class="setting-string"> 退出</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      name: 'linxin',
      tasks: [
        { id: 1, rank: 1, content: '完成JSPangAdmin头部头部组件的编写。', overTime: '2017/3/9' },
        { id: 2, rank: 2, content: '完成GitHub仓库的初始化工作。', overTime: '2017/3/15' },
        { id: 3, rank: 3, content: '在阿里云进行网站备案，完成后通知组长。', overTime: '2017/3/20' }
      ]
    }
  },
  methods: {
    handleCommand(command) {
      console.log(command);
      this.$message('click on item ' + command);
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
}

</script>
<style lang="scss" scoped>
.header {
  //logo标题
  .logo {
    float: left;
    cursor: pointer;
    font-size: 22px;
    .logo_prefix {
      color: #ffce40;
    }
    .logo_suffix {
      color: #fff;
    }
  } //中间下拉框
  .header-right {
    span {
      display: inline-block;
      margin-left: 14px;
      font-size: 18px;
      color: #fff;
      line-height: 1px;
      height: 18px;
      cursor: pointer;
    }
    span:hover {
      color: #209e91;
    }
  }
  .user-header {
    line-height: 10px;
    padding-top: 7px;
    font-size: 12px;
    img {
      cursor: pointer;
    }
  }
}

.task-div {
  clear: both;
  height: 55px;
  .task-span {
    display: block;
    float: left;
    font-size: 12px
  }
  .task-content {
    width: 160px;
    line-height: 16px;
    margin-left: 10px;
    padding: 5px;
    .task-time {
      clear: both;
      float: right;
      color: #ccc;
    }
  }
}

//用户设置
.setting-div {
  height: 30px;
  line-height: 30px;
  clear: both;
  span {
    display: block;
    float: left;
    font-size: 12px;
  }
  .setting-icon {
    padding-top: 0px;
    padding-right: 5px;
  }
}

//小标题
.pop-title {
  font-size: 12px;
  color: #209e91;
}

//头像
.avatar-wrapper {
  cursor: pointer;
  margin-top: 5px;
  position: relative;
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  i {
    position: absolute;
    padding: 29px 5px 5px 44px;
    left: -0;
    top: 0;
    font-size: 12px;
    color: #ffffff;
  }
  i:hover {
    color: #64D9D6;
  }
}

//国际化
.international {
  cursor: pointer;
}

</style>
