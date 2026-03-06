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
    <!-- AI核心圆 -->
    <circle 
      cx="12" 
      cy="12" 
      r="9" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1.5"
    />
    <!-- 闪电/AI标识 -->
    <path 
      d="M13 8L10 12H12.5L11 16L14 12H11.5L13 8Z" 
      :fill="active ? activeColor : inactiveColor"
    />
    <!-- 扫描线 -->
    <path 
      d="M5 12H19" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1" 
      stroke-linecap="round"
      :opacity="active ? 0.8 : 0.4"
    />
    <!-- 诊断波纹 -->
    <circle 
      cx="12" 
      cy="12" 
      r="6" 
      :stroke="active ? activeColor : inactiveColor" 
      stroke-width="1"
      stroke-dasharray="2 3"
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