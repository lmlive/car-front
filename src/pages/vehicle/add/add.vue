<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="page-title">{{ isEdit ? '编辑车辆' : '添加车辆' }}</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view class="form-scroll" scroll-y>
      <view class="form-content">
        <up-form :model="form" ref="uForm" labelPosition="left" labelWidth="90">
          <view class="section">
            <view class="section-header">
              <text class="section-icon">🚗</text>
              <text class="section-title">车辆基本信息</text>
            </view>
            
            <view class="form-card">
              <up-form-item label="车牌号" prop="plateNumber" :borderBottom="true" required>
                <up-input 
                  v-model="form.plateNumber" 
                  placeholder="如：京A12345"
                  border="bottom"
                  clearable
                ></up-input>
              </up-form-item>

              <view class="form-row">
                <up-form-item label="品牌" prop="brand" :borderBottom="true" class="flex-1" required>
                  <view class="picker-input" @click="showBrandSheet = true">
                    <up-input 
                      v-model="form.brand" 
                      placeholder="请选择品牌"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>

                <up-form-item label="车型" prop="model" :borderBottom="true" class="flex-1" required>
                  <up-input 
                    v-model="form.model" 
                    placeholder="如：秦PLUS"
                    border="bottom"
                    clearable
                  ></up-input>
                </up-form-item>
              </view>

              <view class="form-row">
                <up-form-item label="颜色" prop="color" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showColorSheet = true">
                    <up-input 
                      v-model="form.color" 
                      placeholder="请选择颜色"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>

                <up-form-item label="行驶里程" prop="mileage" :borderBottom="true" class="flex-1">
                  <up-input 
                    v-model="form.mileage" 
                    placeholder="如：50000"
                    border="bottom"
                    type="number"
                    clearable
                  >
                    <template #suffix>
                      <text class="unit">km</text>
                    </template>
                  </up-input>
                </up-form-item>
              </view>

              <up-form-item label="车架号" prop="vin" :borderBottom="true">
                <up-input 
                  v-model="form.vin" 
                  placeholder="请输入17位车架号"
                  border="bottom"
                  maxlength="17"
                  clearable
                ></up-input>
              </up-form-item>
            </view>
          </view>

          <view class="section">
            <view class="section-header">
              <text class="section-icon">📷</text>
              <text class="section-title">车辆照片</text>
            </view>
            
            <view class="form-card">
              <view class="photo-section">
                <text class="photo-label">车辆照片（最多6张）</text>
                <view class="photo-grid">
                  <view 
                    class="photo-item" 
                    v-for="(img, index) in form.photos" 
                    :key="index"
                  >
                    <image class="photo-img" :src="img" mode="aspectFill" />
                    <view class="photo-cover">
                      <view class="photo-remove" @click="removePhoto(index)">✕</view>
                    </view>
                  </view>
                  <view class="photo-add" @click="choosePhoto" v-if="form.photos.length < 6">
                    <text class="add-icon">📷</text>
                    <text class="add-text">添加照片</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="section">
            <view class="section-header">
              <text class="section-icon">⚙️</text>
              <text class="section-title">车辆参数</text>
            </view>
            
            <view class="form-card">
              <view class="form-row">
                <up-form-item label="发动机" prop="engineModel" :borderBottom="true" class="flex-1">
                  <up-input 
                    v-model="form.engineModel" 
                    placeholder="如：BYD476ZQA"
                    border="bottom"
                    clearable
                  ></up-input>
                </up-form-item>

                <up-form-item label="排量" prop="displacement" :borderBottom="true" class="flex-1">
                  <up-input 
                    v-model="form.displacement" 
                    placeholder="如：1.5"
                    border="bottom"
                    type="digit"
                    clearable
                  >
                    <template #suffix>
                      <text class="unit">L</text>
                    </template>
                  </up-input>
                </up-form-item>
              </view>

              <view class="form-row">
                <up-form-item label="最大功率" prop="maxPower" :borderBottom="true" class="flex-1">
                  <up-input 
                    v-model="form.maxPower" 
                    placeholder="如：118"
                    border="bottom"
                    type="digit"
                    clearable
                  >
                    <template #suffix>
                      <text class="unit">kW</text>
                    </template>
                  </up-input>
                </up-form-item>

                <up-form-item label="最大扭矩" prop="maxTorque" :borderBottom="true" class="flex-1">
                  <up-input 
                    v-model="form.maxTorque" 
                    placeholder="如：245"
                    border="bottom"
                    type="number"
                    clearable
                  >
                    <template #suffix>
                      <text class="unit">N·m</text>
                    </template>
                  </up-input>
                </up-form-item>
              </view>

              <view class="form-row">
                <up-form-item label="变速箱" prop="transmission" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showTransmissionSheet = true">
                    <up-input 
                      v-model="form.transmission" 
                      placeholder="请选择"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>

                <up-form-item label="驱动方式" prop="driveMode" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showDriveModeSheet = true">
                    <up-input 
                      v-model="form.driveMode" 
                      placeholder="请选择"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>
              </view>

              <view class="form-row">
                <up-form-item label="燃料类型" prop="fuelType" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showFuelTypeSheet = true">
                    <up-input 
                      v-model="form.fuelType" 
                      placeholder="请选择"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>

                <up-form-item label="座位数" prop="seats" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showSeatsSheet = true">
                    <up-input 
                      v-model="form.seats" 
                      placeholder="请选择"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>
              </view>

              <view class="form-row">
                <up-form-item label="年款" prop="year" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showYearSheet = true">
                    <up-input 
                      v-model="form.year" 
                      placeholder="请选择"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>

                <up-form-item label="购车日期" prop="purchaseDate" :borderBottom="true" class="flex-1">
                  <view class="picker-input" @click="showPurchaseDatePicker = true">
                    <up-input 
                      v-model="form.purchaseDate" 
                      placeholder="请选择"
                      border="bottom"
                      readonly
                    ></up-input>
                    <view class="picker-arrow">▼</view>
                  </view>
                </up-form-item>
              </view>

              <up-form-item label="购车金额" prop="purchasePrice" :borderBottom="true">
                <up-input 
                  v-model="form.purchasePrice" 
                  placeholder="如：15.98"
                  border="bottom"
                  type="digit"
                  clearable
                >
                  <template #suffix>
                    <text class="unit">万元</text>
                  </template>
                </up-input>
              </up-form-item>

              <up-form-item label="保险公司" prop="insuranceCompany" :borderBottom="true">
                <up-input 
                  v-model="form.insuranceCompany" 
                  placeholder="如：中国人保"
                  border="bottom"
                  clearable
                ></up-input>
              </up-form-item>

              <up-form-item label="保险到期日" prop="insuranceExpiry" :borderBottom="true">
                <view class="picker-input" @click="showInsuranceExpiryPicker = true">
                  <up-input 
                    v-model="form.insuranceExpiry" 
                    placeholder="请选择"
                    border="bottom"
                    readonly
                  ></up-input>
                  <view class="picker-arrow">▼</view>
                </view>
              </up-form-item>
            </view>
          </view>

          <view class="section">
            <view class="section-header">
              <text class="section-icon">🔧</text>
              <text class="section-title">保养设置</text>
            </view>
            
            <view class="form-card">
              <up-form-item label="保养间隔" prop="maintenanceInterval" :borderBottom="true">
                <up-input 
                  v-model="form.maintenanceInterval" 
                  placeholder="如：5000"
                  border="bottom"
                  type="number"
                  clearable
                >
                  <template #suffix>
                    <text class="unit">km</text>
                  </template>
                </up-input>
              </up-form-item>

              <up-form-item label="下次保养里程" prop="nextMaintenanceMileage" :borderBottom="true">
                <up-input 
                  v-model="form.nextMaintenanceMileage" 
                  placeholder="如：55000"
                  border="bottom"
                  type="number"
                  clearable
                >
                  <template #suffix>
                    <text class="unit">km</text>
                  </template>
                </up-input>
              </up-form-item>

              <up-form-item label="下次保养日期" prop="nextMaintenanceDate" :borderBottom="true">
                <view class="picker-input" @click="showNextMaintenanceDatePicker = true">
                  <up-input 
                    v-model="form.nextMaintenanceDate" 
                    placeholder="请选择"
                    border="bottom"
                    readonly
                  ></up-input>
                  <view class="picker-arrow">▼</view>
                </view>
              </up-form-item>
            </view>
          </view>

          <view class="section">
            <view class="section-header">
              <text class="section-icon">📝</text>
              <text class="section-title">备注信息</text>
            </view>
            
            <view class="form-card">
              <up-form-item prop="remark">
                <up-textarea 
                  v-model="form.remark" 
                  placeholder="如有其他信息需要备注，请在此输入..."
                  :maxlength="200"
                  count
                  border="surround"
                ></up-textarea>
              </up-form-item>
            </view>
          </view>

          <view class="btn-section">
            <up-button 
              type="primary" 
              :loading="submitting"
              @click="handleSubmit"
              class="submit-btn"
            >{{ isEdit ? '保存修改' : '添加车辆' }}</up-button>
          </view>
        </up-form>
      </view>
    </scroll-view>

    <up-action-sheet :show="showBrandSheet" :actions="brandActions" @select="onBrandSelect" @close="showBrandSheet = false"></up-action-sheet>
    <up-action-sheet :show="showColorSheet" :actions="colorActions" @select="onColorSelect" @close="showColorSheet = false"></up-action-sheet>
    <up-action-sheet :show="showTransmissionSheet" :actions="transmissionActions" @select="onTransmissionSelect" @close="showTransmissionSheet = false"></up-action-sheet>
    <up-action-sheet :show="showDriveModeSheet" :actions="driveModeActions" @select="onDriveModeSelect" @close="showDriveModeSheet = false"></up-action-sheet>
    <up-action-sheet :show="showFuelTypeSheet" :actions="fuelTypeActions" @select="onFuelTypeSelect" @close="showFuelTypeSheet = false"></up-action-sheet>
    <up-action-sheet :show="showSeatsSheet" :actions="seatsActions" @select="onSeatsSelect" @close="showSeatsSheet = false"></up-action-sheet>
    <up-action-sheet :show="showYearSheet" :actions="yearActions" @select="onYearSelect" @close="showYearSheet = false"></up-action-sheet>

    <up-datetime-picker 
      :show="showPurchaseDatePicker" 
      mode="date"
      title="选择购车日期"
      @confirm="onPurchaseDateConfirm"
      @close="showPurchaseDatePicker = false"
    ></up-datetime-picker>
    <up-datetime-picker 
      :show="showInsuranceExpiryPicker" 
      mode="date"
      title="选择保险到期日"
      @confirm="onInsuranceExpiryConfirm"
      @close="showInsuranceExpiryPicker = false"
    ></up-datetime-picker>
    <up-datetime-picker 
      :show="showNextMaintenanceDatePicker" 
      mode="date"
      title="选择下次保养日期"
      @confirm="onNextMaintenanceDateConfirm"
      @close="showNextMaintenanceDatePicker = false"
    ></up-datetime-picker>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { post, put, get, getToken, checkLoginAndRedirect } from '../../../utils/auth'

