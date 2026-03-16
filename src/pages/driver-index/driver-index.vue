<template>
  <view class="page-container">
    <view class="header">
      <view class="user-section">
        <view class="avatar">
          <text class="avatar-text">{{ userInfo.name ? userInfo.name.slice(0, 1) : '司' }}</text>
        </view>
        <view class="user-info">
          <text class="greeting">{{ timeGreeting }}，{{ userInfo.name || '司机' }}</text>
          <text class="status-text" :class="driverStatus.class">
            {{ driverStatus.text }}
          </text>
        </view>
        <view class="settings-btn" @click="goSettings">
          <text>⚙️</text>
        </view>
      </view>
    </view>

    <view class="stats-card">
      <view class="stats-header">
        <text class="stats-title">今日数据</text>
        <text class="stats-date">{{ today }}</text>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ stats.orders }}</text>
          <text class="stat-label">接单数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">¥{{ stats.income }}</text>
          <text class="stat-label">今日收入</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.hours }}</text>
          <text class="stat-label">在线时长</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.rating }}</text>
          <text class="stat-label">服务评分</text>
        </view>
      </view>
    </view>

    <view class="action-section">
      <text class="section-title">快捷操作</text>
      <view class="action-grid">
        <view class="action-card" @click="goOrders">
          <view class="action-icon">📋</view>
          <text class="action-text">我的订单</text>
        </view>
        <view class="action-card" @click="goVehicles">
          <view class="action-icon">🚗</view>
          <text class="action-text">车辆管理</text>
        </view>
        <view class="action-card" @click="goWallet">
          <view class="action-icon">💰</view>
          <text class="action-text">我的钱包</text>
        </view>
        <view class="action-card" @click="goCertification">
          <view class="action-icon">📄</view>
          <text class="action-text">资质认证</text>
        </view>
        <view class="action-card" @click="goCustomer">
          <view class="action-icon">👥</view>
          <text class="action-text">客户管理</text>
        </view>
        <view class="action-card" @click="goMessages">
          <view class="action-icon">🔔</view>
          <text class="action-text">消息中心</text>
        </view>
      </view>
    </view>

    <view class="order-section" v-if="pendingOrders.length > 0">
      <view class="section-header">
        <text class="section-title">待接订单</text>
        <text class="more-btn" @click="goOrders">更多 ></text>
      </view>
      <scroll-view class="order-scroll" scroll-x>
        <view class="order-card" v-for="order in pendingOrders" :key="order.id" @click="acceptOrder(order)">
          <view class="order-header">
            <text class="order-type">{{ order.type }}</text>
            <text class="order-distance">{{ order.distance }}</text>
          </view>
          <view class="order-route">
            <view class="route-point">
              <view class="point-dot start"></view>
              <text class="point-text">{{ order.start }}</text>
            </view>
            <view class="route-point">
              <view class="point-dot end"></view>
              <text class="point-text">{{ order.end }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-price">¥{{ order.price }}</text>
            <view class="accept-btn">接单</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="vehicle-section" v-if="vehicles.length > 0">
      <view class="section-header">
        <text class="section-title">我的车辆</text>
        <text class="more-btn" @click="goVehicles">管理 ></text>
      </view>
      <view class="vehicle-list">
        <view 
          class="vehicle-card" 
          v-for="vehicle in vehicles" 
          :key="vehicle.id"
          :class="{ 'vehicle-warning': vehicle.status !== 'normal' }"
        >
          <view class="vehicle-info">
            <text class="plate">{{ vehicle.plateNumber }}</text>
            <text class="brand">{{ vehicle.brand }} {{ vehicle.model }}</text>
          </view>
          <view class="vehicle-status">
            <text class="status-badge" :class="vehicle.status">{{ vehicle.statusText }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-vehicle" v-else @click="goVehicles">
      <view class="empty-icon">🚗</view>
      <text class="empty-text">暂无绑定车辆</text>
      <view class="add-vehicle-btn">+ 添加车辆</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const userInfo = ref({
  name: '张师傅',
  phone: '13812345678',
  status: 'online'
})

const today = new Date().toLocaleDateString('zh-CN', { 
  month: 'long', 
  day: 'numeric' 
})

const stats = ref({
  orders: 12,
  income: 368,
  hours: 8.5,
  rating: 4.9
})

const pendingOrders = ref([
  {
    id: 1,
    type: '即时用车',
    distance: '2.5km',
    start: '北京市朝阳区',
    end: '北京西站',
    price: 45
  },
  {
    id: 2,
    type: '预约用车',
    distance: '5.0km',
    start: '天安门广场',
    end: '首都机场',
    price: 120
  }
])

const vehicles = ref([
  {
    id: 1,
    plateNumber: '京A12345',
    brand: '比亚迪',
    model: '秦PLUS',
    status: 'normal',
    statusText: '正常'
  }
])

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const driverStatus = computed(() => {
  const status = userInfo.value.status
  if (status === 'online') {
    return { text: '服务中', class: 'online' }
  } else if (status === 'waiting') {
    return { text: '休息中', class: 'waiting' }
  }
  return { text: '离线', class: 'offline' }
})

const goSettings = () => {
  uni.navigateTo({ url: '/pages/driver-profile/driver-profile' })
}

const goOrders = () => {
  uni.showToast({ title: '订单功能开发中', icon: 'none' })
}

const goVehicles = () => {
  uni.navigateTo({ url: '/pages/driver-vehicles/driver-vehicles' })
}

const goWallet = () => {
  uni.showToast({ title: '钱包功能开发中', icon: 'none' })
}

const goCertification = () => {
  uni.navigateTo({ url: '/pages/driver-certification/driver-certification' })
}

const goCustomer = () => {
  uni.showToast({ title: '客户管理开发中', icon: 'none' })
}

const goMessages = () => {
  uni.showToast({ title: '消息中心开发中', icon: 'none' })
}

const acceptOrder = (order) => {
  uni.showModal({
    title: '确认接单',
    content: `起点：${order.start}\n终点：${order.end}\n价格：¥${order.price}`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '接单成功', icon: 'success' })
      }
    }
  })
}

