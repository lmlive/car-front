<template>
  <view class="register-container">
    <view class="header">
      <text class="back-btn" @click="goBack">‹</text>
      <text class="title">创建账号</text>
      <text class="placeholder"></text>
    </view>

    <view class="form-container">
      <view class="form">
        <view class="form-item" :class="{ error: errors.phone }">
          <text class="label">手机号</text>
          <view class="input-wrapper">
            <input
              class="input"
              v-model="form.phone"
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
              @blur="validatePhone"
            />
          </view>
          <text v-if="errors.phone" class="error-text">{{ errors.phone }}</text>
        </view>

        <view class="form-item" :class="{ error: errors.code }">
          <text class="label">验证码</text>
          <view class="input-wrapper code-wrapper">
            <input
              class="input"
              v-model="form.code"
              placeholder="请输入验证码"
              type="number"
              maxlength="6"
              @blur="validateCode"
            />
            <view
              class="code-btn"
              :class="{ disabled: countdown > 0 }"
              @click="sendCode"
            >
              <text v-if="countdown === 0">获取验证码</text>
              <text v-else>{{ countdown }}s</text>
            </view>
          </view>
          <text v-if="errors.code" class="error-text">{{ errors.code }}</text>
        </view>

        <view class="form-item" :class="{ error: errors.password }">
          <text class="label">设置密码</text>
          <view class="input-wrapper">
            <input
              class="input"
              v-model="form.password"
              placeholder="8-20位，包含字母和数字"
              password
              maxlength="20"
              @blur="validatePassword"
              @input="checkPasswordStrength"
            />
          </view>
          <view v-if="form.password" class="password-strength">
            <view class="strength-bar">
              <view
                class="strength-item"
                :class="{ active: passwordStrength.level >= 1 }"
              ></view>
              <view
                class="strength-item"
                :class="{ active: passwordStrength.level >= 2 }"
              ></view>
              <view
                class="strength-item"
                :class="{ active: passwordStrength.level >= 3 }"
              ></view>
            </view>
            <text class="strength-text" :class="passwordStrength.class">
              {{ passwordStrength.text }}
            </text>
          </view>
          <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
        </view>

        <view class="form-item" :class="{ error: errors.confirmPassword }">
          <text class="label">确认密码</text>
          <view class="input-wrapper">
            <input
              class="input"
              v-model="form.confirmPassword"
              placeholder="请再次输入密码"
              password
              maxlength="20"
              @blur="validateConfirmPassword"
            />
          </view>
          <text v-if="errors.confirmPassword" class="error-text">
            {{ errors.confirmPassword }}
          </text>
        </view>

        <view class="agreement-item">
          <view class="checkbox-wrapper" @click="toggleAgreement">
            <view class="checkbox" :class="{ checked: form.agreeAgreement }">
              <text v-if="form.agreeAgreement" class="checkmark">✓</text>
            </view>
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @click.stop="openAgreement('user')">《用户协议》</text>
              和
              <text class="link" @click.stop="openAgreement('privacy')">《隐私政策》</text>
            </text>
          </view>
        </view>

        <view class="btn-wrapper">
          <button
            class="btn-register"
            :class="{ disabled: !canRegister }"
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </view>

        <view class="login-link">
          <text>已有账号？</text>
          <text class="link" @click="goLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { post } from '../../utils/auth'

const form = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  agreeAgreement: false
})

const errors = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const countdown = ref(0)
let countdownTimer = null

const passwordStrength = ref({
  level: 0,
  text: '',
  class: ''
})

const canRegister = computed(() => {
  return (
    form.value.phone.length === 11 &&
    form.value.code.length >= 4 &&
    form.value.code.length <= 6 &&
    form.value.password.length >= 8 &&
    isValidPassword(form.value.password) &&
    form.value.confirmPassword === form.value.password &&
    form.value.agreeAgreement &&
    !loading.value
  )
})

const isValidPassword = (password) => {
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return password.length >= 8 && hasLetter && hasNumber
}

const validatePhone = () => {
  const phone = form.value.phone
  if (!phone) {
    errors.value.phone = '请输入手机号'
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    errors.value.phone = '请输入正确的手机号'
    return false
  }
  errors.value.phone = ''
  return true
}

const validateCode = () => {
  const code = form.value.code
  if (!code) {
    errors.value.code = '请输入验证码'
    return false
  }
  if (!/^\d{4,6}$/.test(code)) {
    errors.value.code = '验证码为4-6位数字'
    return false
  }
  errors.value.code = ''
  return true
}