const uForm = ref(null)
const isEdit = ref(false)
const submitting = ref(false)

const showBrandSheet = ref(false)
const showColorSheet = ref(false)
const showTransmissionSheet = ref(false)
const showDriveModeSheet = ref(false)
const showFuelTypeSheet = ref(false)
const showSeatsSheet = ref(false)
const showYearSheet = ref(false)
const showPurchaseDatePicker = ref(false)
const showInsuranceExpiryPicker = ref(false)
const showNextMaintenanceDatePicker = ref(false)

const form = reactive({
  plateNumber: '',
  brand: '',
  model: '',
  color: '',
  mileage: '',
  vin: '',
  photos: [],
  engineModel: '',
  displacement: '',
  maxPower: '',
  maxTorque: '',
  transmission: '',
  driveMode: '',
  fuelType: '',
  seats: '',
  year: '',
  purchaseDate: '',
  purchasePrice: '',
  insuranceCompany: '',
  insuranceExpiry: '',
  maintenanceInterval: '5000',
  nextMaintenanceMileage: '',
  nextMaintenanceDate: '',
  remark: ''
})

const brandActions = [
  { name: '比亚迪' }, { name: '特斯拉' }, { name: '理想' }, { name: '小鹏' }, { name: '蔚来' }, { name: '吉利' }, { name: '长城' }, { name: '长安' }, { name: '奇瑞' }, { name: '其他' }
]
const colorActions = [
  { name: '白色' }, { name: '黑色' }, { name: '银色' }, { name: '灰色' }, { name: '红色' }, { name: '蓝色' }, { name: '金色' }, { name: '橙色' }, { name: '绿色' }, { name: '其他' }
]
const transmissionActions = [
  { name: '手动挡' }, { name: '自动挡' }, { name: '手自一体' }, { name: 'CVT' }, { name: '双离合' }
]
const driveModeActions = [
  { name: '前驱' }, { name: '后驱' }, { name: '四驱' }, { name: '适时四驱' }
]
const fuelTypeActions = [
  { name: '汽油' }, { name: '柴油' }, { name: '纯电动' }, { name: '插电混动' }, { name: '增程式' }, { name: '油电混动' }, { name: '天然气' }
]
const seatsActions = [
  { name: '2座' }, { name: '4座' }, { name: '5座' }, { name: '6座' }, { name: '7座' }, { name: '8座及以上' }
]

