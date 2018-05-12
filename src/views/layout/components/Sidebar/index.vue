<template>
  <div>
    <div :class="{ 'titlesid': true,'hide':isCollapse}">
      <div class="logo">
        <span class="logo_prefix">酉缘</span>
        <span class="logo_suffix">会员管理系统</span>
      </div>
    </div>
    <scroll-bar>
      <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <sidebar-item :routes="permission_routers"></sidebar-item>
      </el-menu>
    </scroll-bar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created: function() {
    // console.log(this.permission_routers)
  },

}

</script>
<style lang="scss" scoped>
.titlesid {
  position: absolute;
  width: 100%;
  top: -60px;
  height: 60px; // margin-top: 10px;
  background: #545c64;
  padding: 20px 0px 10px 20px;
  box-shadow: 2px 0 3px rgba(0, 0, 0, .5);
  z-index: 1;
  .logo {
    float: left;
    cursor: pointer;
    font-size: 18px;
    .logo_prefix {
      color: #ffce40;
    }
    .logo_suffix {
      color: #fff;
    }
  }
}

div.hide {
  overflow: hidden;
  padding-left: 10px;
  padding-top: 10px;
}

</style>
