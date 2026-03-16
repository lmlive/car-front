<template>
  <view class="page-container">
    <view class="header">
      <text class="back-btn" @click="goBack">‹</text>
      <text class="title">资质认证</text>
      <text class="placeholder"></text>
    </view>

    <view class="status-card" :class="certificationStatus.class">
      <view class="status-icon">{{ certificationStatus.icon }}</view>
      <text class="status-title">{{ certificationStatus.title }}</text>
      <text class="status-desc">{{ certificationStatus.desc }}</text>
      <view class="status-action" v-if="certificationStatus.action" @click="certificationStatus.action()">
        {{ certificationStatus.actionText }}
      </view>
    </view>

    <view class="cert-section">
      <text class="section-title">认证信息</text>
      
      <view class="info-card">
        <view class="info-item">
          <text class="info-label">姓名</text>
          <text class="info-value">{{ driverInfo.name || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">身份证号</text>
          <text class="info-value">{{ formatIdCard(driverInfo.idCard) || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">手机号</text>
          <text class="info-value">{{ formatPhone(driverInfo.phone) || '未填写' }}</text>
        </view>
      </view>
    </view>

    <view class="cert-section">
      <text class="section-title">驾驶证信息</text>
      
      <view class="info-card">
        <view class="info-item">
          <text class="info-label">驾驶证号</text>
          <text class="info-value">{{ driverInfo.driverLicenseNo || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">准驾车型</text>
          <text class="info-value">{{ driverInfo.driveType || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">初次领证日期</text>
          <text class="info-value">{{ driverInfo.licenseDate || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">有效期</text>
          <text class="info-value" :class="{ warning: isLicenseExpiringSoon }">
            {{ driverInfo.licenseExpiry || '未填写' }}
            <text v-if="isLicenseExpiringSoon" class="warning-text">（即将到期）</text>
          </text>
        </view>
      </view>
    </view>

    <view class="cert-section">
      <text class="section-title">证件照片</text>
      
      <view class="license-photos">
        <view class="photo-item">
          <text class="photo-label">驾驶证正面</text>
          <view class="photo-box" @click="viewPhoto(driverInfo.licenseFront)">
            <image v-if="driverInfo.licenseFront" :src="driverInfo.licenseFront" class="photo-img" mode="aspectFill" />
            <view v-else class="photo-placeholder">
              <text class="placeholder-icon">📷</text>
              <text class="placeholder-text">未上传</text>
            </view>
          </view>
        </view>
        <view class="photo-item">
          <text class="photo-label">驾驶证反面</text>
          <view class="photo-box" @click="viewPhoto(driverInfo.licenseBack)">
            <image v-if="driverInfo.licenseBack" :src="driverInfo.licenseBack" class="photo-img" mode="aspectFill" />
            <view v-else class="photo-placeholder">
              <text class="placeholder-icon">📷</text>
              <text class="placeholder-text">未上传</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="cert-section" v-if="canReupload">
      <text class="section-title">重新认证</text>
      <view class="reupload-tip">
        <text class="tip-icon">💡</text>
        <text class="tip-text">如证件信息有误或过期，请重新提交认证</text>
      </view>
      <button class="btn-reupload" @click="reupload">重新提交认证</button>
    </view>

    <view class="history-section">
      <text class="section-title">认证记录</text>
      <view class="history-list">
        <view class="history-item" v-for="(item, index) in historyList" :key="index">
          <view class="history-status" :class="item.status">
            <text>{{ item.statusText }}</text>
          </view>
          <view class="history-content">
            <text class="history-title">{{ item.title }}</text>
            <text class="history-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const driverInfo = ref({
  name: '张师傅',
  idCard: '110101199001011234',
  phone: '13812345678',
  driverLicenseNo: '110101199001011234',
  driveType: 'C1',
  licenseDate: '2015-03-15',
  licenseExpiry: '2030-03-15',
  licenseFront: '',
  licenseBack: '',
  status: 'verified'
})

const canReupload = computed(() => {
  return driverInfo.value.status === 'verified' || driverInfo.value.status === 'rejected'
})

const isLicenseExpiringSoon = computed(() => {
  if (!driverInfo.value.licenseExpiry) return false
  const expiryDate = new Date(driverInfo.value.licenseExpiry)
  const now = new Date()
  const days = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
  return days <= 90 && days > 0
})

const certificationStatus = computed(() => {
  const status = driverInfo.value.status
  if (status === 'verified') {
    return {
      class: 'success',
      icon: '✓',
      title: '认证成功',
      desc: '您的司机资质已通过审核',
      action: null
    }
  } else if (status === 'pending') {
    return {
      class: 'warning',
      icon: '⏳',
      title: '审核中',
      desc: '您的认证信息正在审核中，请耐心等待',
      action: null
    }
  } else if (status === 'rejected') {
    return {
      class: 'error',
      icon: '✕',
      title: '认证失败',
      desc: '您的认证信息未通过审核，请重新提交',
      action: 'reupload',
      actionText: '重新提交'
    }
  }
  return {
    class: 'info',
    icon: '📝',
    title: '未认证',
    desc: '请完成司机认证以开始接单',
    action: 'reupload',
    actionText: '立即认证'
  }
})

const historyList = ref([
  {
    status: 'verified',
    statusText: '通过',
    title: '身份认证 + 驾驶证认证',
    time: '2026-01-15 14:30'
  },
  {
    status: 'pending',
    statusText: '审核中',
    title: '提交认证资料',
    time: '2026-01-15 14:25'
  }
])

const formatIdCard = (idCard) => {
  if (!idCard) return ''
  return idCard.replace(/(\d{4})\d{10}(\d{4})/, '$1****$2')
}

const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const goBack = () => {
  uni.navigateBack()
}

const viewPhoto = (url) => {
  if (url) {
    uni.previewImage({
      urls: [url]
    })
  }
}

const reupload = () => {
  uni.navigateTo({
    url: '/pages/driver-register/driver-register'
  })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 20px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.back-btn {
  font-size: 32px;
  color: #fff;
  padding: 10px;
}

.title {
  font-size: 20px;
  color: #fff;
  font-weight: 500;
}

.placeholder {
  width: 52px;
}

.status-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin: -30px 20px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.status-card.success {
  border-top: 4px solid #52c41a;
}

.status-card.warning {
  border-top: 4px solid #faad14;
}

.status-card.error {
  border-top: 4px solid #ff4d4f;
}

.status-card.info {
  border-top: 4px solid #1890ff;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 15px;
}

.status-card.success .status-icon {
  background: #f6ffed;
  color: #52c41a;
}

.status-card.warning .status-icon {
  background: #fffbe6;
  color: #faad14;
}

.status-card.error .status-icon {
  background: #fff1f0;
  color: #ff4d4f;
}

.status-card.info .status-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.status-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.status-desc {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 20px;
}

.status-action {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 14px;
}

.cert-section {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15px;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.info-value.warning {
  color: #faad14;
}

.warning-text {
  color: #faad14;
  font-size: 12px;
}

.license-photos {
  display: flex;
  gap: 15px;
}

.photo-item {
  flex: 1;
}

.photo-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 10px;
}

.photo-box {
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.photo-img {
  width: 100%;
  height: 100%;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 12px;
  color: #999;
}

.reupload-tip {
  display: flex;
  align-items: center;
  background: #e6f7ff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
}

.tip-icon {
  font-size: 18px;
  margin-right: 10px;
}

.tip-text {
  font-size: 13px;
  color: #1890ff;
}

.btn-reupload {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  border: none;
}

.history-section {
  padding: 20px;
}

.history-list {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.history-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 15px;
}

.history-status.verified {
  background: #f6ffed;
  color: #52c41a;
}

.history-status.pending {
  background: #fffbe6;
  color: #faad14;
}

.history-status.rejected {
  background: #fff1f0;
  color: #ff4d4f;
}

.history-content {
  flex: 1;
}

.history-title {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.history-time {
  font-size: 12px;
  color: #999;
}
</style>
