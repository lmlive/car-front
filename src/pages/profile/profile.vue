<template>
  <view class="page-container">
    <view class="profile-header">
      <view class="avatar-section">
        <view class="avatar">
          <text class="avatar-text">{{ userInfo.name ? userInfo.name.slice(0, 1) : '用' }}</text>
        </view>
        <view class="user-detail">
          <text class="user-name">{{ userInfo.name || '车主' }}</text>
          <text class="user-phone">{{ formatPhone(userInfo.phone) }}</text>
        </view>
        <view class="edit-btn" @click="editProfile">编辑资料</view>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ stats.vehicles }}</text>
        <text class="stat-label">车辆</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.repairs }}</text>
        <text class="stat-label">维修</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.appointments }}</text>
        <text class="stat-label">预约</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-group">
        <text class="menu-title">车辆管理</text>
        <view class="menu-item" @click="goVehicles">
          <text class="menu-icon">🚗</text>
          <text class="menu-text">我的车辆</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goMaintenance">
          <text class="menu-icon">🔧</text>
          <text class="menu-text">维护历史</text>
          <text class="menu-arrow">></text>
        </view>
      </view>

      <view class="menu-group">
        <text class="menu-title">账户安全</text>
        <view class="menu-item" @click="changePassword">
          <text class="menu-icon">🔐</text>
          <text class="menu-text">修改密码</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="changePhone">
          <text class="menu-icon">📱</text>
          <text class="menu-text">更换手机号</text>
          <text class="menu-arrow">></text>
        </view>
      </view>

      <view class="menu-group">
        <text class="menu-title">其他设置</text>
        <view class="menu-item" @click="goNotifications">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">消息通知</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>

    <view class="logout-section">
      <view class="logout-btn" @click="logout">
        <text>退出登录</text>
      </view>
    </view>

    <view class="modal" v-if="showEditModal">
      <view class="modal-mask" @click="closeModal"></view>
      <view class="modal-content">
        <text class="modal-title">编辑资料</text>
        
        <view class="form-item">
          <text class="label">姓名</text>
          <input class="input" v-model="editForm.name" placeholder="请输入姓名" />
        </view>
        
        <view class="form-item">
          <text class="label">手机号</text>
          <input class="input" v-model="editForm.phone" placeholder="请输入手机号" type="number" maxlength="11" />
        </view>

        <view class="modal-actions">
          <view class="btn-cancel" @click="closeModal">取消</view>
          <view class="btn-confirm" @click="saveProfile">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, post, removeToken, setUser } from '../../utils/auth'

const userInfo = ref({
  name: '车主',
  phone: '13812345678'
})

const stats = ref({
  vehicles: 2,
  repairs: 5,
  appointments: 3
})

const showEditModal = ref(false)
const editForm = ref({
  name: '',
  phone: ''
})

const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const loadUserInfo = async () => {
  try {
    const user = await get('/user/info')
    if (user) {
      userInfo.value = user
    }
  } catch (e) {
    // 使用默认信息
  }
}

const editProfile = () => {
  editForm.value = { ...userInfo.value }
  showEditModal.value = true
}

const closeModal = () => {
  showEditModal.value = false
}

const saveProfile = async () => {
  if (!editForm.value.name) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  
  try {
    await post('/user/update', editForm.value)
    userInfo.value = { ...editForm.value }
    setUser(editForm.value)
    uni.showToast({ title: '保存成功', icon: 'success' })
    closeModal()
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

const goVehicles = () => {
  uni.navigateTo({ url: '/pages/vehicles/vehicles' })
}

const goMaintenance = () => {
  uni.showToast({ title: '维护历史功能开发中', icon: 'none' })
}

const changePassword = () => {
  uni.showToast({ title: '修改密码功能开发中', icon: 'none' })
}

const changePhone = () => {
  uni.showToast({ title: '更换手机号功能开发中', icon: 'none' })
}

const goNotifications = () => {
  uni.showToast({ title: '消息通知功能开发中', icon: 'none' })
}

const goAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '智能车诊 V1.0.0\n让故障诊断更简单',
    showCancel: false
  })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        removeToken()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px 20px;
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
}

.avatar {
  width: 70px;
  height: 70px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 28px;
  color: #fff;
  font-weight: bold;
}

.user-detail {
  flex: 1;
  margin-left: 15px;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  display: block;
}

.user-phone {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-top: 4px;
}

.edit-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
}

.stats-section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  display: block;
}

.stat-label {
  font-size: 13px;
  color: #999;
  display: block;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #f0f0f0;
}

.menu-section {
  margin-bottom: 20px;
}

.menu-group {
  background: #fff;
  border-radius: 16px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.menu-title {
  font-size: 14px;
  color: #999;
  display: block;
  margin-bottom: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.menu-arrow {
  font-size: 14px;
  color: #ccc;
}

.logout-section {
  padding: 0 20px;
}

.logout-btn {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.logout-btn text {
  font-size: 16px;
  color: #ff4d4f;
}

.modal {
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