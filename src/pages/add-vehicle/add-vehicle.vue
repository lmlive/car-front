<template>
  <view class="add-vehicle">
    <view class="page-header">
      <view class="header-title">添加车辆</view>
    </view>

    <view class="form-container">
      <form @submit="submitForm">
        <!-- 基本信息 -->
        <view class="form-section">
          <view class="section-title">基本信息</view>
          
          <view class="form-item">
            <view class="label">车牌号 <span class="required">*</span></view>
            <input 
              v-model="formData.plateNumber" 
              type="text" 
              placeholder="请输入车牌号"
              class="input"
              maxlength="10"
            />
          </view>

          <view class="form-item">
            <view class="label">品牌 <span class="required">*</span></view>
            <input 
              v-model="formData.brand" 
              type="text" 
              placeholder="请输入品牌"
              class="input"
            />
          </view>

          <view class="form-item">
            <view class="label">车型</view>
            <input 
              v-model="formData.model" 
              type="text" 
              placeholder="请输入车型"
              class="input"
            />
          </view>

          <view class="form-item">
            <view class="label">颜色</view>
            <input 
              v-model="formData.color" 
              type="text" 
              placeholder="请输入颜色"
              class="input"
            />
          </view>

          <view class="form-item">
            <view class="label">车架号(VIN)</view>
            <input 
              v-model="formData.vin" 
              type="text" 
              placeholder="请输入车架号"
              class="input"
              maxlength="17"
            />
          </view>
        </view>

        <!-- 行驶信息 -->
        <view class="form-section">
          <view class="section-title">行驶信息</view>
          
          <view class="form-item">
            <view class="label">当前里程(km)</view>
            <input 
              v-model="formData.mileage" 
              type="number" 
              placeholder="请输入当前里程"
              class="input"
            />
          </view>

          <view class="form-item">
            <view class="label">注册日期</view>
            <picker 
              mode="date" 
              :value="formData.registerDate" 
              @change="onRegisterDateChange"
            >
              <view class="picker-input">
                {{ formData.registerDate || '请选择注册日期' }}
              </view>
            </picker>
          </view>
        </view>

        <!-- 保险信息 -->
        <view class="form-section">
          <view class="section-title">保险信息</view>
          
          <view class="form-item">
            <view class="label">保险公司</view>
            <input 
              v-model="formData.insuranceCompany" 
              type="text" 
              placeholder="请输入保险公司"
              class="input"
            />
          </view>

          <view class="form-item">
            <view class="label">交强险到期日</view>
            <picker 
              mode="date" 
              :value="formData.insuranceDate" 
              @change="onInsuranceDateChange"
            >
              <view class="picker-input">
                {{ formData.insuranceDate || '请选择交强险到期日' }}
              </view>
            </picker>
          </view>

          <view class="form-item">
            <view class="label">商业险到期日</view>
            <picker 
              mode="date" 
              :value="formData.commercialInsuranceDate" 
              @change="onCommercialInsuranceDateChange"
            >
              <view class="picker-input">
                {{ formData.commercialInsuranceDate || '请选择商业险到期日' }}
              </view>
            </picker>
          </view>
        </view>

        <!-- 保养信息 -->
        <view class="form-section">
          <view class="section-title">保养信息</view>
          
          <view class="form-item">
            <view class="label">保养间隔(公里)</view>
            <input 
              v-model="formData.maintenanceInterval" 
              type="number" 
              placeholder="请输入保养间隔"
              class="input"
            />
          </view>

          <view class="form-item">
            <view class="label">下次保养日期</view>
            <picker 
              mode="date" 
              :value="formData.nextMaintenanceDate" 
              @change="onNextMaintenanceDateChange"
            >
              <view class="picker-input">
                {{ formData.nextMaintenanceDate || '请选择下次保养日期' }}
              </view>
            </picker>
          </view>

          <view class="form-item">
            <view class="label">下次保养里程</view>
            <input 
              v-model="formData.nextMaintenanceMileage" 
              type="number" 
              placeholder="请输入下次保养里程"
              class="input"
            />
          </view>
        </view>

        <!-- 行驶证照片 -->
        <view class="form-section">
          <view class="section-title">行驶证照片</view>
          
          <view class="photo-upload">
            <view class="photo-item">
              <view class="photo-label">行驶证正面</view>
              <view class="photo-container" @click="uploadLicenseFront">
                <image 
                  v-if="formData.licenseFront" 
                  :src="formData.licenseFront" 
                  class="photo-preview"
                  mode="aspectFill"
                />
                <view v-else class="photo-placeholder">
                  <text class="photo-icon">📷</text>
                  <text class="photo-text">点击上传</text>
                </view>
              </view>
            </view>

            <view class="photo-item">
              <view class="photo-label">行驶证反面</view>
              <view class="photo-container" @click="uploadLicenseBack">
                <image 
                  v-if="formData.licenseBack" 
                  :src="formData.licenseBack" 
                  class="photo-preview"
                  mode="aspectFill"
                />
                <view v-else class="photo-placeholder">
                  <text class="photo-icon">📷</text>
                  <text class="photo-text">点击上传</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 提交按钮 -->
        <view class="form-actions">
          <button type="default" class="btn-cancel" @click="navigateBack">取消</button>
          <button type="primary" class="btn-submit" form-type="submit">提交</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface VehicleForm {
  plateNumber: string
  brand: string
  model: string
  color: string
  vin: string
  mileage: number | null
  registerDate: string
  insuranceCompany: string
  insuranceDate: string
  commercialInsuranceDate: string
  maintenanceInterval: number | null
  nextMaintenanceDate: string
  nextMaintenanceMileage: number | null
  licenseFront: string
  licenseBack: string
}

