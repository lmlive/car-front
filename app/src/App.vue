<template>
  <view class="app-container">
    <view v-if="!hasToken">
      <LoginPage @success="onLoginSuccess" />
    </view>
    <view v-else>
      <TabBar :current="currentTab" @change="onTabChange">
        <TabBarItem>
          <view slot="icon">🚗</view>
          <view slot="label">车辆</view>
        </TabBarItem>
        <TabBarItem>
          <view slot="icon">🔧</view>
          <view slot="label">诊断</view>
        </TabBarItem>
        <TabBarItem>
          <view slot="icon">👤</view>
          <view slot="label">我的</view>
        </TabBarItem>
      </TabBar>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import LoginPage from './pages/login.vue'
import TabBar from './components/TabBar.vue'
import TabBarItem from './components/TabBarItem.vue'
import { getToken } from './utils/auth'

const hasToken = ref(!!getToken())
const currentTab = ref(0)

 = () => {
const onLoginSuccess  hasToken.value = true
}

const onTabChange = (index) => {
  currentTab.value = index
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
.app-container {
  min-height: 100vh;
}
</style>
