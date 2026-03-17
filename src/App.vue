<template>
  <view class="app-container">
    <slot></slot>
    <CustomTabBar :current="currentTab" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CustomTabBar from './components/CustomTabBar.vue'
import { getToken } from './utils/auth'

const currentTab = ref(0)

// 检查是否为公共页面（不需要登录）
const isPublicPage = (path) => {
  const publicPages = [
    '/pages/login/login',
    '/pages/register/register'
  ]
  return publicPages.includes(path)
}

// 检查认证状态
const checkAuth = (path) => {
  if (isPublicPage(path)) {
    return true // 公共页面无需认证
  }
  return !!getToken() // 需要登录的页面检查token
}

// 更新tab状态
const updateTabBar = (path) => {
  const tabPaths = ['/pages/index/index', '/pages/diagnose/diagnose', '/pages/profile/profile']
  const index = tabPaths.indexOf(path)
  if (index > -1) {
    currentTab.value = index
  }
}

// 检查当前页面的认证状态
const checkCurrentPageAuth = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.route) {
      const path = '/' + currentPage.route
      
      // 检查认证
      const isAuthed = checkAuth(path)
      if (!isAuthed) {
        // 没有权限访问当前页面，跳转到登录页
        uni.reLaunch({ url: '/pages/login/login' })
        return
      }
      
      // 更新tab状态
      updateTabBar(path)
    }
  }
}

// 在应用启动时检查认证
onMounted(() => {
  checkCurrentPageAuth()
  
  // 开始定期检查认证状态
  setInterval(() => {
    checkCurrentPageAuth()
  }, 500) // 降低检查频率以提高性能
})

// 监听应用生命周期变化
uni.onAppShow(() => {
  // 应用从前台回到前台时，立即检查认证
  checkCurrentPageAuth()
})

// 当应用进入后台再返回前台时也可能需要验证
uni.onAppHide(() => {
  // 应用进入后台时可能不执行清理，但要记住应用曾进入后台
})
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
}
.app-container {
  min-height: 100vh;
  padding-bottom: 100px;
}
</style>