const currentYear = new Date().getFullYear()
const yearActions = Array.from({ length: 10 }, (_, i) => ({ name: `${currentYear - i}款` }))

const onBrandSelect = (e) => {
  form.brand = e.name
  showBrandSheet.value = false
}

const onColorSelect = (e) => {
  form.color = e.name
  showColorSheet.value = false
}

const onTransmissionSelect = (e) => {
  form.transmission = e.name
  showTransmissionSheet.value = false
}

const onDriveModeSelect = (e) => {
  form.driveMode = e.name
  showDriveModeSheet.value = false
}

const onFuelTypeSelect = (e) => {
  form.fuelType = e.name
  showFuelTypeSheet.value = false
}

const onSeatsSelect = (e) => {
  form.seats = e.name
  showSeatsSheet.value = false
}

const onYearSelect = (e) => {
  form.year = e.name
  showYearSheet.value = false
}

const onPurchaseDateConfirm = (e) => {
  const date = new Date(e.value)
  form.purchaseDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  showPurchaseDatePicker.value = false
}

const onInsuranceExpiryConfirm = (e) => {
  const date = new Date(e.value)
  form.insuranceExpiry = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  showInsuranceExpiryPicker.value = false
}

const onNextMaintenanceDateConfirm = (e) => {
  const date = new Date(e.value)
  form.nextMaintenanceDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  showNextMaintenanceDatePicker.value = false
}

