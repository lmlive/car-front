<template>
  <svg 
    class="tab-icon" 
    :class="{ active }"
    width="100%" 
    height="100%" 
    viewBox="0 0 24 24" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 车身 -->
    <path 
      d="M5 10L7.5 6H16.5L19 10" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1.5" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <!-- 车顶 -->
    <path 
      d="M8 10H16L17.5 7.5H6.5L8 10Z" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1.5" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <!-- 车轮 -->
    <circle cx="7" cy="12" r="1.5" :fill="active ? activeColor : inactiveColor" />
    <circle cx="17" cy="12" r="1.5" :fill="active ? activeColor : inactiveColor" />
    <!-- 挡风玻璃 -->
    <path 
      d="M9.5 8L10.5 6.5H13.5L14.5 8" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1.2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :opacity="active ? 1 : 0.6"
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