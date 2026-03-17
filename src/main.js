import { createSSRApp } from 'vue'
import App from './App.vue'
import uviewPlus from 'uview-plus'
import { getToken } from './utils/auth'

// 重写uni.navigateTo以进行登录验证
const originalNavigateTo = uni.navigateTo
const originalSwitchTab = uni.switchTab
const originalRedirectTo = uni.redirectTo

// 检查页面是否为公共页面（无需登录）
const isPublicPage = (url) => {
  const publicPages = [
    '/pages/login/login',
    '/pages/register/register'
  ]
  return publicPages.some(page => url.includes(page))
}

uni.navigateTo = function(options) {
  if (!isPublicPage(options.url)) {
    const token = getToken()
    if (!token) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
  }
  return originalNavigateTo.call(this, options)
}

uni.switchTab = function(options) {
  if (!isPublicPage(options.url)) {
    const token = getToken()
    if (!token) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
  }
  return originalSwitchTab.call(this, options)
}

uni.redirectTo = function(options) {
  if (!isPublicPage(options.url)) {
    const token = getToken()
    if (!token) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
  }
  return originalRedirectTo.call(this, options)
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  return { app }
}
