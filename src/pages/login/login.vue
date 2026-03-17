<template>
  <view class="login-container">
    <view class="header">
      <view class="logo-wrapper">
        <view class="logo">
          <text class="logo-icon">🚗</text>
        </view>
      </view>
      <text class="title">欢迎回来</text>
      <text class="subtitle">登录您的账号以管理车辆</text>
    </view>
    
    <view class="form-card">
      <view class="form">
        <view class="input-item">
          <text class="input-icon">📱</text>
          <input 
            class="input" 
            type="number" 
            v-model="mobile" 
            placeholder="请输入手机号" 
            maxlength="11"
          />
        </view>
        
        <view class="input-item">
          <text class="input-icon">🔒</text>
          <input 
            class="input" 
            :password="!showPassword" 
            v-model="password" 
            placeholder="请输入密码" 
          />
          <text class="eye-icon" @click="showPassword = !showPassword">
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </text>
        </view>
        
        <view class="actions">
          <text class="forgot-pwd" @click="goForgotPwd">忘记密码？</text>
        </view>
        
        <button 
          class="login-btn" 
          :class="{ 'btn-disabled': !canSubmit }"
          :disabled="!canSubmit || loading"
          @click="handleLogin"
        >
          <text v-if="!loading" class="btn-text">登 录</text>
          <view v-else class="loading-icon"></view>
        </button>
        
        <view class="register-link">
          <text class="register-text">还没有账号？</text>
          <text class="link" @click="goRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { post } from '../../utils/request'
import { setToken, setUser } from '../../utils/auth'

const mobile = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const canSubmit = computed(() => {
  return mobile.value.length === 11 && password.value.length >= 6
})

const handleLogin = async () => {
  if (!canSubmit.value || loading.value) return
  
  loading.value = true
  
  try {
    const res = await post('/driver/login', {
      mobile: mobile.value,
      password: password.value
    })
    
    setToken(res.access_token)
    setUser(res.user)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
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
    url: '/pages/register/register'
  })
}

const goForgotPwd = () => {
  uni.showToast({
    title: '找回密码功能开发中',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px 30px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo-icon {
  font-size: 40px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.form-card {
  background: #fff;
  border-radius: 24px;
  padding: 30px 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.form {
  width: 100%;
}

.input-item {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.input-item:focus-within {
  border-color: #667eea;
  background: #fff;
}

.input-icon {
  font-size: 18px;
  margin-right: 10px;
}

.input {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.eye-icon {
  font-size: 16px;
  padding: 5px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
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
  
  &.btn-disabled {
    background: #ccc;
    box-shadow: none;
  }
}

.btn-text {
  letter-spacing: 5px;
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
  to { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  font-size: 14px;
}

.register-text {
  color: #666;
}

.link {
  color: #667eea;
  margin-left: 5px;
  font-weight: 500;
}
</style>
