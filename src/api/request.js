import axios from 'axios'
import { showLoadingToast, closeToast } from 'vant'

const $http = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})
console.log(import.meta)
console.log(import.meta.env)
// 请求拦截器
$http.interceptors.request.use(
  (config) => {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner'
    })

    // 在发送请求之前做些什么
    config.headers['Content-Type'] = 'application/json'
    if (config.isForm)
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.headers['token'] = 'unauthorized'
    // console.log(store.getters.token);
    // if (getToken()) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['token'] = getToken()
    // }
    return config
  },
  function (error) {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 相应拦截器
$http.interceptors.response.use(
  (response) => {
    // 在2xx范围内的任何状态代码都会触发此功能
    // 处理响应数据
    closeToast()
    return response
  },
  function (error) {
    // 任何超出2xx范围的状态代码都会触发此功能
    // 处理响应错误
    closeToast()
    return Promise.reject(error)
  }
)

export default $http
