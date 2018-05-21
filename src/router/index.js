import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const asyncRouterMap = [

]
import Layout from '@/views/layout/Layout'
export const constantRouterMap = [{
    path: '',
    component: Layout,
    //     redirect: 'dashboard',
    //     children: [{
    //       path: 'dashboard',
    //       component: _import('dashboard/index'),
    //       name: 'dashboard',
    //       meta: { title: '首页', icon: 'icon-danweiguanli', noCache: true } 
    //     }]
  },
  //会员信息管理
  {
    path: '/hyxxgl',
    // path: '',
    name: 'hyxxgl',
    component: Layout,
    redirect: '/hyxxgl/hyzlgl',
    meta: { noCache: false, title: '会员信息管理', icon: 'icon-huiyuanguanli' },
    children: [
      { path: 'hyzlgl', component: _import('hyxxgl/hyzlgl'), name: "hyzlgl", meta: { title: '会员资料管理', icon: 'icon-danweiguanli', noCache: false } },
      { path: 'czmxcx', component: _import('hyxxgl/czmxcx'), name: "czmxcx", meta: { title: '充值明细查询', icon: 'icon-danweiguanli', noCache: false } },
      { path: 'xfmxcx', component: _import('hyxxgl/xfmxcx'), name: "xfmxcx", meta: { title: '消费明细查询', icon: 'icon-danweiguanli', noCache: false } }, { path: 'txmxcx', component: _import('hyxxgl/txmxcx'), name: "txmxcx", meta: { title: '提现明细查询', icon: 'icon-danweiguanli', noCache: true } }, { path: 'symxcx', component: _import('hyxxgl/symxcx'), name: "symxcx", meta: { title: '收益明细查询', icon: 'icon-danweiguanli', noCache: true } },
      { path: 'jfmxcx', component: _import('hyxxgl/jfmxcx'), name: 'jfmxcx', meta: { noCache: false, title: '积分明细查询', icon: 'icon-danweiguanli' } },
      { path: 'yhjmxcx', component: _import('hyxxgl/yhjmxcx'), name: 'yhjmxcx', meta: { noCache: false, title: '红包/优惠卷明细查询', icon: 'icon-danweiguanli' } },
    ]
  },
  //理财产品管理 
  {
    path: '/flccpgl',
    name: 'flccpgl',
    component: Layout,
    redirect: '/flccpgl/lccpgl',
    meta: { noCache: false, title: '理财产品管理', icon: 'icon-caiwuguanli' },
    children: [
      { path: 'lccpcx', component: _import('flccpgl/lccpcx'), name: 'lccpcx', meta: { noCache: false, title: '理财产品查询', icon: 'example' } },
      { path: 'lccpgl', component: _import('flccpgl/lccpgl'), name: 'lccpgl', meta: { noCache: false, title: '理财产品管理', icon: 'example' } },
      { path: 'hyczsh', component: _import('flccpgl/hyczsh'), name: 'hyczsh', meta: { noCache: false, title: '会员充值审核', icon: 'example' } }
    ]
  },
  //权限管理
  {
    path: '/qxgl',
    name: 'qxgl',
    component: Layout,
    redirect: '/qxgl/yhxxgl',
    meta: { noCache: false, title: '权限管理', icon: 'icon-caiwuguanli' },
    children: [
      { path: 'yhxxgl', component: _import('qxgl/yhxxgl'), name: 'yhxxgl', meta: { noCache: false, title: '用户信息管理', icon: 'example' } },
      { path: 'qxsz', component: _import('qxgl/qxsz'), name: 'qxsz', meta: { noCache: false, title: '权限設置', icon: 'example' } },
      { path: 'zygl', component: _import('qxgl/zygl'), name: 'zygl', meta: { noCache: false, title: '资源管理', icon: 'example' } },
    ]
  },
  //会员等级权益
  // {
  //   path: '/hydjqy',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     name: 'hydjqy',
  //     component: _import('hydjqy/index'),
  //     meta: { noCache: false, title: '会员等级权益', icon: 'icon-dengji1' }
  //   }]
  // },
  //客服人员管理 
  {
    path: '/kfrygl',
    name: 'kfrygl',
    component: Layout,
    redirect: '/kfrygl/kfryglc',
    meta: { noCache: false, title: '客服人员管理', icon: 'icon-caiwuguanli' },
    children: [
      { path: 'kfryglc', component: _import('kfrygl/kfryglc'), name: 'kfryglc', meta: { noCache: false, title: '客服人员管理', icon: 'icon-caiwuguanli' } },
      // { path: 'lccpgl', component: _import('flccpgl/lccpgl'), name: 'lccpgl', meta: { noCache: false, title: '理财产品管理', icon: 'example' } }
    ]
  },
  //消息公告 
  {
    path: '/xxgg',
    name: 'xxgg',
    component: Layout,
    redirect: '/xxgg/xxfb',
    meta: { noCache: false, title: '消息公告', icon: 'icon-xiaoxigonggao' },
    children: [
      { path: 'xxfb', component: _import('xxgg/xxfb'), name: 'xxfb', meta: { noCache: false, title: '消息发布', icon: 'example' } },
      { path: 'tsjy', component: _import('xxgg/tsjy'), name: 'tsjy', meta: { noCache: false, title: '投诉建议', icon: 'example' } }
    ]
  },
  //系统管理
  {
    path: '/xtgl',
    name: 'xtgl',
    component: Layout,
    redirect: '/xtgl/index',
    meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' },
    children: [
      // { path: 'index', name: 'index', component: _import('xtgl/index'), meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' } },
      { path: 'sjzd', name: 'sjzd', component: _import('xtgl/sjzd'), meta: { noCache: false, title: '数据字典', icon: 'icon-xitongguanli' } },
    ]
  },
  //统计分析
  // {
  //   path: '/统计分析',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     name: 'tjfx',
  //     component: _import('tjfx/index'),
  //     meta: { noCache: false, title: '统计分析', icon: 'icon-chengbentongjifenxi' }
  //   }]
  // },

  //渠道管理
  {
    path: '/qdgl',
    component: Layout,
    meta: { noCache: false, title: '渠道管理', icon: 'icon-xitongguanli' },
    children: [{
      path: 'index',
      name: 'qdgl',
      component: _import('qdgl/index'),
      meta: { noCache: false, title: '渠道管理', icon: 'icon-qudaoguanli' }
    }]
  },
  //  会员提现审核
  {
    path: '/hytxsh',
    component: Layout,
    meta: { noCache: false, title: '会员提现审核', icon: 'icon-xitongguanli' },
    children: [{
      path: 'hytxsh',
      name: 'hytxsh',
      component: _import('hytxsh/hytxshc'),
      meta: { noCache: false, title: '会员提现审核', icon: 'icon-qudaoguanli' }
    }]
  },


  //登陆界面
  { path: '/login', component: _import('login/index'), hidden: true, },
  //主页
]
export default new Router({
  routes: constantRouterMap
})
