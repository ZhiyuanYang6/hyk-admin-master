import axios from 'axios'
import { Message } from 'element-ui'
const date = {
  mutations: {
    DATEFORMATE: (state, date) => { //时间格式化yy-mm-dd hh:mm:ss
      var sy = date.sj[0].getFullYear();
      var sm = date.sj[0].getMonth();
      var sd = date.sj[0].getDate();
      var sh = date.sj[0].getHours();
      var si = date.sj[0].getMinutes();
      var ss = date.sj[0].getSeconds();
      var ey = date.sj[1].getFullYear();
      var em = date.sj[1].getMonth();
      var ed = date.sj[1].getDate();
      var eh = date.sj[1].getHours();
      var ei = date.sj[1].getMinutes();
      var es = date.sj[1].getSeconds();
      date.startTime = sy + "-" + (sm + 1 < 10 ? '0' + (sm + 1) : sm + 1) + "-" + (sd < 10 ? '0' + sd : sd) + " " + (sh < 10 ? '0' + sh : sh) + ":" + (si < 10 ? '0' + si : si) + ":" + (ss < 10 ? '0' + ss : ss);
      date.endTime = ey + "-" + (em + 1 < 10 ? '0' + (em + 1) : em + 1) + "-" + (ed < 10 ? '0' + ed : ed) + " " + (eh < 10 ? '0' + eh : eh) + ":" + (ei < 10 ? '0' + ei : ei) + ":" + (es < 10 ? '0' + es : es);
      // console.log(date);
    },
    NEW_DATE: (state, date) => { //当天时间
      var nnewDate = new Date();
      var y = nnewDate.getFullYear();
      var m = nnewDate.getMonth();
      var d = nnewDate.getDate();
      var snewDate = new Date(y, m, d);
      date.sj = [snewDate, nnewDate];
      // date.sj = ['', '']; //清空当天时间
      // console.log(date);
    },
    REQUEST: (state, date) => { //发起请求
      console.log(date.data);
      // console.log(this.$store);
      axios.post(process.env.BASE_API + date.url, date.data, {
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'token': date.token,
          }
        })
        .then(response => {
          date.response = response.data.data.data
          console.log(date.response);
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
  },
  actions: {
    timeFormat({ commit }, date) {
      commit('DATEFORMATE', date);
    },
    getNewDate({ commit }, date) { //当天时间
      commit('NEW_DATE', date);
    },
    requestSubmit({ commit }, date) {
      commit('REQUEST', date);
    }
  }

}

export default date
