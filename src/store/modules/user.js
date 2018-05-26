import { LoginByUsername, logout, GetUserInfo } from '@/api/login' //, ,  
import { getSession, setSession, removeSession } from '@/utils/auth'
import request from '@/utils/request'

const user = {
  state: {
    token: getSession(),
    name: '',
    avatar: '',
    roles: [],
    routers: [],
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
      state.roles = roles;
      state.routers = roles;
    }
  },
  actions: {
    LoginByUsername({ commit, state }, userInfo) { // 登录、获取用户信息
      return new Promise((resolve, reject) => {
        LoginByUsername(userInfo).then(response => {
          setSession(response.data.obj.token);
          commit('SET_TOKEN', response.data.obj.token);
          resolve(response);
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(response => {
          removeSession();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({ url: 'card/initMenu.do', method: 'post', data: {} }).then(response => {
          console.log(response);
          debugger;
          commit('SET_ROLES', response);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
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
