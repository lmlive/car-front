const BASE_URL = 'http://localhost:48080'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 获取本地存储的 token
    const token = uni.getStorageSync('token')
    const header = options.header || {}
    
    // 如果有 token 则附带
    if (token) {
      header['Authorization'] = 'Bearer ' + token
      // 芋道框架要求的 tenant-id (默认租户 1)
      header['tenant-id'] = '1'
    }

    uni.request({
      url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      success: (res) => {
        const data = res.data
        if (data.code === 0) {
          // 请求成功
          resolve(data.data)
        } else if (data.code === 401) {
          // 未登录
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/login' })
          }, 1500)
          reject(data.msg)
        } else {
          // 其他业务错误
          uni.showToast({ title: data.msg || '请求失败', icon: 'none' })
          reject(data.msg)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

// 通用的 GET / POST / PUT / DELETE 方法
export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })
export const put = (url, data) => request({ url, method: 'PUT', data })
export const del = (url, data) => request({ url, method: 'DELETE', data })
