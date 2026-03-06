<template>
  <view class="page-container">
    <view class="header">
      <text class="title">🚗 我的车辆</text>
      <view class="add-btn" @click="addVehicle">+ 添加</view>
    </view>
    
    <view class="vehicle-list">
      <view class="vehicle-card" v-for="item in vehicles" :key="item.id" @click="goDetail(item)">
        <view class="card-header">
          <view class="plate-badge">{{ item.plateNumber }}</view>
          <view class="status-dot" :class="getStatusClass(item)"></view>
        </view>
        
        <view class="vehicle-main">
          <view class="vehicle-img">
            <text class="car-icon">🚙</text>
          </view>
          <view class="vehicle-info">
            <text class="brand">{{ item.brand }} {{ item.model }}</text>
            <text class="color" v-if="item.color">{{ item.color }}色</text>
            <text class="vin" v-if="item.vin">VIN: {{ item.vin }}</text>
          </view>
        </view>

        <view class="vehicle-stats">
          <view class="stat-item">
            <text class="stat-label">行驶里程</text>
            <text class="stat-value">{{ item.mileage || 0 }} km</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">累计维修</text>
            <text class="stat-value">{{ item.repairCount || 0 }} 次</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">下次保养</text>
            <text class="stat-value" :class="{ urgent: item.nextMaintenance && item.nextMaintenance.days <= 7 }">
              {{ item.nextMaintenance ? item.nextMaintenance.days + '天后' : '未设置' }}
            </text>
          </view>
        </view>

        <view class="vehicle-actions">
          <view class="action-btn diagnose" @click.stop="quickDiagnose(item)">
            <text>🔧 诊断</text>
          </view>
          <view class="action-btn edit" @click.stop="editVehicle(item)">
            <text>✏️ 编辑</text>
          </view>
          <view class="action-btn delete" @click.stop="deleteVehicle(item.id)">
            <text>🗑️ 删除</text>
          </view>
        </view>
      </view>
      
      <view class="empty" v-if="vehicles.length === 0">
        <text class="empty-icon">🚗</text>
        <text class="empty-text">暂无车辆，请添加您的第一辆车</text>
        <view class="empty-btn" @click="addVehicle">添加车辆</view>
      </view>
    </view>

    <view class="form-modal" v-if="showModal">
      <view class="modal-mask" @click="closeModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ isEdit ? '编辑车辆' : '添加车辆' }}</text>
          <view class="modal-close" @click="closeModal">✕</view>
        </view>

        <view class="modal-body">
          <view class="form-section">
            <text class="section-title">基本信息</text>
            
            <view class="form-item">
              <text class="label">车牌号 *</text>
              <input class="input" v-model="form.plateNumber" placeholder="如：京A12345" />
            </view>
            
            <view class="form-row">
              <view class="form-item">
                <text class="label">品牌 *</text>
                <input class="input" v-model="form.brand" placeholder="如：比亚迪" />
              </view>
              
              <view class="form-item">
                <text class="label">车型</text>
                <input class="input" v-model="form.model" placeholder="如：秦PLUS" />
              </view>
            </view>

            <view class="form-row">
              <view class="form-item">
                <text class="label">颜色</text>
                <input class="input" v-model="form.color" placeholder="如：白色" />
              </view>
              
              <view class="form-item">
                <text class="label">行驶里程(km)</text>
                <input class="input" v-model="form.mileage" type="number" placeholder="如：50000" />
              </view>
            </view>
            
            <view class="form-item">
              <text class="label">车架号(VIN)</text>
              <input class="input" v-model="form.vin" placeholder="17位车架号" maxlength="17" />
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">购车信息</text>
            
            <view class="form-item">
              <text class="label">购车日期</text>
              <picker mode="date" @change="onPurchaseDateChange">
                <view class="picker" :class="{ placeholder: !form.purchaseDate }">
                  {{ form.purchaseDate || '请选择购车日期' }}
                </view>
              </picker>
            </view>
            
            <view class="form-item">
              <text class="label">保险公司</text>
              <input class="input" v-model="form.insuranceCompany" placeholder="如：中国人保" />
            </view>
            
            <view class="form-item">
              <text class="label">保险到期日</text>
              <picker mode="date" @change="onInsuranceExpiryChange">
                <view class="picker" :class="{ placeholder: !form.insuranceExpiry }">
                  {{ form.insuranceExpiry || '请选择保险到期日' }}
                </view>
              </picker>
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">保养设置</text>
            
            <view class="form-item">
              <text class="label">保养间隔(公里)</text>
              <input class="input" v-model="form.maintenanceInterval" type="number" placeholder="如：5000" />
            </view>
            
            <view class="form-item">
              <text class="label">下次保养里程(km)</text>
              <input class="input" v-model="form.nextMaintenanceMileage" type="number" placeholder="如：55000" />
            </view>
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="btn-cancel" @click="closeModal">取消</view>
          <view class="btn-confirm" @click="saveVehicle">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { get, post, put, del } from '../../utils/auth'

