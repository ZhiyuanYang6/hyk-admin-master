//修改侧边栏显示状态sidebar语言类型language
const app = {
  state: {
    sidebar: {
      opened: !+sessionStorage.getItem('sidebarStatus')
    },
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        sessionStorage.setItem('sidebarStatus', 1)
      } else {
        sessionStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
