<template>
  <view class="custom-tabbar">
    <view class="tabbar-bg"></view>
    <view class="tabbar-content">
      <view 
        class="tab-item" 
        v-for="(item, index) in tabList" 
        :key="index"
        @click="switchTab(item, index)"
        :class="{ active: currentIndex === index }"
      >
        <view class="tab-icon-wrap">
          <component 
            :is="item.iconComponent" 
            :size="48"
            :active="currentIndex === index"
            :active-color="activeColor"
            :inactive-color="inactiveColor"
          />
          <view class="active-indicator" v-if="currentIndex === index"></view>
        </view>
        <text class="tab-text" :class="{ active: currentIndex === index }">{{ item.text }}</text>
      </view>
    </view>
    <view class="safe-area" :style="{ height: safeAreaHeight + 'px' }"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, markRaw } from 'vue'
import HomeIcon from './icons/HomeIcon.vue'
import DiagnoseIcon from './icons/DiagnoseIcon.vue'
import ProfileIcon from './icons/ProfileIcon.vue'

const props = defineProps({
  current: {
    type: Number,
    default: 0
  }
})

const currentIndex = ref(props.current)
const safeAreaHeight = ref(20)
const activeColor = '#667eea'
const inactiveColor = '#999999'

const tabList = [
  { pagePath: '/pages/index/index', iconComponent: markRaw(HomeIcon), text: '首页' },
  { pagePath: '/pages/diagnose/diagnose', iconComponent: markRaw(DiagnoseIcon), text: '诊断' },
  { pagePath: '/pages/profile/profile', iconComponent: markRaw(ProfileIcon), text: '我的' }
]

const switchTab = (item, index) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({ url: item.pagePath })
}

const getSafeArea = () => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    safeAreaHeight.value = systemInfo.safeAreaInsets?.bottom || 20
  } catch (e) {
    safeAreaHeight.value = 20
  }
}

onMounted(() => {
  getSafeArea()
  
  try {
    const pages = getCurrentPages()
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.route) {
        const path = '/' + currentPage.route
        const index = tabList.findIndex(item => item.pagePath === path)
        if (index > -1) {
          currentIndex.value = index
        }
      }
    }
  } catch (e) {
    console.log('获取页面信息失败', e)
  }
})

watch(() => props.current, (newVal) => {
  currentIndex.value = newVal
})
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.tabbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
}

.tabbar-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100rpx;
  padding-top: 16rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 12rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tab-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
}

.active-indicator {
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 12rpx;
  height: 12rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: indicator-pop 0.3s ease;
}

@keyframes indicator-pop {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.tab-text {
  font-size: 22rpx;
  line-height: 1;
  color: #999999;
  margin-top: 8rpx;
  font-weight: 400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-text.active {
  color: #667eea;
  font-weight: 600;
  font-size: 24rpx;
}

.tab-item.active .tab-text {
  margin-top: 6rpx;
}

.safe-area {
  background: transparent;
}

@media (min-width: 768px) {
  .tabbar-content {
    max-width: 750rpx;
    margin: 0 auto;
  }
  
  .tab-text {
    font-size: 24rpx;
  }
  
  .tab-text.active {
    font-size: 26rpx;
  }
}

@media (max-width: 375px) {
  .tab-text {
    font-size: 20rpx;
  }
  
  .tabbar-content {
    height: 90rpx;
  }
}
</style>