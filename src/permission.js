import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getSession, removeSession } from '@/utils/auth' // 验权


const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => { //全局前置守卫
  const token = getSession();
  if (getSession()) { //验证登陆权限通过，进入主界面
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      // store.dispatch('FedLogOut').then(() => {
      // Message.error('验证失败,请重新登录')
      // next({ path: '/login' })
      // })
      // }
      // debugger;
      if (to.path === '/' || to.path === "/dashboard") { next({ path: '/hyxxgl' }); }
      if (store.getters.roles.length === 0) { //是否有用户信息
        store.dispatch('GetUserInfo').then(() => {
          next();
        }).catch(() => {
          Message.error('验证失败,请重新登录');
          removeSession();
          next('/login');
        });
      } else {
        next();
      }
    }
  } else { //验证不通过
    if (whiteList.indexOf(to.path) !== -1) { //如果是登陆界面不重定向
      next();
    } else {
      next('/login');
    }
  }
});
