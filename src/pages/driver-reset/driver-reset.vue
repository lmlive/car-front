<template>
  <view class="reset-container">
    <view class="header">
      <text class="back-btn" @click="goBack">‹</text>
      <text class="title">找回密码</text>
      <text class="placeholder"></text>
    </view>

    <view class="steps">
      <view class="step" :class="{ active: step >= 1, completed: step > 1 }">
        <view class="step-num">1</view>
        <text class="step-text">验证身份</text>
      </view>
      <view class="step-line" :class="{ active: step > 1 }"></view>
      <view class="step" :class="{ active: step >= 2, completed: step > 2 }">
        <view class="step-num">2</view>
        <text class="step-text">重置密码</text>
      </view>
      <view class="step-line" :class="{ active: step > 2 }"></view>
      <view class="step" :class="{ active: step >= 3 }">
        <view class="step-num">3</view>
        <text class="step-text">完成</text>
      </view>
    </view>

    <view class="form-container">
      <view class="form" v-show="step === 1">
        <view class="form-tip">
          <text class="tip-icon">💡</text>
          <text class="tip-text">请输入您注册时使用的手机号</text>
        </view>

        <view class="form-item" :class="{ error: errors.phone }">
          <text class="label">手机号</text>
          <input
            class="input"
            v-model="form.phone"
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            @blur="validatePhone"
          />
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

        <view class="btn-wrapper">
          <button
            class="btn-next"
            :class="{ disabled: !canNextStep1 }"
            @click="nextStep1"
          >
            下一步
          </button>
        </view>
      </view>

      <view class="form" v-show="step === 2">
        <view class="form-tip success">
          <text class="tip-icon">✓</text>
          <text class="tip-text">手机号 {{ formatPhone(form.phone) }} 验证成功</text>
        </view>

        <view class="form-item" :class="{ error: errors.password }">
          <text class="label">新密码</text>
          <view class="input-wrapper">
            <input
              class="input"
              v-model="form.password"
              placeholder="8-20位，包含字母和数字"
              password
              maxlength="20"
              @blur="validatePassword"
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
          <text class="label">确认新密码</text>
          <view class="input-wrapper">
            <input
              class="input"
              v-model="form.confirmPassword"
              placeholder="请再次输入新密码"
              password
              @blur="validateConfirmPassword"
            />
          </view>
          <text v-if="errors.confirmPassword" class="error-text">
            {{ errors.confirmPassword }}
          </text>
        </view>

        <view class="btn-wrapper">
          <button class="btn-prev" @click="prevStep">上一步</button>
          <button
            class="btn-next"
            :class="{ disabled: !canNextStep2 }"
            @click="nextStep2"
          >
            确认修改
          </button>
        </view>
      </view>

      <view class="form" v-show="step === 3">
        <view class="success-page">
          <view class="success-icon">✓</view>
          <text class="success-title">密码重置成功</text>
          <text class="success-text">您可以使用新密码登录您的账号</text>
          <button class="btn-login" @click="goLogin">
            立即登录
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const step = ref(1)
const countdown = ref(0)
let countdownTimer = null

const form = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const passwordStrength = ref({
  level: 0,
  text: '',
  class: ''
})

const canNextStep1 = computed(() => {
  return /^1[3-9]\d{9}$/.test(form.value.phone) && form.value.code.length >= 4
})

const canNextStep2 = computed(() => {
  return isValidPassword(form.value.password) && form.value.confirmPassword === form.value.password
})

const isValidPassword = (password) => {
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return password.length >= 8 && hasLetter && hasNumber
}

const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const validatePhone = () => {
  if (!form.value.phone) {
    errors.value.phone = '请输入手机号'
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    errors.value.phone = '请输入正确的手机号'
    return false
  }
  errors.value.phone = ''
  return true
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = '请设置新密码'
    return false
  }
  if (form.value.password.length < 8) {
    errors.value.password = '密码至少8位字符'
    return false
  }
  if (!/[a-zA-Z]/.test(form.value.password)) {
    errors.value.password = '密码需包含字母'
    return false
  }
  if (!/[0-9]/.test(form.value.password)) {
    errors.value.password = '密码需包含数字'
    return false
  }
  errors.value.password = ''
  checkPasswordStrength()
  return true
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = '请再次输入密码'
    return false
  }
  if (form.value.confirmPassword !== form.value.password) {
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

const nextStep1 = () => {
  if (!validatePhone()) return
  
  if (!form.value.code) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  step.value = 2
}

const nextStep2 = () => {
  const validations = [validatePassword(), validateConfirmPassword()]
  if (!validations.every(v => v)) {
    uni.showToast({ title: '请完善信息', icon: 'none' })
    return
  }

  uni.showToast({ title: '密码重置成功', icon: 'success' })
  setTimeout(() => {
    step.value = 3
  }, 1000)
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const goBack = () => {
  if (step.value > 1) {
    step.value--
  } else {
    uni.navigateBack()
  }
}

const goLogin = () => {
  uni.redirectTo({ url: '/pages/driver-login/driver-login' })
}
</script>

<style scoped>
.reset-container {
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

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-num {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.step.active .step-num {
  background: #fff;
  color: #667eea;
}

.step.completed .step-num {
  background: #52c41a;
  color: #fff;
}

.step-text {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.step.active .step-text {
  color: #fff;
}

.step-line {
  width: 40px;
  height: 2px;
  background: rgba(255,255,255,0.3);
  margin: 0 10px;
  margin-bottom: 20px;
}

.step-line.active {
  background: #52c41a;
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

.form-tip {
  display: flex;
  align-items: center;
  background: #e6f7ff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 25px;
}

.form-tip.success {
  background: #f6ffed;
}

.tip-icon {
  font-size: 18px;
  margin-right: 10px;
}

.form-tip.success .tip-icon {
  color: #52c41a;
}

.tip-text {
  font-size: 13px;
  color: #666;
}

.form-tip.success .tip-text {
  color: #52c41a;
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

.btn-wrapper {
  display: flex;
  gap: 15px;
}

.btn-next, .btn-prev {
  flex: 1;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.btn-next {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-prev {
  background: #f5f5f5;
  color: #666;
  border: none;
}

.btn-next.disabled {
  background: #ccc;
  box-shadow: none;
}

.success-page {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #fff;
  margin: 0 auto 20px;
}

.success-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10px;
}

.success-text {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 30px;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

@media (min-width: 768px) {
  .form-container {
    max-width: 480px;
    margin: 0 auto;
    padding: 40px 20px;
  }
}
</style>
