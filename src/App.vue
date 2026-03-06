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

onMounted(() => {
  const hasToken = !!getToken()
  if (!hasToken) {
    uni.reLaunch({ url: '/pages/login/login' })
    return
  }
  
  try {
    const pages = getCurrentPages()
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.route) {
        const path = '/' + currentPage.route
        const tabPaths = ['/pages/index/index', '/pages/diagnose/diagnose', '/pages/profile/profile']
        const index = tabPaths.indexOf(path)
        if (index > -1) {
          currentTab.value = index
        }
      }
    }
  } catch (e) {
    console.log('获取页面信息失败', e)
  }
})
</script>

<style>
page {
  background-color: #f5f5f5;
}
.app-container {
  min-height: 100vh;
  padding-bottom: 100px;
}
</style>