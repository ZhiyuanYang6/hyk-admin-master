import { LoginByUsername, logout, GetUserInfo } from '@/api/login' //, ,  
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
        name: '会员信息管理',
        id: '001',
        meta: { title: '会员信息管理', icon: 'icon-huangguan' },
        children: [
          { path: '/hyzlgl', name: '会员资料管理', id: '002', meta: { title: '会员资料管理', icon: 'icon-dengji', } },
          { path: '/czmxcx', name: '充值明细查询', id: '003', meta: { title: '充值明细查询', icon: 'icon-chongzhi', } },
          { path: '/xfmxcx', name: '消费明细查询', id: '004', meta: { title: '消费明细查询', icon: 'icon-pingzhengmingxichaxun', } },
          { path: '/txmxcx', name: '提现明细查询', id: '005', meta: { title: '提现明细查询', icon: 'icon-tixian', } },
          { path: '/symxcx', name: '收益明细查询', id: '006', meta: { title: '收益明细查询', icon: 'icon-shouyimingxi', } },
          { path: '/jfmxcx', name: '积分明细查询', id: '007', meta: { title: '积分明细查询', icon: 'icon-jifen' } },
          { path: '/yhjmxcx', name: '红包/优惠卷明细查询', id: '008', meta: { title: '红包/优惠卷明细查询', icon: 'icon-hongbao' } },
        ]
      },
      {
        path: '/flccpgl',
        name: '理财产品管理',
        id: '009',
        meta: { title: '理财产品管理', icon: 'icon-caiwuguanli2' },
        children: [
          { path: '/lccpcx', name: '理财产品查询', id: '0010', meta: { title: '理财产品查询', icon: 'icon-chengbentongjifenxi' } },
          { path: '/lccpgl', name: '理财产品管理', id: '0011', meta: { title: '理财产品管理', icon: 'icon-caiwuguanli1' } },
          { path: '/hyczsh', name: '会员充值审核', id: '0012', meta: { title: '会员充值审核', icon: 'icon-chongzhishenhe' } }
        ]
      }, {
        path: '/qxgl',
        name: '权限管理',
        id: '0013',
        meta: { title: '权限管理', icon: 'icon-quanxian' },
        children: [
          { path: '/yhxxgl', name: '用户信息管理', id: '0014', meta: { title: '用户信息管理', icon: 'icon-yonghuxinxiguanli' } },
          { path: '/qxsz', name: '权限設置', id: '0015', meta: { title: '权限設置', icon: 'icon-caidanguanli' } },
          { path: '/zygl', name: '资源管理', id: '0016', meta: { title: '资源管理', icon: 'icon-yiji-ziyuanjianguan' } },
        ]
      },
      {
        path: '/kfrygl',
        name: '客服人员管理',
        id: '0017',
        meta: { title: '客服人员管理', icon: 'icon-caiwuguanli' },
        children: [
          { path: '/kfryglc', name: '客服人员管理', id: '0018', meta: { title: '客服人员管理', icon: 'icon-kefuguanli' } },
        ]
      },
      {
        path: '/xxgg',
        name: '消息公告',
        id: '0019',
        meta: { title: '消息公告', icon: 'icon-xiaoxigonggao' },
        children: [
          { path: '/xxfb', name: 'xxfb', name: '消息发布', id: '0020', meta: { title: '消息发布', icon: 'icon-publish' } },
          { path: '/tsjy', name: 'tsjy', name: '投诉建议', id: '0021', meta: { title: '投诉建议', icon: 'icon-navicon-yjjy' } }
        ]
      },
      {
        path: '/xtgl',
        name: '系统管理',
        id: '0022',
        meta: { title: '系统管理', icon: 'icon-xitongguanli' },
        children: [
          { path: '/sjzd', name: '数据字典', id: '0023', meta: { title: '数据字典', icon: 'icon-shujuzidian' } }
        ]
      },
      {
        path: '/qdgl',
        name: '渠道管理',
        id: '0024',
        meta: { title: '渠道管理', icon: 'icon-xitongguanli' },
        children: [{ path: '/index', name: '渠道管理', id: '0025', meta: { title: '渠道管理', icon: 'icon-qudaoguanli1' } }]
      },
      {
        path: '/hytxsh',
        name: ' 会员提现审核',
        id: '0025',
        meta: { title: '会员提现审核', icon: 'icon-xitongguanli' },
        children: [{ path: '/hytxsh', name: ' 会员提现审核', id: '0025', meta: { title: '会员提现审核', icon: 'icon-qudaoguanli1' } }]
      },
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
      state.roles = roles;
      state.routers = roles;
      console.log(state.routers);
    }
  },
  actions: {
    LoginByUsername({ commit, state }, userInfo) { // 登录、获取用户信息
      return new Promise((resolve, reject) => {
        request({ url: 'card/login.do', method: 'post', data: userInfo }).then(response => {
          const data = response.data.obj;
          setSession(data.token);
          commit('SET_TOKEN', data.token);
          request({ url: 'card/initMenu.do', method: 'post', data: {} }).then(response => {
            commit('SET_ROLES', response);
            resolve(response);
          }).catch(error => {
            reject(error);
          });
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({ url: 'card/initMenu.do', method: 'post', data: {} }).then(response => {
          commit('SET_ROLES', response);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({ url: 'card/initMenu.do', method: 'post', data: {} }).then(response => {
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
