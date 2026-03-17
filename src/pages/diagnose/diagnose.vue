<template>
  <view class="page-container">
    <view class="header">
      <text class="title">🤖 AI智能诊断</text>
      <text class="subtitle">上传照片+描述症状，AI帮您分析故障</text>
    </view>

    <view class="diagnose-card">
      <view class="form-item">
        <text class="label">选择车辆</text>
        <picker 
          :range="vehicles" 
          range-key="plateNumber" 
          :value="selectedIndex"
          @change="onVehicleChange"
        >
          <view class="picker" :class="{ placeholder: !selectedVehicle }">
            {{ selectedVehicle?.plateNumber || '请选择车辆' }}
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
        <text class="vehicle-info" v-if="selectedVehicle">
          {{ selectedVehicle.brand }} {{ selectedVehicle.model }}
        </text>
      </view>

      <view class="form-item">
        <text class="label">上传故障照片</text>
        <view class="photo-upload">
          <view 
            class="photo-item" 
            v-for="(img, index) in photos" 
            :key="index"
          >
            <image class="photo-img" :src="img" mode="aspectFill" />
            <view class="photo-remove" @click="removePhoto(index)">✕</view>
          </view>
          <view class="photo-add" @click="choosePhoto" v-if="photos.length < 4">
            <text class="add-icon">📷</text>
            <text class="add-text">添加照片</text>
          </view>
        </view>
        <text class="photo-tip">建议上传故障部位细节照片，最多4张</text>
      </view>

      <view class="form-item">
        <text class="label">故障描述</text>
        <textarea 
          class="textarea" 
          v-model="symptom" 
          placeholder="请详细描述故障现象，例如：
• 启动时有异常响声
• 刹车时有抖动
• 仪表盘亮起故障灯
• 行驶中动力不足
• 油耗突然增加"
          :maxlength="500"
        />
        <text class="word-count">{{ symptom.length }}/500</text>
      </view>

      <view class="btn-diagnose" 
        @click="startDiagnose" 
        :class="{ loading: loading, disabled: !canSubmit }"
        :disabled="!canSubmit"
      >
        <text v-if="!loading">🔍 开始AI诊断</text>
        <text v-else>🤔 AI分析中...</text>
      </view>
    </view>

    <view class="result-card" v-if="result">
      <view class="result-header">
        <text class="result-title">📊 诊断结果</text>
        <view class="priority-badge" :class="'priority-' + result.priority">
          {{ getPriorityText(result.priority) }}
        </view>
      </view>

      <view class="result-section">
        <text class="section-title">🔎 故障分析</text>
        <text class="section-content">{{ result.diagnosis }}</text>
      </view>

      <view class="result-section">
        <text class="section-title">💡 可能原因</text>
        <view class="reason-list">
          <view class="reason-item" v-for="(reason, index) in result.reasons" :key="index">
            <text class="reason-num">{{ index + 1 }}</text>
            <text class="reason-text">{{ reason }}</text>
          </view>
        </view>
      </view>

      <view class="result-section">
        <text class="section-title">🛠️ 建议解决方案</text>
        <view class="solution-list">
          <view class="solution-item" v-for="(solution, index) in result.solutions" :key="index">
            <text class="solution-step">{{ index + 1 }}</text>
            <text class="solution-text">{{ solution }}</text>
          </view>
        </view>
      </view>

      <view class="result-actions">
        <view class="action-btn primary" @click="bookRepair">
          <text>📅 预约维修</text>
        </view>
        <view class="action-btn secondary" @click="shareResult">
          <text>📤 分享结果</text>
        </view>
      </view>
    </view>

    <view class="history-section" v-if="history.length > 0">
      <text class="section-title">📋 诊断历史</text>
      <view class="history-list">
        <view class="history-item" v-for="item in history" :key="item.id" @click="viewHistory(item)">
          <view class="history-info">
            <text class="history-vehicle">{{ item.vehiclePlate }}</text>
            <text class="history-date">{{ item.date }}</text>
          </view>
          <text class="history-symptom">{{ item.symptom }}</text>
          <view class="history-priority" :class="'priority-' + item.priority">
            {{ getPriorityText(item.priority) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get, post, getToken } from '../../utils/auth'

// 检查登录状态
const checkLogin = () => {
  if (!getToken()) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  return true
}

const vehicles = ref([])
const selectedVehicle = ref(null)
const selectedIndex = ref(-1)
const photos = ref([])
const symptom = ref('')
const result = ref(null)
const loading = ref(false)
const history = ref([])

const canSubmit = computed(() => {
  return selectedVehicle.value && symptom.value.length > 10
})

const getPriorityText = (priority) => {
  const map = {
    urgent: '紧急',
    high: '重要',
    medium: '一般',
    low: '建议关注'
  }
  return map[priority] || '一般'
}

const loadVehicles = async () => {
  if (!checkLogin()) return
  
  try {
    const res = await get('/vehicles')
    vehicles.value = res || []
    
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.options || {}
    if (options.vehicleId) {
      const index = vehicles.value.findIndex(v => v.id == options.vehicleId)
      if (index > -1) {
        selectedIndex.value = index
        selectedVehicle.value = vehicles.value[index]
      }
    }
  } catch (e) {
    console.log('加载车辆列表失败:', e)
    // 检查是否是由于未登录导致的错误
    if (e.message && (e.message.includes('未登录') || e.message.includes('401'))) {
      uni.reLaunch({ url: '/pages/login/login' })
    } else {
      vehicles.value = []
    }
  }
}

const onVehicleChange = (e) => {
  selectedIndex.value = e.detail.value
  selectedVehicle.value = vehicles.value[e.detail.value]
}

const choosePhoto = () => {
  if (!checkLogin()) return
  
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['camera'],
          success: (imgRes) => {
            photos.value.push(imgRes.tempFilePaths[0])
          }
        })
      } else {
        uni.chooseImage({
          count: 4 - photos.value.length,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: (imgRes) => {
            photos.value = [...photos.value, ...imgRes.tempFilePaths]
          }
        })
      }
    }
  })
}