const choosePhoto = () => {
  uni.chooseImage({
    count: 6 - form.photos.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.photos = [...form.photos, ...res.tempFilePaths].slice(0, 6)
    }
  })
}

const removePhoto = (index) => {
  form.photos.splice(index, 1)
}

const goBack = () => {
  uni.navigateBack()
}

const handleSubmit = async () => {
  if (!checkLogin()) return
  
  console.log('开始提交表单:', form)
  
  if (!form.plateNumber || !form.brand || !form.model) {
    console.log('验证失败，缺少必填字段')
    uni.showToast({ title: '请完善必填信息', icon: 'none' })
    return
  }
  
  submitting.value = true
  console.log('开始提交请求...')
  
  try {
    const data = { ...form }
    if (data.mileage) data.mileage = Number(data.mileage)
    if (data.displacement) data.displacement = Number(data.displacement)
    if (data.maxPower) data.maxPower = Number(data.maxPower)
    if (data.maxTorque) data.maxTorque = Number(data.maxTorque)
    if (data.purchasePrice) data.purchasePrice = Number(data.purchasePrice)
    if (data.nextMaintenanceMileage) data.nextMaintenanceMileage = Number(data.nextMaintenanceMileage)
    if (data.maintenanceInterval) data.maintenanceInterval = Number(data.maintenanceInterval)
    
    console.log('提交数据:', data)
    
    if (isEdit.value) {
      console.log('发起更新请求:', data)
      const res = await updateVehicle(data)
      console.log('更新成功', res)
      uni.showToast({ title: '保存成功', icon: 'success' })
    } else {
      console.log('发起创建请求:', data)
      const res = await createVehicle(data)
      console.log('添加成功', res)
      uni.showToast({ title: '添加成功', icon: 'success' })
    }
    
    setTimeout(() => {
      goBack()
    }, 1000)
  } catch (err) {
    console.error('请求失败:', err)
    // 检查是否是由于未登录导致的错误
    if (err.message && (err.message.includes('未登录') || err.message.includes('401'))) {
      uni.reLaunch({ url: '/pages/login/login' })
    } else {
      uni.showToast({ title: err.message || '操作失败', icon: 'none' })
    }
  } finally {
    submitting.value = false
    console.log('提交结束')
  }
}

