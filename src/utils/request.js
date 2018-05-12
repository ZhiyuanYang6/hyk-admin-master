import axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import { getSession } from '@/utils/auth'
import store from '@/store'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000, // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => { // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers['token'] = getSession(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  console.log(config.data)
  return config
}, error => { // 对请求错误做些什么
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use( // 对响应数据做点什么
  response => {
    // console.log(response.data);
    if (typeof response.data.data == "string" && response.data.code != "A000") {
      response.data = JSON.parse(response.data.data); //json格式化
    }
    if (response.data.code == "A000") {
      MessageBox.confirm('你的验证已过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      });
    }
    console.log(response.data)
    return response.data
  },
  error => { // 对响应错误做点什么
    console.log(error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
