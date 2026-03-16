<template>
  <view class="login-container">
    <view class="header">
      <text class="title">司机登录</text>
      <text class="subtitle">登录您的账号开始接单</text>
    </view>

    <view class="user-type-switch">
      <view 
        class="switch-item" 
        :class="{ active: userType === 'driver' }"
        @click="switchUserType('driver')"
      >
        <text>我是司机</text>
      </view>
      <view 
        class="switch-item" 
        :class="{ active: userType === 'owner' }"
        @click="switchUserType('owner')"
      >
        <text>我是车主</text>
      </view>
    </view>
    
    <view class="form">
      <view class="input-group">
        <text class="label">手机号</text>
        <input 
          class="input" 
          type="number" 
          v-model="mobile" 
          placeholder="请输入手机号" 
          maxlength="11"
        />
      </view>
      
      <view class="input-group">
        <text class="label">密码</text>
        <view class="password-wrapper">
          <input 
            class="input" 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="请输入密码" 
          />
          <view class="eye-icon" @click="togglePassword">
            <text>{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
          </view>
        </view>
      </view>

      <view class="remember-forgot">
        <view class="remember-wrapper" @click="toggleRemember">
          <view class="checkbox" :class="{ checked: rememberMe }">
            <text v-if="rememberMe" class="checkmark">✓</text>
          </view>
          <text class="remember-text">记住密码</text>
        </view>
        <text class="forgot-pwd" @click="goForgotPwd">忘记密码？</text>
      </view>
      
      <button 
        class="login-btn" 
        :class="{ 'btn-disabled': !canSubmit }"
        :disabled="!canSubmit || loading"
        @click="handleLogin"
      >
        <text v-if="!loading">登录</text>
        <view v-else class="loading-icon"></view>
      </button>

      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link" @click="goRegister">立即注册</text>
      </view>
    </view>

    <view class="third-party-login">
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line"></view>
      </view>
      <view class="third-party-icons">
        <view class="icon-item" @click="quickLogin('wechat')">
          <text class="icon">💬</text>
          <text class="icon-text">微信</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { driverAPI } from '@/utils/driver-api.js'

const mobile = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const userType = ref('driver')

const canSubmit = computed(() => {
  return mobile.value.length === 11 && password.value.length >= 6
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleRemember = () => {
  rememberMe.value = !rememberMe.value
  if (rememberMe.value) {
    uni.setStorageSync('remembered_mobile', mobile.value)
  } else {
    uni.removeStorageSync('remembered_mobile')
    uni.removeStorageSync('remembered_password')
  }
}

const loadRemembered = () => {
  const rememberedMobile = uni.getStorageSync('remembered_mobile')
  if (rememberedMobile) {
    mobile.value = rememberedMobile
    const rememberedPassword = uni.getStorageSync('remembered_password')
    if (rememberedPassword) {
      password.value = rememberedPassword
      rememberMe.value = true
    }
  }
}

const switchUserType = (type) => {
  userType.value = type
  if (type === 'owner') {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
}

const handleLogin = async () => {
  if (!canSubmit.value || loading.value) return
  
  loading.value = true
  
  if (rememberMe.value) {
    uni.setStorageSync('remembered_password', password.value)
  }
  
  try {
    const res = await driverAPI.login({
      mobile: mobile.value,
      password: password.value
    })
    
    uni.setStorageSync('token', res.accessToken)
    uni.setStorageSync('userInfo', { 
      mobile: mobile.value, 
      role: 'driver',
      driverId: res.driverId
    })
    uni.setStorageSync('userType', 'driver')
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/driver-index/driver-index'
      })
    }, 1500)
    
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  uni.navigateTo({
    url: '/pages/driver-register/driver-register'
  })
}

const goForgotPwd = () => {
  uni.navigateTo({
    url: '/pages/driver-reset/driver-reset'
  })
}

const quickLogin = (type) => {
  uni.showToast({
    title: `${type === 'wechat' ? '微信' : type}登录开发中`,
    icon: 'none'
  })
}

loadRemembered()
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px 40px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

.user-type-switch {
  display: flex;
  background: rgba(255,255,255,0.2);
  border-radius: 30px;
  padding: 4px;
  margin: 0 auto 30px;
  width: 220px;
}

.switch-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 26px;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  transition: all 0.3s;
}

.switch-item.active {
  background: #fff;
  color: #667eea;
  font-weight: 500;
}

.form {
  background: #fff;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 25px;
}

.label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
}

.input {
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  background: #f8f9fa;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  border-color: #667eea;
  background: #fff;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .input {
  padding-right: 50px;
}

.eye-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-wrapper {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: all 0.3s;
}

.checkbox.checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkmark {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.remember-text {
  font-size: 14px;
  color: #666;
}

.forgot-pwd {
  font-size: 14px;
  color: #667eea;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  height: 50px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-disabled {
  background: #ccc;
  box-shadow: none;
}

.loading-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link .link {
  color: #667eea;
  margin-left: 5px;
  font-weight: 500;
}

.third-party-login {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.3);
}

.divider-text {
  padding: 0 15px;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.icon-text {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
}
</style>
