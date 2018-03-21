import request from '@/utils/request'

export function dcShjxx(date) { //导出售货机信息
  return request({
    url: 'Shjgl/dcShjxx',
    method: 'post',
    data: { date }
  })
}

export function queryMachinesStatus(token) { //状态查询
  return request({
    url: 'Jqzt/queryMachinesStatus',
    method: 'post',
    params: { token }
  })
}

export function queryShj(date) { //售货机查询
  return request({
    url: 'Shjgl/queryShj',
    method: 'post',
    params: { date }
  })
}