import { ref, reactive, onMounted, onShow } from 'vue'
import { post, put, get, getToken, checkLoginAndRedirect } from '../../../utils/auth'

// 检查登录状态
const checkLogin = () => {
  if (!getToken()) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  return true
}

onMounted(() => {
  if (!checkLogin()) return
  
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.options || {}
    
    if (options.id) {
      isEdit.value = true
      loadVehicle(options.id)
    }
  } catch (e) {
    console.log('获取页面参数失败', e)
  }
})

// 每次页面显示时检查登录状态
onShow(() => {
  if (!checkLogin()) {
    return
  }
  
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.options || {}
    
    if (options.id) {
      isEdit.value = true
      loadVehicle(options.id)
    }
  } catch (e) {
    console.log('获取页面参数失败', e)
  }
})

const loadVehicle = async (id) => {
  if (!checkLogin()) return
  
  try {
    const res = await getVehicle(id)
    if (res && res.data) {
      Object.assign(form, res.data)
    }
  } catch (e) {
    console.log('加载车辆信息失败', e)
    // 检查是否是由于未登录导致的错误
    if (e.message && (e.message.includes('未登录') || e.message.includes('401'))) {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}
  } catch (e) {
    console.log('加载车辆信息失败', e)
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 20px;
  color: #333;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.placeholder {
  width: 40px;
}

.form-scroll {
  height: calc(100vh - 80px);
}

.form-content {
  padding: 20px;
  padding-bottom: 40px;
}

.section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.section-icon {
  font-size: 20px;
  margin-right: 8px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.form-row {
  display: flex;
  gap: 15px;
}

.flex-1 {
  flex: 1;
}

.unit {
  font-size: 14px;
  color: #999;
}

.picker-input {
  width: 100%;
  position: relative;
}

.picker-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
}

.photo-section {
  margin-top: 10px;
}

.photo-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: block;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.photo-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.photo-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-item:hover .photo-cover {
  opacity: 1;
}

.photo-remove {
  width: 22px;
  height: 22px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}

.photo-add {
  width: 100px;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 28px;
}

.add-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.btn-section {
  padding: 20px;
  padding-bottom: 40px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  font-size: 17px;
}
</style>
