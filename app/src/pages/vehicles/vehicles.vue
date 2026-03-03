<template>
  <view class="page-container">
    <view class="header">
      <text class="title">我的车辆</text>
      <view class="add-btn" @click="addVehicle">+ 添加</view>
    </view>
    
    <view class="vehicle-list">
      <view class="vehicle-card" v-for="item in vehicles" :key="item.id">
        <view class="vehicle-info">
          <view class="plate-row">
            <text class="plate">{{ item.plateNumber }}</text>
          </view>
          <text class="brand">{{ item.brand }} {{ item.model }}</text>
          <text class="vin" v-if="item.vin">VIN: {{ item.vin }}</text>
        </view>
        <view class="vehicle-actions">
          <view class="action-btn edit" @click="editVehicle(item)">编辑</view>
          <view class="action-btn delete" @click="deleteVehicle(item.id)">删除</view>
        </view>
      </view>
      
      <view class="empty" v-if="vehicles.length === 0">
        <text class="empty-icon">🚗</text>
        <text class="empty-text">暂无车辆，请添加</text>
      </view>
    </view>
    
    <view class="form-modal" v-if="showModal">
      <view class="modal-mask" @click="showModal = false"></view>
      <view class="modal-content">
        <text class="modal-title">{{ isEdit ? '编辑车辆' : '添加车辆' }}</text>
        
        <view class="form-item">
          <text class="label">车牌号 *</text>
          <input class="input" v-model="form.plateNumber" placeholder="请输入车牌号" />
        </view>
        
        <view class="form-item">
          <text class="label">品牌 *</text>
          <input class="input" v-model="form.brand" placeholder="如：比亚迪" />
        </view>
        
        <view class="form-item">
          <text class="label">车型</text>
          <input class="input" v-model="form.model" placeholder="如：秦PLUS" />
        </view>
        
        <view class="form-item">
          <text class="label">车架号(VIN)</text>
          <input class="input" v-model="form.vin" placeholder="17位车架号" maxlength="17" />
        </view>
        
        <view class="form-item">
          <text class="label">颜色</text>
          <input class="input" v-model="form.color" placeholder="如：白色" />
        </view>
        
        <view class="modal-actions">
          <view class="btn-cancel" @click="showModal = false">取消</view>
          <view class="btn-confirm" @click="saveVehicle">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onShow } from 'vue'
import { get, post, put, del } from '../utils/auth'

const vehicles = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ id: '', plateNumber: '', brand: '', model: '', vin: '', color: '' })

const loadVehicles = async () => {
  try {
    const res = await get('/vehicles')
    vehicles.value = res || []
  } catch (e) {
    vehicles.value = []
  }
}

const addVehicle = () => {
  form.value = { id: '', plateNumber: '', brand: '', model: '', vin: '', color: '' }
  isEdit.value = false
  showModal.value = true
}

const editVehicle = (item) => {
  form.value = { ...item }
  isEdit.value = true
  showModal.value = true
}

const saveVehicle = async () => {
  if (!form.value.plateNumber || !form.value.brand) {
    uni.showToast({ title: '请填写车牌和品牌', icon: 'none' })
    return
  }
  
  try {
    if (isEdit.value) {
      await put(`/vehicles/${form.value.id}`, form.value)
    } else {
      await post('/vehicles', form.value)
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
    title: '确认',
    content: '确定删除该车辆？',
    success: async (res) => {
      if (res.confirm) {
        await del(`/vehicles/${id}`)
        uni.showToast({ title: '删除成功', icon: 'success' })
        loadVehicles()
      }
    }
  })
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
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
}
.vehicle-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.plate-row {
  margin-bottom: 8px;
}
.plate {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.brand {
  font-size: 14px;
  color: #666;
  display: block;
}
.vin {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 5px;
  font-family: monospace;
}
.vehicle-actions {
  margin-top: 15px;
  display: flex;
  gap: 12px;
}
.action-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
}
.action-btn.edit {
  background: #f0f2f5;
  color: #667eea;
}
.action-btn.delete {
  background: #fff5f5;
  color: #ff4d4f;
}
.empty {
  text-align: center;
  padding: 80px 20px;
}
.empty-icon {
  font-size: 60px;
  display: block;
  margin-bottom: 15px;
}
.empty-text {
  font-size: 14px;
  color: #999;
}
.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
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
  border-radius: 24px 24px 0 0;
  padding: 30px 25px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 25px;
  text-align: center;
}
.form-item {
  margin-bottom: 20px;
}
.label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.input {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 15px;
  background: #f8f9fa;
}
.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}
.btn-cancel, .btn-confirm {
  flex: 1;
  text-align: center;
  padding: 14px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
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
