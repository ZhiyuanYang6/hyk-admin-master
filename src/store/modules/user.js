import { LoginByUsername, logout } from '@/api/login' //, GetUserInfo,  
import { getSession, setSession, removeSession } from '@/utils/auth'
import request from '@/utils/request'

const user = {
  state: {
    token: getSession(),
    name: '',
    avatar: '',
    roles: [],
    routers: [{
        path: '/hyxxgl',
        meta: { title: '会员信息管理', icon: 'icon-huangguan' },
        children: [
          { path: 'hyzlgl', meta: { title: '会员资料管理', icon: 'icon-dengji', } },
          { path: 'czmxcx', meta: { title: '充值明细查询', icon: 'icon-chongzhi', } },
          { path: 'xfmxcx', meta: { title: '消费明细查询', icon: 'icon-pingzhengmingxichaxun', } },
          { path: 'txmxcx', meta: { title: '提现明细查询', icon: 'icon-tixian', } },
          { path: 'symxcx', meta: { title: '收益明细查询', icon: 'icon-shouyimingxi', } },
          { path: 'jfmxcx', meta: { title: '积分明细查询', icon: 'icon-jifen' } },
          { path: 'yhjmxcx', meta: { title: '红包/优惠卷明细查询', icon: 'icon-hongbao' } },
        ]
      },
      {
        path: '/flccpgl',
        meta: { title: '理财产品管理', icon: 'icon-caiwuguanli2' },
        children: [
          { path: 'lccpcx', meta: { title: '理财产品查询', icon: 'icon-chengbentongjifenxi' } },
          { path: 'lccpgl', meta: { title: '理财产品管理', icon: 'icon-caiwuguanli1' } },
          { path: 'hyczsh', meta: { title: '会员充值审核', icon: 'icon-chongzhishenhe' } }
        ]
      }, {
        path: '/qxgl',
        meta: { title: '权限管理', icon: 'icon-quanxian' },
        children: [
          { path: 'yhxxgl', meta: { title: '用户信息管理', icon: 'icon-yonghuxinxiguanli' } },
          { path: 'qxsz', meta: { title: '权限設置', icon: 'icon-caidanguanli' } },
          { path: 'zygl', meta: { title: '资源管理', icon: 'icon-yiji-ziyuanjianguan' } },
        ]
      },
      {
        path: '/kfrygl',
        meta: { title: '客服人员管理', icon: 'icon-caiwuguanli' },
        children: [
          { path: 'kfryglc', meta: { title: '客服人员管理', icon: 'icon-kefuguanli' } },
        ]
      },
      {
        path: '/xxgg',
        meta: { title: '消息公告', icon: 'icon-xiaoxigonggao' },
        children: [
          { path: 'xxfb', name: 'xxfb', meta: { title: '消息发布', icon: 'icon-publish' } },
          { path: 'tsjy', name: 'tsjy', meta: { title: '投诉建议', icon: 'icon-navicon-yjjy' } }
        ]
      },
      {
        path: '/xtgl',
        meta: { title: '系统管理', icon: 'icon-xitongguanli' },
        children: [
          { path: 'sjzd', meta: { title: '数据字典', icon: 'icon-shujuzidian' } }
        ]
      },
      {
        path: '/qdgl',
        children: [{ path: 'index', meta: { title: '渠道管理', icon: 'icon-qudaoguanli1' } }]
      }
    ],
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
          commit('SET_NAME', data.login_name);
          // commit('SET_ROLES', )//用户权限
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
