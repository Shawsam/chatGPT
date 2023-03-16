import $http from "@/api/request";

export const getWxShareInfo = data => {
  return $http({
    method: 'post',
    url: 'https://api.h5mo.com/v1/wxopen/wxshare',
    data: {
      appid: 'wx277b57fe859c9b5f',
      shareurl:window.location.href
    },
    isForm:true
  })
}

export const searchApi = data => {
  return $http({
    method: 'post',
    url: '/tarsocial',
    data: {
      text: data
    }
  })
}

export const getTag = o => {
  return $http({
    method: 'get',
    url: `/chatgpt/tarsocialcmi?text=${o.text}&clientId=${o.id}`
  })
}

export const getCodeUrl = (userName) => {
  return `./gpt-api/user/code?userName=${userName}&a=${new Date().getTime()}`
}


export const msgSend = (data) => {
  return $http({
    url: `gpt-api/user/sms-code`,
    method: 'post',
    data
  })
}

export const msgLogin = (data) => {
  return $http({
    url: `gpt-api/user/login/sms`,
    method: 'post',
    data
  })
}

export const getMsgList = (userId) => {
  return $http({
    url: `gpt-api/msg/cons/list?userId=${userId}&page=0&size=100&sort=createTime,desc`,
    method: 'get',
  })
}

export const getMsgDetail = (userId,consId) => {
  return $http({
    url: `gpt-api/msg/list?consId=${consId}&userId=${userId}&page=0&size=100&sort=createTime,desc`,
    method: 'get',
  })
}

export const consDelete = (consId) => {
  return $http({
    url: `gpt-api/msg/cons?consId=${consId}`,
    method: 'DELETE',
  })
}

