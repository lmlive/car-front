<template>
  <view class="page-container">
    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <text class="page-title">{{ isEdit ? '编辑车辆' : '添加车辆' }}</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view class="form-scroll" scroll-y>
      <view class="form-content">
        <view class="section">
          <view class="section-header">
            <text class="section-icon">🚗</text>
            <text class="section-title">车辆基本信息</text>
          </view>
          
          <view class="form-card">
            <view class="form-item" :class="{ error: errors.plateNumber }">
              <text class="label">车牌号 <text class="required">*</text></text>
              <input 
                class="input" 
                v-model="form.plateNumber" 
                placeholder="如：京A12345"
                @input="validateField('plateNumber')"
              />
              <text class="error-text" v-if="errors.plateNumber">{{ errors.plateNumber }}</text>
            </view>

            <view class="form-row">
              <view class="form-item" :class="{ error: errors.brand }">
                <text class="label">品牌 <text class="required">*</text></text>
                <picker 
                  mode="selector" 
                  :range="brandList" 
                  @change="onBrandChange"
                >
                  <view class="picker" :class="{ placeholder: !form.brand }">
                    {{ form.brand || '请选择品牌' }}
                  </view>
                </picker>
                <text class="error-text" v-if="errors.brand">{{ errors.brand }}</text>
              </view>

              <view class="form-item" :class="{ error: errors.model }">
                <text class="label">车型 <text class="required">*</text></text>
                <input 
                  class="input" 
                  v-model="form.model" 
                  placeholder="如：秦PLUS"
                  @input="validateField('model')"
                />
                <text class="error-text" v-if="errors.model">{{ errors.model }}</text>
              </view>
            </view>

            <view class="form-row">
              <view class="form-item">
                <text class="label">颜色</text>
                <picker mode="selector" :range="colorList" @change="onColorChange">
                  <view class="picker" :class="{ placeholder: !form.color }">
                    {{ form.color || '请选择颜色' }}
                  </view>
                </picker>
              </view>

              <view class="form-item">
                <text class="label">行驶里程(km)</text>
                <input 
                  class="input" 
                  v-model="form.mileage" 
                  type="number"
                  placeholder="如：50000"
                />
              </view>
            </view>

            <view class="form-item">
              <text class="label">车架号(VIN)</text>
              <input 
                class="input vin-input" 
                v-model="form.vin" 
                placeholder="请输入17位车架号"
                maxlength="17"
                @input="validateField('vin')"
              />
              <text class="input-tip">17位字母数字组合，通常位于前挡风玻璃下方</text>
              <text class="error-text" v-if="errors.vin">{{ errors.vin }}</text>
            </view>
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

            <view class="photo-tips">
              <text class="tip-title">建议上传：</text>
              <text class="tip-item">• 车身外观正面照</text>
              <text class="tip-item">• 车身外观侧面照</text>
              <text class="tip-item">• 内饰照片</text>
              <text class="tip-item">• 仪表盘照片</text>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <text class="section-icon">⚙️</text>
            <text class="section-title">技术参数</text>
          </view>
          
          <view class="form-card">
            <view class="form-row">
              <view class="form-item">
                <text class="label">发动机型号</text>
                <input class="input" v-model="form.engineModel" placeholder="如：BYD476ZQA" />
              </view>

              <view class="form-item">
                <text class="label">排量(L)</text>
                <input class="input" v-model="form.displacement" type="digit" placeholder="如：1.5" />
              </view>
            </view>

            <view class="form-row">
              <view class="form-item">
                <text class="label">最大功率(kW)</text>
                <input class="input" v-model="form.maxPower" type="digit" placeholder="如：118" />
              </view>

              <view class="form-item">
                <text class="label">最大扭矩(N·m)</text>
                <input class="input" v-model="form.maxTorque" type="number" placeholder="如：245" />
              </view>
            </view>

            <view class="form-row">
              <view class="form-item">
                <text class="label">变速箱</text>
                <picker mode="selector" :range="transmissionList" @change="onTransmissionChange">
                  <view class="picker" :class="{ placeholder: !form.transmission }">
                    {{ form.transmission || '请选择' }}
                  </view>
                </picker>
              </view>

              <view class="form-item">
                <text class="label">驱动方式</text>
                <picker mode="selector" :range="driveModeList" @change="onDriveModeChange">
                  <view class="picker" :class="{ placeholder: !form.driveMode }">
                    {{ form.driveMode || '请选择' }}
                  </view>
                </picker>
              </view>
            </view>

            <view class="form-row">
              <view class="form-item">
                <text class="label">燃料类型</text>
                <picker mode="selector" :range="fuelTypeList" @change="onFuelTypeChange">
                  <view class="picker" :class="{ placeholder: !form.fuelType }">
                    {{ form.fuelType || '请选择' }}
                  </view>
                </picker>
              </view>

              <view class="form-item">
                <text class="label">座位数</text>
                <picker mode="selector" :range="seatList" @change="onSeatChange">
                  <view class="picker" :class="{ placeholder: !form.seats }">
                    {{ form.seats || '请选择' }}
                  </view>
                </picker>
              </view>
            </view>

            <view class="form-item">
              <text class="label">年款</text>
              <picker mode="selector" :range="yearList" @change="onYearChange">
                <view class="picker" :class="{ placeholder: !form.year }">
                  {{ form.year || '请选择年款' }}
                </view>
              </picker>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <text class="section-icon">📋</text>
            <text class="section-title">购车与保险信息</text>
          </view>
          
          <view class="form-card">
            <view class="form-item">
              <text class="label">购车日期</text>
              <picker mode="date" @change="onPurchaseDateChange">
                <view class="picker" :class="{ placeholder: !form.purchaseDate }">
                  {{ form.purchaseDate || '请选择购车日期' }}
                </view>
              </picker>
            </view>

            <view class="form-item">
              <text class="label">购车金额(万元)</text>
              <input class="input" v-model="form.purchasePrice" type="digit" placeholder="如：15.98" />
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
        </view>

        <view class="section">
          <view class="section-header">
            <text class="section-icon">🔧</text>
            <text class="section-title">保养设置</text>
          </view>
          
          <view class="form-card">
            <view class="form-item">
              <text class="label">保养间隔(公里)</text>
              <picker mode="selector" :range="maintenanceIntervalList" @change="onMaintenanceIntervalChange">
                <view class="picker" :class="{ placeholder: !form.maintenanceInterval }">
                  {{ form.maintenanceInterval || '请选择保养间隔' }}
                </view>
              </picker>
              <text class="input-tip">建议根据保养手册选择合适的间隔</text>
            </view>

            <view class="form-item">
              <text class="label">下次保养里程(km)</text>
              <input 
                class="input" 
                v-model="form.nextMaintenanceMileage" 
                type="number"
                placeholder="如：55000"
              />
            </view>

            <view class="form-item">
              <text class="label">下次保养日期</text>
              <picker mode="date" @change="onNextMaintenanceDateChange">
                <view class="picker" :class="{ placeholder: !form.nextMaintenanceDate }">
                  {{ form.nextMaintenanceDate || '请选择下次保养日期' }}
                </view>
              </picker>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-header">
            <text class="section-icon">📝</text>
            <text class="section-title">备注信息</text>
          </view>
          
          <view class="form-card">
            <view class="form-item">
              <textarea 
                class="textarea" 
                v-model="form.remark" 
                placeholder="如有其他信息需要备注，请在此输入..."
                :maxlength="200"
              />
              <text class="word-count">{{ form.remark.length }}/200</text>
            </view>
          </view>
        </view>

        <view class="form-actions">
          <view class="btn-cancel" @click="goBack">
            <text>取消</text>
          </view>
          <view class="btn-submit" :class="{ loading: submitting }" @click="handleSubmit">
            <text v-if="!submitting">{{ isEdit ? '保存修改' : '添加车辆' }}</text>
            <text v-else>提交中...</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { post, put, get } from '../../../utils/auth'

