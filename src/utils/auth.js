const TOKEN_KEY = 'car_app_token'
const USER_KEY = 'car_app_user'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY)
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

export function getUser() {
  const user = uni.getStorageSync(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setUser(user) {
  uni.setStorageSync(USER_KEY, JSON.stringify(user))
}

export function request(url, options = {}) {
  const token = getToken()
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/api' + url,
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        ...options.header
      },
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          removeToken()
          uni.reLaunch({ url: '/pages/login' })
          reject(new Error('Unauthorized'))
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export function get(url, params) {
  return request(url, { method: 'GET', data: params })
}

export function post(url, data) {
  return request(url, { method: 'POST', data })
}

export function put(url, data) {
  return request(url, { method: 'PUT', data })
}

export function del(url) {
  return request(url, { method: 'DELETE' })
}