const validatePassword = () => {
  const password = form.value.password
  if (!password) {
    errors.value.password = '请设置密码'
    return false
  }
  if (password.length < 8) {
    errors.value.password = '密码至少8位字符'
    return false
  }
  if (!/[a-zA-Z]/.test(password)) {
    errors.value.password = '密码需包含字母'
    return false
  }
  if (!/[0-9]/.test(password)) {
    errors.value.password = '密码需包含数字'
    return false
  }
  errors.value.password = ''
  return true
}

const validateConfirmPassword = () => {
  const confirmPassword = form.value.confirmPassword
  if (!confirmPassword) {
    errors.value.confirmPassword = '请再次输入密码'
    return false
  }
  if (confirmPassword !== form.value.password) {
    errors.value.confirmPassword = '两次密码输入不一致'
    return false
  }
  errors.value.confirmPassword = ''
  return true
}

const checkPasswordStrength = () => {
  const password = form.value.password
  if (!password) {
    passwordStrength.value = { level: 0, text: '', class: '' }
    return
  }

  let level = 0
  if (password.length >= 8) level++
  if (/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) level++
  if (/[^a-zA-Z0-9]/.test(password)) level++

  let text = ''
  let className = ''

  switch (level) {
    case 0:
      text = '密码强度：弱'
      className = 'weak'
      break
    case 1:
      text = '密码强度：弱'
      className = 'weak'
      break
    case 2:
      text = '密码强度：中'
      className = 'medium'
      break
    case 3:
      text = '密码强度：强'
      className = 'strong'
      break
  }

  passwordStrength.value = { level, text, class: className }
}

const sendCode = () => {
  if (countdown.value > 0) return

  if (!validatePhone()) return

  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)

  uni.showToast({ title: '验证码已发送', icon: 'success' })
}

const toggleAgreement = () => {
  form.value.agreeAgreement = !form.value.agreeAgreement
}

const openAgreement = (type) => {
  const title = type === 'user' ? '用户协议' : '隐私政策'
  uni.showModal({
    title: title,
    content: title + '内容...',
    showCancel: false
  })
}

const handleRegister = async () => {
  if (!form.value.agreeAgreement) {
    uni.showToast({ title: '请阅读并同意用户协议和隐私政策', icon: 'none' })
    return
  }

  const validations = [
    validatePhone(),
    validateCode(),
    validatePassword(),
    validateConfirmPassword()
  ]

  if (!validations.every(v => v)) {
    uni.showToast({ title: '请完善信息', icon: 'none' })
    return
  }

  loading.value = true

  try {
    const res = await post('/auth/register', {
      phone: form.value.phone,
      code: form.value.code,
      password: form.value.password
    })

    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/login/login' })
    }, 1000)
  } catch (err) {
    uni.showToast({ title: err.message || '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

const goLogin = () => {
  uni.redirectTo({ url: '/pages/login/login' })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 20px 20px;
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

.form-container {
  padding: 20px;
}

.form {
  background: #fff;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.form-item {
  margin-bottom: 24px;
}

.form-item.error .input {
  border-color: #ff4d4f;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.input {
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  background: #f8f9fa;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  border-color: #667eea;
  background: #fff;
}

.code-wrapper {
  display: flex;
  gap: 12px;
}

.code-wrapper .input {
  flex: 1;
}

.code-btn {
  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 13px;
  white-space: nowrap;
}

.code-btn.disabled {
  background: #ccc;
}

.error-text {
  display: block;
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 6px;
}

.password-strength {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.strength-bar {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-item {
  height: 4px;
  flex: 1;
  background: #e0e0e0;
  border-radius: 2px;
  transition: all 0.3s;
}

.strength-item.active:nth-child(1) {
  background: #ff4d4f;
}

.strength-item.active:nth-child(2) {
  background: #faad14;
}

.strength-item.active:nth-child(3) {
  background: #52c41a;
}

.strength-text {
  font-size: 12px;
  margin-left: 10px;
}

.strength-text.weak {
  color: #ff4d4f;
}

.strength-text.medium {
  color: #faad14;
}

.strength-text.strong {
  color: #52c41a;
}

.agreement-item {
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

.agreement-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.link {
  color: #667eea;
}

.btn-wrapper {
  margin-bottom: 20px;
}

.btn-register {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-register.disabled {
  background: #ccc;
  box-shadow: none;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link .link {
  margin-left: 5px;
}

@media (min-width: 768px) {
  .form-container {
    max-width: 480px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .form {
    padding: 40px 35px;
  }

  .header {
    max-width: 480px;
    margin: 0 auto;
    padding: 60px 20px 30px;
  }
}
</style>
