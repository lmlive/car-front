<template>
  <view class="page-container">
    <view class="header">
      <text class="title">AI故障诊断</text>
    </view>
    
    <view class="diagnose-card">
      <view class="form-item">
        <text class="label">选择车辆</text>
        <picker :range="vehicles" range-key="plateNumber" @change="onVehicleChange">
          <view class="picker" :class="{ placeholder: !selectedVehicle }">
            {{ selectedVehicle?.plateNumber || '请选择车辆' }}
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">故障描述</text>
        <textarea 
          class="textarea" 
          v-model="symptom" 
          placeholder="请详细描述故障现象，如：&#10;• 启动时有异常响声&#10;• 刹车时有抖动&#10;• 仪表盘亮起故障灯&#10;• 行驶中动力不足"
        />
      </view>
      
      <view class="btn-diagnose" @click="startDiagnose" :class="{ loading }">
        <text v-if="!loading">开始诊断</text>
        <text v-else>诊断中...</text>
      </view>
    </view>
    
    <view class="result-card" v-if="result">
      <view class="result-header">
        <text class="result-title">诊断结果</text>
      </view>
      <text class="result-content">{{ result.diagnosis }}</text>
      <text class="result-time">{{ formatTime(result.timestamp) }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onShow } from 'vue'
import { get, post } from '../utils/auth'

const vehicles = ref([])
const selectedVehicle = ref(null)
const symptom = ref('')
const result = ref(null)
const loading = ref(false)

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const loadVehicles = async () => {
  try {
    const res = await get('/vehicles')
    vehicles.value = res || []
  } catch (e) {
    vehicles.value = []
  }
}

const onVehicleChange = (e) => {
  selectedVehicle.value = vehicles.value[e.detail.value]
}

const startDiagnose = async () => {
  if (!selectedVehicle.value) {
    uni.showToast({ title: '请选择车辆', icon: 'none' })
    return
  }
  if (!symptom.value) {
    uni.showToast({ title: '请描述故障现象', icon: 'none' })
    return
  }
  
  loading.value = true
  result.value = null
  try {
    const res = await post('/ai/diagnose', {
      vehicleId: selectedVehicle.value.id,
      vehicleInfo: selectedVehicle.value,
      symptom: symptom.value
    })
    result.value = res
  } catch (err) {
    uni.showToast({ title: '诊断失败', icon: 'none' })
  } finally {
    loading.value = false
  }
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
  margin-bottom: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
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
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}
.picker {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  background: #f8f9fa;
}
.picker.placeholder {
  color: #999;
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
.btn-diagnose {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  height: 52px;
  line-height: 52px;
  border-radius: 26px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
.btn-diagnose.loading {
  opacity: 0.7;
}
.result-card {
  background: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.result-header {
  margin-bottom: 15px;
}
.result-title {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.result-content {
  font-size: 14px;
  color: #333;
  line-height: 1.8;
  display: block;
  white-space: pre-wrap;
}
.result-time {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}
</style>
