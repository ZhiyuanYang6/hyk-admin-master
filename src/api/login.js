import request from '@/utils/request'

export function LoginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'card/login.do',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: 'card/logout.do',
    method: 'post',
  })
}

// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
