<template>
  <view class="login-container">
    <view class="logo">
      <text class="logo-icon">🚗</text>
      <text class="logo-text">智能车诊</text>
      <text class="logo-subtitle">让故障诊断更简单</text>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="label">手机号</text>
        <input class="input" v-model="form.phone" placeholder="请输入手机号" type="number" maxlength="11" />
      </view>
      
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="form.password" placeholder="请输入密码" password />
      </view>
      
      <view class="btn-group">
        <button class="btn-primary" @click="handleLogin" :loading="loading">登 录</button>
        <button class="btn-secondary" @click="goRegister">注册账号</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { post, setToken, setUser } from '../utils/auth'

const form = ref({ phone: '', password: '' })
const loading = ref(false)

const emit = defineEmits(['success'])

const handleLogin = async () => {
  if (!form.value.phone || !form.value.password) {
    uni.showToast({ title: '请填写完整', icon: 'none' })
    return
  }
  
  loading.value = true
  try {
    const res = await post('/auth/login', form.value)
    setToken(res.access_token)
    setUser(res.user)
    uni.showToast({ title: '登录成功', icon: 'success' })
    emit('success')
  } catch (err) {
    uni.showToast({ title: err.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  uni.showToast({ title: '跳转注册页', icon: 'none' })
}
</script>

<style scoped>
.login-container {
  padding: 60px 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.logo {
  text-align: center;
  margin-bottom: 50px;
}
.logo-icon {
  font-size: 80px;
  display: block;
  margin-bottom: 15px;
}
.logo-text {
  font-size: 32px;
  color: #fff;
  font-weight: bold;
  display: block;
}
.logo-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-top: 8px;
}
.form {
  background: #fff;
  border-radius: 20px;
  padding: 35px 25px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}
.form-item {
  margin-bottom: 25px;
}
.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}
.input {
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  background: #f8f9fa;
  transition: all 0.3s;
}
.input:focus {
  border-color: #667eea;
  background: #fff;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
.btn-secondary {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  height: 46px;
  line-height: 46px;
  border-radius: 23px;
  font-size: 15px;
}
</style>