const removePhoto = (index) => {
  photos.value.splice(index, 1)
}

const startDiagnose = async () => {
  if (!checkLogin()) return
  
  if (!canSubmit.value) {
    uni.showToast({ title: '请选择车辆并描述故障', icon: 'none' })
    return
  }
  
  loading.value = true
  result.value = null
  
  try {
    const res = await post('/ai/diagnose', {
      vehicleId: selectedVehicle.value.id,
      vehicleInfo: selectedVehicle.value,
      symptom: symptom.value,
      photos: photos.value
    })
    result.value = res
  } catch (e) {
    console.log('诊断失败:', e)
    // 检查是否是由于未登录导致的错误
    if (e.message && (e.message.includes('未登录') || e.message.includes('401'))) {
      uni.reLaunch({ url: '/pages/login/login' })
    } else {
      uni.showToast({ title: '诊断失败', icon: 'none' })
    }
  } finally {
    loading.value = false
  }
}

const clear = () => {
  symptom.value = ''
  photos.value = []
  result.value = null
}

onMounted(() => {
  if (checkLogin()) {
    loadVehicles()
  }
})

// 每次页面显示时检查登录状态
onShow(() => {
  if (checkLogin()) {
    loadVehicles()
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

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  display: block;
}

.subtitle {
  font-size: 14px;
  color: #999;
  display: block;
  margin-top: 5px;
}

.diagnose-card {
  background: #fff;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.form-item {
  margin-bottom: 25px;
}

.label {
  font-size: 16px;
  color: #333;
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.picker {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker.placeholder {
  color: #999;
}

.picker-arrow {
  font-size: 12px;
  color: #999;
}

.vehicle-info {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}

.photo-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  position: relative;
  width: 80px;
  height: 80px;
}

.photo-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.photo-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
}

.photo-add {
  width: 80px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 24px;
}

.add-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.photo-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.textarea {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  background: #f8f9fa;
  line-height: 1.6;
}

.word-count {
  font-size: 12px;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 5px;
}

.btn-diagnose {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  height: 56px;
  line-height: 56px;
  border-radius: 28px;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-diagnose.disabled {
  background: #ccc;
  box-shadow: none;
}

.btn-diagnose.loading {
  opacity: 0.7;
}

.result-card {
  background: #fff;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.result-title {
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.priority-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
}

.priority-urgent {
  background: #fff1f0;
  color: #ff4d4f;
}

.priority-high {
  background: #fff7e6;
  color: #fa8c16;
}

.priority-medium {
  background: #e6f7ff;
  color: #1890ff;
}

.priority-low {
  background: #f6ffed;
  color: #52c41a;
}

.result-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 12px;
}

.section-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  display: block;
}

.reason-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 10px;
}

.reason-num {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  margin-right: 10px;
  flex-shrink: 0;
}

.reason-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.solution-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.solution-item {
  display: flex;
  align-items: flex-start;
  background: #f0f5ff;
  padding: 12px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
}

.solution-step {
  width: 24px;
  height: 24px;
  background: #667eea;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  margin-right: 10px;
  flex-shrink: 0;
}

.solution-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.result-actions .action-btn {
  flex: 1;
  text-align: center;
  padding: 14px;
  border-radius: 25px;
  font-size: 15px;
}

.result-actions .primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.result-actions .secondary {
  background: #f5f5f5;
  color: #666;
}

.history-section {
  margin-top: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.history-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.history-vehicle {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.history-date {
  font-size: 12px;
  color: #999;
}

.history-symptom {
  font-size: 13px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.history-priority {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  display: inline-block;
}
</style>