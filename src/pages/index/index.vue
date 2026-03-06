<template>
  <view class="container">
    <view class="header">
      <text class="title">🚗 智能车诊</text>
    </view>
    <view class="content">
      <button @click="goVehicles">车辆管理</button>
      <button @click="goDiagnose">AI诊断</button>
    </view>
  </view>
</template>

<script setup>
const goVehicles = () => {
  uni.navigateTo({ url: '/pages/vehicles/vehicles' })
}

const goDiagnose = () => {
  uni.navigateTo({ url: '/pages/diagnose/diagnose' })
}
</script>

<style>
.container { padding: 20px; }
.header { text-align: center; padding: 40px 0; }
.title { font-size: 24px; font-weight: bold; }
.content { display: flex; flex-direction: column; gap: 15px; }
.content button { padding: 15px; background: #667eea; color: #fff; border-radius: 8px; }
</style>
