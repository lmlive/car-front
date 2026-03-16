<template>
  <view class="page-container">
    <view class="header">
      <text class="title">🚗 车辆管理</text>
      <view class="add-btn" @click="showAddModal">+ 添加</view>
    </view>

    <view class="vehicle-list">
      <view 
        class="vehicle-card" 
        v-for="vehicle in vehicles" 
        :key="vehicle.id"
        :class="getStatusClass(vehicle)"
        @click="goDetail(vehicle)"
      >
        <view class="card-header">
          <view class="plate-section">
            <view class="plate-badge">{{ vehicle.plateNumber }}</view>
            <view class="status-badge" :class="getStatusClass(vehicle)">
              {{ getStatusText(vehicle) }}
            </view>
          </view>
          <view class="card-actions">
            <view class="action-icon" @click.stop="editVehicle(vehicle)">✏️</view>
            <view class="action-icon" @click.stop="deleteVehicle(vehicle.id)">🗑️</view>
          </view>
        </view>

        <view class="vehicle-main">
          <view class="vehicle-img">
            <text class="car-icon">🚙</text>
          </view>
          <view class="vehicle-info">
            <text class="brand">{{ vehicle.brand }} {{ vehicle.model }}</text>
            <text class="color" v-if="vehicle.color">{{ vehicle.color }}色</text>
            <text class="vin" v-if="vehicle.vin">VIN: {{ vehicle.vin }}</text>
          </view>
        </view>

        <view class="vehicle-details">
          <view class="detail-item">
            <text class="detail-label">行驶里程</text>
            <text class="detail-value">{{ vehicle.mileage || 0 }} km</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">注册日期</text>
            <text class="detail-value">{{ vehicle.registerDate || '未设置' }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">车龄</text>
            <text class="detail-value">{{ getVehicleAge(vehicle) }}</text>
          </view>
        </view>

        <view class="license-info" v-if="vehicle.licenseStatus">
          <view class="license-item">
            <text class="license-label">驾驶证</text>
            <text class="license-status" :class="vehicle.licenseStatus">{{ vehicle.licenseStatusText }}</text>
          </view>
          <view class="license-item">
            <text class="license-label">行驶证</text>
            <text class="license-status" :class="vehicle.drivingLicenseStatus">{{ vehicle.drivingLicenseStatusText }}</text>
          </view>
        </view>

        <view class="vehicle-actions">
          <view class="action-btn diagnose" @click.stop="vehicleDiagnose(vehicle)">
            <text>🔧 诊断</text>
          </view>
          <view class="action-btn record" @click.stop="viewRecord(vehicle)">
            <text>📋 记录</text>
          </view>
          <view class="action-btn insurance" @click.stop="viewInsurance(vehicle)">
            <text>📄 保险</text>
          </view>
        </view>
      </view>

      <view class="empty" v-if="vehicles.length === 0">
        <text class="empty-icon">🚗</text>
        <text class="empty-text">暂无车辆，请添加您的第一辆车</text>
        <view class="empty-btn" @click="showAddModal">添加车辆</view>
      </view>
    </view>

    <view class="modal" v-if="showModal">
      <view class="modal-mask" @click="closeModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ isEdit ? '编辑车辆' : '添加车辆' }}</text>
          <view class="modal-close" @click="closeModal">✕</view>
        </view>

        <scroll-view class="modal-body" scroll-y>
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
            <text class="section-title">车辆证件</text>

            <view class="upload-item">
              <text class="label">行驶证照片</text>
              <view class="upload-section">
                <view class="upload-box" @click="uploadImage('drivingLicenseFront')">
                  <image v-if="form.drivingLicenseFront" :src="form.drivingLicenseFront" class="preview-img" mode="aspectFill" />
                  <view v-else class="upload-placeholder">
                    <text class="upload-icon">📷</text>
                    <text class="upload-text">行驶证正面</text>
                  </view>
                </view>
                <view class="upload-box" @click="uploadImage('drivingLicenseBack')">
                  <image v-if="form.drivingLicenseBack" :src="form.drivingLicenseBack" class="preview-img" mode="aspectFill" />
                  <view v-else class="upload-placeholder">
                    <text class="upload-icon">📷</text>
                    <text class="upload-text">行驶证反面</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="form-item">
              <text class="label">注册日期</text>
              <picker mode="date" :end="today" @change="onRegisterDateChange">
                <view class="picker" :class="{ placeholder: !form.registerDate }">
                  {{ form.registerDate || '请选择注册日期' }}
                </view>
              </picker>
            </view>

            <view class="form-item">
              <text class="label">下次年检日期</text>
              <picker mode="date" :start="today" @change="onNextInspectDateChange">
                <view class="picker" :class="{ placeholder: !form.nextInspectDate }">
                  {{ form.nextInspectDate || '请选择下次年检日期' }}
                </view>
              </picker>
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">保险信息</text>

            <view class="form-item">
              <text class="label">保险公司</text>
              <input class="input" v-model="form.insuranceCompany" placeholder="如：中国人保" />
            </view>

            <view class="form-item">
              <text class="label">交强险到期日</text>
              <picker mode="date" @change="onInsuranceDateChange">
                <view class="picker" :class="{ placeholder: !form.insuranceDate }">
                  {{ form.insuranceDate || '请选择交强险到期日' }}
                </view>
              </picker>
            </view>

            <view class="form-item">
              <text class="label">商业险到期日</text>
              <picker mode="date" @change="onCommercialInsuranceDateChange">
                <view class="picker" :class="{ placeholder: !form.commercialInsuranceDate }">
                  {{ form.commercialInsuranceDate || '请选择商业险到期日' }}
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

            <view class="form-item">
              <text class="label">下次保养日期</text>
              <picker mode="date" :start="today" @change="onNextMaintenanceDateChange">
                <view class="picker" :class="{ placeholder: !form.nextMaintenanceDate }">
                  {{ form.nextMaintenanceDate || '请选择下次保养日期' }}
                </view>
              </picker>
            </view>
          </view>
        </scroll-view>

        <view class="modal-actions">
          <view class="btn-cancel" @click="closeModal">取消</view>
          <view class="btn-confirm" @click="saveVehicle">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { carAPI } from '@/utils/car-api.js'

const loading = ref(false)

const loadVehicles = async () => {
  loading.value = true
  try {
    const res = await carAPI.getVehicleList({ pageNo: 1, pageSize: 100 })
    if (res && res.list) {
      vehicles.value = res.list
    }
  } catch (error) {
    console.error('加载车辆列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadVehicles()
})

const showModal = ref(false)
const isEdit = ref(false)
const today = new Date().toISOString().split('T')[0]

const form = ref({
  id: '',
  plateNumber: '',
  brand: '',
  model: '',
  vin: '',
  color: '',
  mileage: '',
  registerDate: '',
  nextInspectDate: '',
  drivingLicenseFront: '',
  drivingLicenseBack: '',
  insuranceCompany: '',
  insuranceDate: '',
  commercialInsuranceDate: '',
  maintenanceInterval: '5000',
  nextMaintenanceMileage: '',
  nextMaintenanceDate: ''
})

const vehicles = ref([])

const getStatusClass = (vehicle) => {
  if (vehicle.insuranceDate && new Date(vehicle.insuranceDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
    return 'warning'
  }
  if (vehicle.nextInspectDate && new Date(vehicle.nextInspectDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
    return 'warning'
  }
  return 'normal'
}

const getStatusText = (vehicle) => {
  if (vehicle.insuranceDate && new Date(vehicle.insuranceDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
    return '保险将到期'
  }
  if (vehicle.nextInspectDate && new Date(vehicle.nextInspectDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
    return '年检将到期'
  }
  return '正常'
}

const getVehicleAge = (vehicle) => {
  if (!vehicle.registerDate) return '未知'
  const registerDate = new Date(vehicle.registerDate)
  const now = new Date()
  const years = now.getFullYear() - registerDate.getFullYear()
  const months = now.getMonth() - registerDate.getMonth()
  const totalMonths = years * 12 + months
  if (totalMonths < 12) {
    return `${totalMonths}个月`
  }
  const y = Math.floor(totalMonths / 12)
  const m = totalMonths % 12
  return m > 0 ? `${y}年${m}个月` : `${y}年`
}

const showAddModal = () => {
  form.value = {
    id: '',
    plateNumber: '',
    brand: '',
    model: '',
    vin: '',
    color: '',
    mileage: '',
    registerDate: '',
    nextInspectDate: '',
    drivingLicenseFront: '',
    drivingLicenseBack: '',
    insuranceCompany: '',
    insuranceDate: '',
    commercialInsuranceDate: '',
    maintenanceInterval: '5000',
    nextMaintenanceMileage: '',
    nextMaintenanceDate: ''
  }
  isEdit.value = false
  showModal.value = true
}

const editVehicle = (vehicle) => {
  form.value = { ...vehicle }
  isEdit.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const uploadImage = (type) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value[type] = res.tempFilePaths[0]
    }
  })
}

const onRegisterDateChange = (e) => {
  form.value.registerDate = e.detail.value
}

const onNextInspectDateChange = (e) => {
  form.value.nextInspectDate = e.detail.value
}

const onInsuranceDateChange = (e) => {
  form.value.insuranceDate = e.detail.value
}

const onCommercialInsuranceDateChange = (e) => {
  form.value.commercialInsuranceDate = e.detail.value
}

const onNextMaintenanceDateChange = (e) => {
  form.value.nextMaintenanceDate = e.detail.value
}

const saveVehicle = async () => {
  if (!form.value.plateNumber || !form.value.brand) {
    uni.showToast({ title: '请填写车牌和品牌', icon: 'none' })
    return
  }

  try {
    if (isEdit.value) {
      await carAPI.updateVehicle(form.value)
    } else {
      await carAPI.createVehicle(form.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    loadVehicles()
  } catch (error) {
    uni.showToast({ title: error.message || '保存失败', icon: 'none' })
  }
  closeModal()
}

const deleteVehicle = (id) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该车辆吗？此操作不可恢复。',
    success: async (res) => {
      if (res.confirm) {
        try {
          await carAPI.deleteVehicle(id)
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadVehicles()
        } catch (error) {
          uni.showToast({ title: error.message || '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const goDetail = (vehicle) => {
  uni.showToast({ title: '查看车辆详情', icon: 'none' })
}

const vehicleDiagnose = (vehicle) => {
  uni.navigateTo({ url: `/pages/diagnose/diagnose?vehicleId=${vehicle.id}` })
}

const viewRecord = (vehicle) => {
  uni.showToast({ title: '查看维修记录', icon: 'none' })
}

const viewInsurance = (vehicle) => {
  uni.showToast({ title: '查看保险信息', icon: 'none' })
}
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
  border-left: 4px solid #52c41a;
}

.vehicle-card.warning {
  border-left-color: #faad14;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.plate-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.plate-badge {
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-badge {
  font-size: 12px;
  padding: 4px 10px;
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

.card-actions {
  display: flex;
  gap: 10px;
}

.action-icon {
  font-size: 18px;
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

.vehicle-details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item {
  flex: 1;
  text-align: center;
}

.detail-label {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.license-info {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.license-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.license-label {
  font-size: 13px;
  color: #666;
}

.license-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
}

.license-status.valid {
  background: #f6ffed;
  color: #52c41a;
}

.license-status.expired {
  background: #fff1f0;
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

.action-btn.record {
  background: #f0f2f5;
  color: #333;
}

.action-btn.insurance {
  background: #e6f7ff;
  color: #1890ff;
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

.modal {
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
  padding: 20px 25px;
  overflow-y: auto;
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

.upload-section {
  display: flex;
  gap: 15px;
}

.upload-box {
  flex: 1;
  height: 100px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.upload-text {
  font-size: 11px;
  color: #999;
}

.preview-img {
  width: 100%;
  height: 100%;
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