onMounted(() => {
  const storedUser = uni.getStorageSync('userInfo')
  if (storedUser) {
    userInfo.value = { ...userInfo.value, ...storedUser }
  }
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}

.user-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.user-info {
  flex: 1;
  margin-left: 15px;
}

.greeting {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  display: block;
}

.status-text {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-top: 4px;
}

.status-text.online {
  color: #52c41a;
}

.status-text.waiting {
  color: #faad14;
}

.status-text.offline {
  color: #ff4d4f;
}

.settings-btn {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stats-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stats-date {
  font-size: 13px;
  color: #999;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 4px;
}

.action-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.more-btn {
  font-size: 13px;
  color: #999;
}

.action-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-card {
  width: calc(33.33% - 8px);
  background: #fff;
  border-radius: 16px;
  padding: 20px 10px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.action-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.action-text {
  font-size: 12px;
  color: #666;
}

.order-section {
  margin-bottom: 20px;
}

.order-scroll {
  white-space: nowrap;
}

.order-card {
  display: inline-block;
  width: 280px;
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-right: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-type {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.order-distance {
  font-size: 12px;
  color: #999;
}

.order-route {
  margin-bottom: 12px;
}

.route-point {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.point-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.point-dot.start {
  background: #52c41a;
}

.point-dot.end {
  background: #ff4d4f;
}

.point-text {
  font-size: 13px;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.order-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff4d4f;
}

.accept-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
}

.vehicle-section {
  margin-bottom: 20px;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vehicle-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-left: 4px solid #52c41a;
}

.vehicle-card.vehicle-warning {
  border-left-color: #faad14;
}

.vehicle-info .plate {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.vehicle-info .brand {
  font-size: 14px;
  color: #666;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
}

.status-badge.normal {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.warning {
  background: #fffbe6;
  color: #faad14;
}

.empty-vehicle {
  background: #fff;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 60px;
  display: block;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  display: block;
  margin-bottom: 20px;
}

.add-vehicle-btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 14px;
}
</style>
