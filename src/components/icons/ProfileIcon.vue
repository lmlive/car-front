<template>
  <svg 
    class="tab-icon" 
    :class="{ active }"
    :style="{ width: size + 'rpx', height: size + 'rpx' }"
    viewBox="0 0 24 24" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 人物头部 -->
    <circle 
      cx="12" 
      cy="8" 
      r="4" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1.5"
    />
    <!-- 人物身体 -->
    <path 
      d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1.5" 
      stroke-linecap="round"
    />
    <!-- 设置/齿轮装饰 -->
    <circle 
      cx="18" 
      cy="6" 
      r="3" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1"
      :opacity="active ? 0.8 : 0.5"
    />
    <path 
      d="M20.5 6L21 5.5M18 4L18.5 3.5" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1"
      stroke-linecap="round"
      :opacity="active ? 0.6 : 0.3"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 48
  },
  active: {
    type: Boolean,
    default: false
  },
  activeColor: {
    type: String,
    default: '#667eea'
  },
  inactiveColor: {
    type: String,
    default: '#999999'
  }
})
</script>

<style scoped>
.tab-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>