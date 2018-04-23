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
    console.log(response);
    if (typeof response.data.data == "string") {
      response.data = JSON.parse(response.data.data); //json格式化
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
