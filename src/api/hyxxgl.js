import request from '@/utils/request'

export function memberQueryPageList(params) {
  console.log(params);
  return request({
    url: '/article/list',
    method: 'post',
    params
  })
}
