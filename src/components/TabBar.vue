<template>
  <view class="tab-bar">
    <view 
      class="tab-item" 
      v-for="(item, index) in tabs" 
      :key="index" 
      @click="onChange(index)"
      :class="{ active: current === index }"
    >
      <text class="tab-icon">{{ item.icon }}</text>
      <text class="tab-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  current: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const tabs = [
  { icon: '🚗', label: '车辆' },
  { icon: '🔧', label: '诊断' },
  { icon: '👤', label: '我的' }
]

const onChange = (index) => {
  emit('change', index)
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: #fff;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.08);
  padding-bottom: env(safe-area-inset-bottom);
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.tab-icon {
  font-size: 24px;
  margin-bottom: 4px;
}
.tab-label {
  font-size: 12px;
  color: #999;
  transition: color 0.3s;
}
.tab-item.active .tab-label {
  color: #667eea;
  font-weight: 500;
}
.tab-item.active .tab-icon {
  transform: scale(1.1);
}
</style>
