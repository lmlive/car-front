<template>
  <view class="login-container">
    <view class="header">
      <text class="title">欢迎回来</text>
      <text class="subtitle">登录您的账号以管理车辆</text>
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
        <input 
          class="input" 
          type="password" 
          v-model="password" 
          placeholder="请输入密码" 
        />
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
        <text v-if="!loading">登录</text>
        <view v-else class="loading-icon"></view>
      </button>
      
      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link" @click="goRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const mobile = ref('')
const password = ref('')
const loading = ref(false)

const canSubmit = computed(() => {
  return mobile.value.length === 11 && password.value.length >= 6
})

const handleLogin = async () => {
  if (!canSubmit.value || loading.value) return
  
  loading.value = true
  
  try {
    const res = await uni.$http.post('/member/auth/login', {
      mobile: mobile.value,
      password: password.value
    })
    
    // 登录成功，保存 token 和用户信息
    uni.setStorageSync('token', res.accessToken)
    uni.setStorageSync('userInfo', { mobile: mobile.value, id: res.userId })
    
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
  uni.navigateTo({
    url: '/pages/reset/reset'
  })
}
</script>

<style scoped>
/* 保持原有样式不变 */
.login-container { padding: 30px 20px; }
.header { margin-bottom: 40px; }
.title { font-size: 28px; font-weight: bold; color: #333; display: block; margin-bottom: 10px; }
.subtitle { font-size: 14px; color: #666; }
.form { width: 100%; }
.input-group { margin-bottom: 25px; }
.label { font-size: 14px; color: #333; margin-bottom: 8px; display: block; font-weight: 500; }
.input { height: 44px; border-bottom: 1px solid #eee; font-size: 16px; padding: 0 10px; }
.actions { display: flex; justify-content: flex-end; margin-bottom: 30px; }
.forgot-pwd { font-size: 14px; color: #666; }
.login-btn { background-color: #007aff; color: #fff; height: 48px; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 500; margin-bottom: 20px; border: none; }
.btn-disabled { background-color: #a0cfff; }
.register-link { text-align: center; font-size: 14px; color: #666; }
.link { color: #007aff; margin-left: 5px; font-weight: 500; }
.loading-icon { width: 20px; height: 20px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