const formData = ref<VehicleForm>({
  plateNumber: '',
  brand: '',
  model: '',
  color: '',
  vin: '',
  mileage: null,
  registerDate: '',
  insuranceCompany: '',
  insuranceDate: '',
  commercialInsuranceDate: '',
  maintenanceInterval: null,
  nextMaintenanceDate: '',
  nextMaintenanceMileage: null,
  licenseFront: '',
  licenseBack: ''
})

// 日期选择器事件
const onRegisterDateChange = (e: any) => {
  formData.value.registerDate = e.detail.value
}

const onInsuranceDateChange = (e: any) => {
  formData.value.insuranceDate = e.detail.value
}

const onCommercialInsuranceDateChange = (e: any) => {
  formData.value.commercialInsuranceDate = e.detail.value
}

const onNextMaintenanceDateChange = (e: any) => {
  formData.value.nextMaintenanceDate = e.detail.value
}

// 上传行驶证正面
const uploadLicenseFront = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 这里应该调用文件上传API
      formData.value.licenseFront = res.tempFilePaths[0]
    }
  })
}

// 上传行驶证反面
const uploadLicenseBack = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 这里应该调用文件上传API
      formData.value.licenseBack = res.tempFilePaths[0]
    }
  })
}

// 表单提交
const submitForm = async () => {
  // 表单验证
  if (!formData.value.plateNumber.trim()) {
    uni.showToast({
      title: '请输入车牌号',
      icon: 'none'
    })
    return
  }

  if (!formData.value.brand.trim()) {
    uni.showToast({
      title: '请输入品牌',
      icon: 'none'
    })
    return
  }

  try {
    // 调用后端API创建车辆
    // const result = await createVehicleApi(formData.value)
    
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
    
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '添加失败',
      icon: 'none'
    })
  }
}

// 返回上一页
const navigateBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.add-vehicle {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: white;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  
  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.form-container {
  padding: 30rpx;
}

.form-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    border-left: 6rpx solid #1890ff;
    padding-left: 16rpx;
  }
}

.form-item {
  margin-bottom: 30rpx;
  
  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 12rpx;
    
    .required {
      color: #f5222d;
    }
  }
  
  .input {
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    
    &:focus {
      border-color: #1890ff;
    }
  }
  
  .picker-input {
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.photo-upload {
  .photo-item {
    margin-bottom: 30rpx;
    
    .photo-label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .photo-container {
      width: 200rpx;
      height: 150rpx;
      border: 2rpx dashed #ddd;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .photo-preview {
        width: 100%;
        height: 100%;
        border-radius: 6rpx;
      }
      
      .photo-placeholder {
        text-align: center;
        
        .photo-icon {
          font-size: 48rpx;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .photo-text {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  
  .btn-cancel, .btn-submit {
    flex: 1;
    border-radius: 50rpx;
    padding: 24rpx;
    font-size: 30rpx;
  }
  
  .btn-cancel {
    background-color: #f5f5f5;
    color: #666;
    border: 1rpx solid #ddd;
  }
  
  .btn-submit {
    background: linear-gradient(135deg, #1890ff, #096dd9);
    color: white;
    border: none;
  }
}
</style>