import { LoginByUsername, logout } from '@/api/login' //, GetUserInfo,  
import { getSession, setSession, removeSession } from '@/utils/auth'
import request from '@/utils/request'

const user = {
  state: {
    token: getSession(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    LoginByUsername({ commit, state }, userInfo) { // 登录、获取用户信息
      return new Promise((resolve, reject) => {
        request({ url: 'card/login.do', method: 'post', data: userInfo }).then(response => {
          const data = response.data.obj;
          setSession(data.token);
          commit('SET_TOKEN', data.token);
          commit('SET_NAME', data.login_name)
          // commit('SET_ROLES', data.roles)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((response) => {
          commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          removeSession()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeSession()
        resolve()
      })
    }
  }
}

export default user