const isEdit = ref(false)
const submitting = ref(false)
const errors = reactive({})

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

const brandList = ['比亚迪', '特斯拉', '理想', '小鹏', '蔚来', '吉利', '长城', '长安', '奇瑞', '其他']
const colorList = ['白色', '黑色', '银色', '灰色', '红色', '蓝色', '金色', '橙色', '绿色', '其他']
const transmissionList = ['手动挡', '自动挡', '手自一体', 'CVT', '双离合']
const driveModeList = ['前驱', '后驱', '四驱', '适时四驱']
const fuelTypeList = ['汽油', '柴油', '纯电动', '插电混动', '增程式', '油电混动', '天然气']
const seatList = ['2座', '4座', '5座', '6座', '7座', '8座及以上']
const maintenanceIntervalList = ['3000', '5000', '7500', '10000', '15000']

const currentYear = new Date().getFullYear()
const yearList = Array.from({ length: 10 }, (_, i) => `${currentYear - i}款`)

const validateField = (field) => {
  switch(field) {
    case 'plateNumber':
      if (!form.plateNumber) {
        errors.plateNumber = '请输入车牌号'
      } else if (!/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/.test(form.plateNumber)) {
        errors.plateNumber = '车牌号格式不正确'
      } else {
        errors.plateNumber = ''
      }
      break
    case 'brand':
      errors.brand = form.brand ? '' : '请选择品牌'
      break
    case 'model':
      errors.model = form.model ? '' : '请输入车型'
      break
    case 'vin':
      if (form.vin && form.vin.length !== 17) {
        errors.vin = '车架号必须是17位'
      } else {
        errors.vin = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('plateNumber')
  validateField('brand')
  validateField('model')
  validateField('vin')
  
  return !errors.plateNumber && !errors.brand && !errors.model && !errors.vin
}

const onBrandChange = (e) => {
  form.brand = brandList[e.detail.value]
  validateField('brand')
}

const onColorChange = (e) => {
  form.color = colorList[e.detail.value]
}

const onTransmissionChange = (e) => {
  form.transmission = transmissionList[e.detail.value]
}

const onDriveModeChange = (e) => {
  form.driveMode = driveModeList[e.detail.value]
}

const onFuelTypeChange = (e) => {
  form.fuelType = fuelTypeList[e.detail.value]
}

const onSeatChange = (e) => {
  form.seats = seatList[e.detail.value]
}

const onYearChange = (e) => {
  form.year = yearList[e.detail.value]
}

const onPurchaseDateChange = (e) => {
  form.purchaseDate = e.detail.value
}

const onInsuranceExpiryChange = (e) => {
  form.insuranceExpiry = e.detail.value
}

const onMaintenanceIntervalChange = (e) => {
  form.maintenanceInterval = maintenanceIntervalList[e.detail.value]
}

const onNextMaintenanceDateChange = (e) => {
  form.nextMaintenanceDate = e.detail.value
}

const choosePhoto = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      const count = res.tapIndex === 0 ? 1 : 6 - form.photos.length
      uni.chooseImage({
        count: count,
        sizeType: ['compressed'],
        sourceType: res.tapIndex === 0 ? ['camera'] : ['album'],
        success: (imgRes) => {
          form.photos = [...form.photos, ...imgRes.tempFilePaths].slice(0, 6)
        }
      })
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
  if (!validateForm()) {
    uni.showToast({ title: '请完善必填信息', icon: 'none' })
    return
  }
  
  submitting.value = true
  
  try {
    const data = { ...form }
    if (data.mileage) data.mileage = Number(data.mileage)
    if (data.displacement) data.displacement = Number(data.displacement)
    if (data.maxPower) data.maxPower = Number(data.maxPower)
    if (data.maxTorque) data.maxTorque = Number(data.maxTorque)
    if (data.purchasePrice) data.purchasePrice = Number(data.purchasePrice)
    if (data.nextMaintenanceMileage) data.nextMaintenanceMileage = Number(data.nextMaintenanceMileage)
    
    if (isEdit.value) {
      await put(`/vehicles/${data.id}`, data)
      uni.showToast({ title: '保存成功', icon: 'success' })
    } else {
      await post('/vehicles', data)
      uni.showToast({ title: '添加成功', icon: 'success' })
    }
    
    setTimeout(() => {
      goBack()
    }, 1000)
  } catch (err) {
    uni.showToast({ title: err.message || '操作失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  
  if (options.id) {
    isEdit.value = true
    loadVehicleData(options.id)
  }
})

const loadVehicleData = async (id) => {
  try {
    const res = await get(`/vehicles/${id}`)
    if (res) {
      Object.assign(form, res)
    }
  } catch (e) {
    console.error('加载车辆数据失败', e)
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

.back-btn text {
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

.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-item {
  flex: 1;
}

.label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
}

.input, .picker, .textarea {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  background: #fafafa;
  width: 100%;
  box-sizing: border-box;
}

.input:focus, .picker:focus, .textarea:focus {
  border-color: #667eea;
  background: #fff;
}

.picker {
  color: #333;
}

.picker.placeholder, .input.placeholder {
  color: #999;
}

.vin-input {
  font-family: monospace;
  letter-spacing: 1px;
}

.input-tip {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  display: block;
}

.error .input, .error .picker {
  border-color: #ff4d4f;
}

.error-text {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 6px;
  display: block;
}

.textarea {
  height: 100px;
  resize: none;
  line-height: 1.5;
}

.word-count {
  font-size: 12px;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 6px;
}

.photo-section {
  margin-bottom: 20px;
}

.photo-label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  position: relative;
  width: 100px;
  height: 100px;
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
}

.photo-item:hover .photo-cover {
  opacity: 1;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
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

.photo-tips {
  background: #f9fafb;
  border-radius: 12px;
  padding: 15px;
}

.tip-title {
  font-size: 13px;
  color: #666;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}

.tip-item {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 4px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding: 0 20px;
}

.btn-cancel, .btn-submit {
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

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-submit.loading {
  opacity: 0.7;
}
</style>