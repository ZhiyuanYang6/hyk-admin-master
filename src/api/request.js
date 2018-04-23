import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

const request = function(url, data, olddata) {
  console.log(data);
  return new Promise((resolve, reject) => {
    axios.post(process.env.BASE_API + url, data, {
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'token': store.getters.token,
      }
    }).then(response => {
      const data = response.data.obj;
      resolve(response)
    }).catch(error => {
      Message.error("error：" + "请检查网络是否连接");
      reject(error)
    })
  })
};

export default request
