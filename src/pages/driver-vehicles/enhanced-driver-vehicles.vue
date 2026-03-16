<template>
  <view class="driver-vehicles">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-title">我的车辆</view>
      <view class="header-actions">
        <button class="add-btn" @click="navigateToAddVehicle">
          <text class="icon-add">+</text>
          添加车辆
        </button>
      </view>
    </view>

    <!-- 车辆卡片列表 -->
    <view class="vehicle-list">
      <view 
        v-for="vehicle in vehicleList" 
        :key="vehicle.id" 
        class="vehicle-card"
        @click="navigateToVehicleDetail(vehicle.id)"
      >
        <view class="vehicle-info">
          <view class="plate-number">{{ vehicle.plateNumber }}</view>
          <view class="brand-model">{{ vehicle.brand }} {{ vehicle.model }}</view>
          <view class="vehicle-details">
            <view class="detail-item">
              <text class="label">里程：</text>
              <text class="value">{{ formatMileage(vehicle.mileage) }}</text>
            </view>
            <view class="detail-item">
              <text class="label">颜色：</text>
              <text class="value">{{ vehicle.color }}</text>
            </view>
          </view>
        </view>
        
        <!-- 保险和年检提醒 -->
        <view class="reminder-section">
          <view v-if="getInsuranceRemainingDays(vehicle.insuranceDate) <= 30" class="reminder-item warning">
            <text class="reminder-icon">🛡️</text>
            <text class="reminder-text">交强险{{ getInsuranceRemainingDays(vehicle.insuranceDate) }}天后到期</text>
          </view>
          <view v-if="getInsuranceRemainingDays(vehicle.commercialInsuranceDate) <= 30" class="reminder-item warning">
            <text class="reminder-icon">🏢</text>
            <text class="reminder-text">商业险{{ getInsuranceRemainingDays(vehicle.commercialInsuranceDate) }}天后到期</text>
          </view>
          <view v-if="getInspectionRemainingDays(vehicle.nextInspectDate) <= 30" class="reminder-item warning">
            <text class="reminder-icon">🔧</text>
            <text class="reminder-text">年检{{ getInspectionRemainingDays(vehicle.nextInspectDate) }}天后到期</text>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="action-buttons">
          <button class="btn-edit" @click.stop="editVehicle(vehicle)">编辑</button>
          <button class="btn-delete" @click.stop="deleteVehicle(vehicle.id)">删除</button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="vehicleList.length === 0" class="empty-state">
      <view class="empty-icon">🚗</view>
      <view class="empty-text">暂无车辆信息</view>
      <view class="empty-desc">点击上方按钮添加您的第一辆车</view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 车辆数据接口
interface Vehicle {
  id: number
  plateNumber: string
  brand: string
  model: string
  color: string
  mileage: number
  insuranceDate: string
  commercialInsuranceDate: string
  nextInspectDate: string
  nextMaintenanceDate: string
  nextMaintenanceMileage: number
}

const vehicleList = ref<Vehicle[]>([])
const loading = ref(false)

// 页面显示时加载数据
onShow(() => {
  loadVehicleList()
})

// 加载车辆列表
const loadVehicleList = async () => {
  loading.value = true
  try {
    // 调用后端API获取车辆列表
    // 这里需要集成实际的API调用
    const mockData: Vehicle[] = [
      {
        id: 1,
        plateNumber: '粤B12345',
        brand: '丰田',
        model: '凯美瑞',
        color: '白色',
        mileage: 50000,
        insuranceDate: '2026-04-15',
        commercialInsuranceDate: '2026-05-20',
        nextInspectDate: '2026-06-10',
        nextMaintenanceDate: '2026-03-25',
        nextMaintenanceMileage: 52000
      }
    ]
    vehicleList.value = mockData
  } catch (error) {
    console.error('加载车辆列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 格式化里程
const formatMileage = (mileage: number) => {
  return mileage ? `${mileage.toLocaleString()} km` : '未知'
}

// 计算保险剩余天数
const getInsuranceRemainingDays = (dateStr: string) => {
  if (!dateStr) return 999
  const targetDate = new Date(dateStr)
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 计算年检剩余天数
const getInspectionRemainingDays = (dateStr: string) => {
  if (!dateStr) return 999
  const targetDate = new Date(dateStr)
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 导航到添加车辆页面
const navigateToAddVehicle = () => {
  uni.navigateTo({
    url: '/pages/add-vehicle/add-vehicle'
  })
}

// 导航到车辆详情页面
const navigateToVehicleDetail = (vehicleId: number) => {
  uni.navigateTo({
    url: `/pages/vehicle-detail/vehicle-detail?id=${vehicleId}`
  })
}

// 编辑车辆
const editVehicle = (vehicle: Vehicle) => {
  uni.navigateTo({
    url: `/pages/edit-vehicle/edit-vehicle?id=${vehicle.id}`
  })
}

// 删除车辆
const deleteVehicle = async (vehicleId: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这辆车吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 调用删除API
          // await deleteVehicleApi(vehicleId)
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          loadVehicleList()
        } catch (error) {
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.driver-vehicles {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  
  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .add-btn {
    background: linear-gradient(135deg, #1890ff, #096dd9);
    color: white;
    border: none;
    border-radius: 50rpx;
    padding: 16rpx 32rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .icon-add {
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.vehicle-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  
  .vehicle-info {
    .plate-number {
      font-size: 32rpx;
      font-weight: bold;
      color: #1890ff;
      margin-bottom: 8rpx;
    }
    
    .brand-model {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 16rpx;
    }
    
    .vehicle-details {
      display: flex;
      gap: 20rpx;
      
      .detail-item {
        font-size: 24rpx;
        color: #999;
        
        .label {
          color: #666;
        }
      }
    }
  }
  
  .reminder-section {
    margin-top: 20rpx;
    
    .reminder-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      padding: 12rpx 16rpx;
      border-radius: 8rpx;
      margin-bottom: 8rpx;
      font-size: 24rpx;
      
      &.warning {
        background-color: #fff2e8;
        color: #fa541c;
      }
      
      .reminder-icon {
        font-size: 28rpx;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 16rpx;
    margin-top: 20rpx;
    
    .btn-edit, .btn-delete {
      flex: 1;
      padding: 16rpx;
      border-radius: 8rpx;
      font-size: 26rpx;
      border: none;
    }
    
    .btn-edit {
      background-color: #e6f7ff;
      color: #1890ff;
    }
    
    .btn-delete {
      background-color: #fff2f0;
      color: #f5222d;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 12rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
    color: #ccc;
  }
}

.loading {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>