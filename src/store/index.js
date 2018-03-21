import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
// import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission
  },
  // getters
  getters: {
    sidebar: state => state.app.sidebar, //侧边栏是否隐藏
    language: state => state.app.language, //语言
    token: state => state.user.token, //登陆安全码
    avatar: state => state.user.avatar, //用户资料
    name: state => state.user.name, //用户名-
    roles: state => state.user.roles, //用户资料
    visitedViews: state => state.tagsView.visitedViews, //访问视图
    cachedViews: state => state.tagsView.cachedViews, //缓存的视图
  }
})

export default store
