<template>
  <div id="app">
    <el-header height="66px">
      <Header></Header>
    </el-header>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <navbar></navbar>
        <tags-view></tags-view>
        <app-main></app-main>
      </div>
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain, Header, TagsView } from '@/views/layout/components' //

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Header,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    goWord() {
      this.$router.push('/HelloWorld');
    }
  },
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%; // background-color: #545C64;
}

</style>
