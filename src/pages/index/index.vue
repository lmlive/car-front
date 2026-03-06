<template>
  <view class="page-container">
    <view class="header">
      <view class="user-info">
        <text class="greeting">您好，{{ userInfo.name || '用户' }}</text>
        <text class="sub-greeting">为您提供专业的汽车服务</text>
      </view>
    </view>

    <view class="section-title">
      <text class="title-text">我的车辆</text>
      <view class="add-btn" @click="addVehicle">+ 添加</view>
    </view>

    <view class="vehicle-list">
      <view 
        class="vehicle-card" 
        v-for="item in vehicles" 
        :key="item.id"
        :class="getVehicleStatus(item).statusClass"
        @click="goDetail(item)"
      >
        <view class="card-header">
          <view class="status-badge" :class="getVehicleStatus(item).statusClass">
            {{ getVehicleStatus(item).statusText }}
          </view>
          <text class="plate">{{ item.plateNumber }}</text>
        </view>
        
        <view class="vehicle-info">
          <text class="brand">{{ item.brand }} {{ item.model }}</text>
          <text class="vin">VIN: {{ item.vin }}</text>
        </view>

        <view class="maintenance-info">
          <view class="info-item">
            <text class="info-label">累计维修</text>
            <text class="info-value">{{ item.repairCount || 0 }}次</text>
          </view>
          <view class="info-item">
            <text class="info-label">最近维修</text>
            <text class="info-value">{{ item.lastRepairDate || '暂无' }}</text>
          </view>
        </view>

        <view class="reminder" v-if="item.nextMaintenance">
          <view class="reminder-icon">🔔</view>
          <view class="reminder-content">
            <text class="reminder-text">{{ item.nextMaintenance.reminderText }}</text>
            <text class="reminder-days" :class="{ urgent: item.nextMaintenance.days <= 7 }">
              {{ item.nextMaintenance.days }}天后
            </text>
          </view>
        </view>

        <view class="card-actions">
          <view class="action-btn diagnose" @click.stop="quickDiagnose(item)">
            <text>🔧 诊断</text>
          </view>
          <view class="action-btn record" @click.stop="viewRecord(item)">
            <text>📋 记录</text>
          </view>
        </view>
      </view>

      <view class="empty" v-if="vehicles.length === 0">
        <text class="empty-icon">🚗</text>
        <text class="empty-text">暂无车辆，请添加您的第一辆车</text>
        <view class="empty-btn" @click="addVehicle">添加车辆</view>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-card" @click="goDiagnose">
        <text class="action-icon">🤖</text>
        <text class="action-text">AI智能诊断</text>
      </view>
      <view class="action-card" @click="goAppointment">
        <text class="action-icon">📅</text>
        <text class="action-text">预约保养</text>
      </view>
      <view class="action-card" @click="goStore">
        <text class="action-icon">🏪</text>
        <text class="action-text">附近门店</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../../utils/auth'

const userInfo = ref({
  name: '车主',
  phone: '13812345678'
})

const vehicles = ref([])

const getVehicleStatus = (vehicle) => {
  if (vehicle.needsRepair) {
    return { statusText: '需维修', statusClass: 'needs-repair' }
  }
  if (vehicle.nextMaintenance && vehicle.nextMaintenance.days <= 7) {
    return { statusText: '需保养', statusClass: 'needs-maintenance' }
  }
  return { statusText: '正常', statusClass: 'normal' }
}

const loadVehicles = async () => {
  try {
    const res = await get('/vehicles')
    vehicles.value = res || []
  } catch (e) {
    vehicles.value = []
  }
}

const addVehicle = () => {
  uni.navigateTo({ url: '/pages/vehicle/add/add' })
}

const goDetail = (item) => {
  uni.navigateTo({ url: `/pages/vehicles/vehicles?id=${item.id}` })
}

const quickDiagnose = (item) => {
  uni.navigateTo({ url: `/pages/diagnose/diagnose?vehicleId=${item.id}` })
}

const viewRecord = (item) => {
  uni.showToast({ title: '查看维修记录', icon: 'none' })
}

const goDiagnose = () => {
  uni.switchTab({ url: '/pages/diagnose/diagnose' })
}

const goAppointment = () => {
  uni.showToast({ title: '预约功能开发中', icon: 'none' })
}

const goStore = () => {
  uni.showToast({ title: '门店功能开发中', icon: 'none' })
}

onMounted(() => {
  loadVehicles()
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

.user-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 25px;
  color: #fff;
}

.greeting {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.sub-greeting {
  font-size: 14px;
  opacity: 0.9;
  display: block;
  margin-top: 5px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
}

.vehicle-list {
  margin-bottom: 20px;
}

.vehicle-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-left: 4px solid #52c41a;
}

.vehicle-card.needs-maintenance {
  border-left-color: #faad14;
}

.vehicle-card.needs-repair {
  border-left-color: #ff4d4f;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.normal {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.needs-maintenance {
  background: #fffbe6;
  color: #faad14;
}

.status-badge.needs-repair {
  background: #fff1f0;
  color: #ff4d4f;
}

.plate {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.vehicle-info {
  margin-bottom: 12px;
}

.brand {
  font-size: 16px;
  color: #333;
  display: block;
}

.vin {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 4px;
  font-family: monospace;
}

.maintenance-info {
  display: flex;
  gap: 20px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #999;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.reminder {
  display: flex;
  align-items: center;
  background: #fff7e6;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
}

.reminder-icon {
  font-size: 20px;
  margin-right: 10px;
}

.reminder-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reminder-text {
  font-size: 13px;
  color: #333;
}

.reminder-days {
  font-size: 14px;
  font-weight: bold;
  color: #faad14;
}

.reminder-days.urgent {
  color: #ff4d4f;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
}

.action-btn.diagnose {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.action-btn.record {
  background: #f5f5f5;
  color: #666;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 16px;
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

.empty-btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 14px;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.action-card {
  flex: 1;
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
</style>