const vehicles = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({
  id: '',
  plateNumber: '',
  brand: '',
  model: '',
  vin: '',
  color: '',
  mileage: '',
  purchaseDate: '',
  insuranceCompany: '',
  insuranceExpiry: '',
  maintenanceInterval: '5000',
  nextMaintenanceMileage: ''
})

const getStatusClass = (item) => {
  if (item.needsRepair) return 'needs-repair'
  if (item.nextMaintenance && item.nextMaintenance.days <= 7) return 'needs-maintenance'
  return 'normal'
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

const editVehicle = (item) => {
  form.value = { ...item }
  isEdit.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const onPurchaseDateChange = (e) => {
  form.value.purchaseDate = e.detail.value
}

const onInsuranceExpiryChange = (e) => {
  form.value.insuranceExpiry = e.detail.value
}

const saveVehicle = async () => {
  if (!form.value.plateNumber || !form.value.brand) {
    uni.showToast({ title: '请填写车牌和品牌', icon: 'none' })
    return
  }
  
  try {
    const data = { ...form.value }
    if (data.mileage) data.mileage = Number(data.mileage)
    if (data.maintenanceInterval) data.maintenanceInterval = Number(data.maintenanceInterval)
    if (data.nextMaintenanceMileage) data.nextMaintenanceMileage = Number(data.nextMaintenanceMileage)
    
    if (isEdit.value) {
      await put(`/vehicles/${form.value.id}`, data)
    } else {
      await post('/vehicles', data)
    }
    showModal.value = false
    uni.showToast({ title: '保存成功', icon: 'success' })
    loadVehicles()
  } catch (err) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

const deleteVehicle = async (id) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该车辆吗？此操作不可恢复。',
    success: async (res) => {
      if (res.confirm) {
        await del(`/vehicles/${id}`)
        uni.showToast({ title: '删除成功', icon: 'success' })
        loadVehicles()
      }
    }
  })
}

const goDetail = (item) => {
  uni.showToast({ title: '查看车辆详情', icon: 'none' })
}

const quickDiagnose = (item) => {
  uni.navigateTo({ url: `/pages/diagnose/diagnose?vehicleId=${item.id}` })
}

onShow(() => {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.vehicle-card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.plate-badge {
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.normal {
  background: #52c41a;
}

.status-dot.needs-maintenance {
  background: #faad14;
}

.status-dot.needs-repair {
  background: #ff4d4f;
}

.vehicle-main {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.vehicle-img {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.car-icon {
  font-size: 40px;
}

.vehicle-info {
  flex: 1;
}

.vehicle-info .brand {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.vehicle-info .color {
  font-size: 14px;
  color: #666;
  display: block;
}

.vehicle-info .vin {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 4px;
  font-family: monospace;
}

.vehicle-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  background: #f9fafb;
  border-radius: 12px;
}

.stat-label {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.stat-value.urgent {
  color: #ff4d4f;
}

.vehicle-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
}

.action-btn text {
  font-weight: 500;
}

.action-btn.diagnose {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.action-btn.edit {
  background: #f0f2f5;
  color: #333;
}

.action-btn.delete {
  background: #fff1f0;
  color: #ff4d4f;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 20px;
}

.empty-icon {
  font-size: 80px;
  display: block;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 15px;
  color: #999;
  display: block;
  margin-bottom: 25px;
}

.empty-btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 14px 40px;
  border-radius: 30px;
  font-size: 15px;
}

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
}

.modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 30px 30px 0 0;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.modal-close {
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
  color: #999;
  font-size: 14px;
}

.modal-body {
  padding: 20px 25px;
}

.form-section {
  margin-bottom: 25px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #667eea;
  display: block;
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-item {
  flex: 1;
}

.form-item {
  margin-bottom: 18px;
}

.label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.input, .picker {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  background: #fafafa;
  width: 100%;
  box-sizing: border-box;
}

.input:focus, .picker:focus {
  border-color: #667eea;
  background: #fff;
}

.picker {
  color: #333;
}

.picker.placeholder {
  color: #999;
}

.modal-actions {
  display: flex;
  gap: 15px;
  padding: 20px 25px 35px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  text-align: center;
  padding: 16px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
</style>