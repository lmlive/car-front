<template>
  <view class="register-container">
    <view class="header">
      <text class="back-btn" @click="goBack">‹</text>
      <text class="title">司机注册</text>
      <text class="placeholder"></text>
    </view>

    <view class="steps">
      <view class="step" :class="{ active: step >= 1, completed: step > 1 }">
        <view class="step-num">1</view>
        <text class="step-text">基本信息</text>
      </view>
      <view class="step-line" :class="{ active: step > 1 }"></view>
      <view class="step" :class="{ active: step >= 2, completed: step > 2 }">
        <view class="step-num">2</view>
        <text class="step-text">身份认证</text>
      </view>
      <view class="step-line" :class="{ active: step > 2 }"></view>
      <view class="step" :class="{ active: step >= 3 }">
        <view class="step-num">3</view>
        <text class="step-text">车辆绑定</text>
      </view>
    </view>

    <view class="form-container">
      <view class="form" v-show="step === 1">
        <view class="form-item" :class="{ error: errors.name }">
          <text class="label">姓名 *</text>
          <input
            class="input"
            v-model="form.name"
            placeholder="请输入真实姓名"
            @blur="validateName"
          />
          <text v-if="errors.name" class="error-text">{{ errors.name }}</text>
        </view>

        <view class="form-item" :class="{ error: errors.idCard }">
          <text class="label">身份证号 *</text>
          <input
            class="input"
            v-model="form.idCard"
            placeholder="请输入身份证号码"
            maxlength="18"
            @blur="validateIdCard"
          />
          <text v-if="errors.idCard" class="error-text">{{ errors.idCard }}</text>
        </view>

        <view class="form-item" :class="{ error: errors.phone }">
          <text class="label">手机号 *</text>
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
          <text class="label">验证码 *</text>
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

        <view class="form-item" :class="{ error: errors.password }">
          <text class="label">设置密码 *</text>
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
          <text class="label">确认密码 *</text>
          <view class="input-wrapper">
            <input
              class="input"
              v-model="form.confirmPassword"
              placeholder="请再次输入密码"
              password
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
              <text class="link" @click.stop="openAgreement('driver')">《司机协议》</text>
              和
              <text class="link" @click.stop="openAgreement('privacy')">《隐私政策》</text>
            </text>
          </view>
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
        <view class="form-item">
          <text class="label">驾驶证号 *</text>
          <input
            class="input"
            v-model="form.driverLicenseNo"
            placeholder="请输入驾驶证号码"
            @blur="validateDriverLicense"
          />
          <text v-if="errors.driverLicenseNo" class="error-text">{{ errors.driverLicenseNo }}</text>
        </view>

        <view class="form-item">
          <text class="label">准驾车型 *</text>
          <picker mode="selector" :range="driveTypes" @change="onDriveTypeChange">
            <view class="picker" :class="{ placeholder: !form.driveType }">
              {{ form.driveType || '请选择准驾车型' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">初次领证日期 *</text>
          <picker mode="date" :end="today" @change="onLicenseDateChange">
            <view class="picker" :class="{ placeholder: !form.licenseDate }">
              {{ form.licenseDate || '请选择初次领证日期' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">驾驶证有效期 *</text>
          <picker mode="date" :start="today" @change="onLicenseExpiryChange">
            <view class="picker" :class="{ placeholder: !form.licenseExpiry }">
              {{ form.licenseExpiry || '请选择驾驶证有效期' }}
            </view>
          </picker>
        </view>

        <view class="form-item upload-item">
          <text class="label">驾驶证照片 *</text>
          <view class="upload-section">
            <view class="upload-box" @click="uploadImage('licenseFront')">
              <image v-if="form.licenseFront" :src="form.licenseFront" class="preview-img" mode="aspectFill" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">📷</text>
                <text class="upload-text">上传驾驶证正面</text>
              </view>
            </view>
            <view class="upload-box" @click="uploadImage('licenseBack')">
              <image v-if="form.licenseBack" :src="form.licenseBack" class="preview-img" mode="aspectFill" />
              <view v-else class="upload-placeholder">
                <text class="upload-icon">📷</text>
                <text class="upload-text">上传驾驶证反面</text>
              </view>
            </view>
          </view>
        </view>

        <view class="btn-wrapper">
          <button class="btn-prev" @click="prevStep">上一步</button>
          <button
            class="btn-next"
            :class="{ disabled: !canNextStep2 }"
            @click="nextStep2"
          >
            下一步
          </button>
        </view>
      </view>

      <view class="form" v-show="step === 3">
        <view class="form-tip">
          <text class="tip-icon">💡</text>
          <text class="tip-text">您可以选择现在绑定车辆或稍后在个人中心添加</text>
        </view>

        <view class="form-item">
          <text class="label">车牌号</text>
          <input
            class="input"
            v-model="form.plateNumber"
            placeholder="如：京A12345（选填）"
          />
        </view>

        <view class="form-item">
          <text class="label">车辆品牌</text>
          <input
            class="input"
            v-model="form.brand"
            placeholder="如：比亚迪（选填）"
          />
        </view>

        <view class="form-item">
          <text class="label">车型</text>
          <input
            class="input"
            v-model="form.model"
            placeholder="如：秦PLUS（选填）"
          />
        </view>

        <view class="form-item">
          <text class="label">车架号(VIN)</text>
          <input
            class="input"
            v-model="form.vin"
            placeholder="17位车架号（选填）"
            maxlength="17"
          />
        </view>

        <view class="btn-wrapper">
          <button class="btn-prev" @click="prevStep">上一步</button>
          <button
            class="btn-submit"
            :class="{ disabled: !canSubmit || loading }"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ loading ? '提交中...' : '完成注册' }}
          </button>
        </view>

        <view class="skip-link" @click="skipBindVehicle">
          <text>暂不绑定车辆，先完成注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { driverAPI } from '@/utils/driver-api.js'

const step = ref(1)
const loading = ref(false)
const countdown = ref(0)
let countdownTimer = null

const today = new Date().toISOString().split('T')[0]

const driveTypes = ['C1', 'C2', 'B1', 'B2', 'A1', 'A2', 'A3']

const form = ref({
  name: '',
  idCard: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  agreeAgreement: false,
  driverLicenseNo: '',
  driveType: '',
  licenseDate: '',
  licenseExpiry: '',
  licenseFront: '',
  licenseBack: '',
  plateNumber: '',
  brand: '',
  model: '',
  vin: ''
})

const errors = ref({
  name: '',
  idCard: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  driverLicenseNo: ''
})

const passwordStrength = ref({
  level: 0,
  text: '',
  class: ''
})

const canNextStep1 = computed(() => {
  return (
    form.value.name.length >= 2 &&
    /^1[3-9]\d{9}$/.test(form.value.phone) &&
    form.value.code.length >= 4 &&
    isValidPassword(form.value.password) &&
    form.value.confirmPassword === form.value.password &&
    form.value.agreeAgreement
  )
})

const canNextStep2 = computed(() => {
  return (
    form.value.driverLicenseNo.length >= 6 &&
    form.value.driveType &&
    form.value.licenseDate &&
    form.value.licenseExpiry &&
    form.value.licenseFront &&
    form.value.licenseBack
  )
})

const canSubmit = computed(() => {
  return form.value.name && form.value.phone && form.value.password
})

const isValidPassword = (password) => {
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return password.length >= 8 && hasLetter && hasNumber
}

const validateName = () => {
  if (!form.value.name) {
    errors.value.name = '请输入姓名'
    return false
  }
  if (form.value.name.length < 2) {
    errors.value.name = '姓名至少2个字符'
    return false
  }
  errors.value.name = ''
  return true
}

const validateIdCard = () => {
  if (!form.value.idCard) {
    errors.value.idCard = '请输入身份证号码'
    return false
  }
  if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(form.value.idCard)) {
    errors.value.idCard = '请输入正确的身份证号码'
    return false
  }
  errors.value.idCard = ''
  return true
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
    errors.value.password = '请设置密码'
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

const validateDriverLicense = () => {
  if (!form.value.driverLicenseNo) {
    errors.value.driverLicenseNo = '请输入驾驶证号码'
    return false
  }
  if (form.value.driverLicenseNo.length < 6) {
    errors.value.driverLicenseNo = '请输入正确的驾驶证号码'
    return false
  }
  errors.value.driverLicenseNo = ''
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

const toggleAgreement = () => {
  form.value.agreeAgreement = !form.value.agreeAgreement
}

const openAgreement = (type) => {
  const title = type === 'driver' ? '司机协议' : '隐私政策'
  uni.showModal({
    title: title,
    content: title + '内容...',
    showCancel: false
  })
}

const onDriveTypeChange = (e) => {
  form.value.driveType = driveTypes[e.detail.value]
}

const onLicenseDateChange = (e) => {
  form.value.licenseDate = e.detail.value
}

const onLicenseExpiryChange = (e) => {
  form.value.licenseExpiry = e.detail.value
}

const uploadImage = (type) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value[type] = res.tempFilePaths[0]
    }
  })
}

const nextStep1 = () => {
  const validations = [validateName(), validateIdCard(), validatePhone(), validatePassword(), validateConfirmPassword()]
  if (!validations.every(v => v)) {
    uni.showToast({ title: '请完善信息', icon: 'none' })
    return
  }

  if (!form.value.code) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  step.value = 2
}

const nextStep2 = () => {
  if (!form.value.driverLicenseNo || !form.value.driveType || !form.value.licenseDate || 
      !form.value.licenseExpiry || !form.value.licenseFront || !form.value.licenseBack) {
    uni.showToast({ title: '请完善认证信息', icon: 'none' })
    return
  }
  step.value = 3
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const skipBindVehicle = () => {
  handleSubmit()
}

const handleSubmit = async () => {
  if (!form.value.agreeAgreement) {
    uni.showToast({ title: '请阅读并同意司机协议和隐私政策', icon: 'none' })
    return
  }

  loading.value = true

  try {
    await driverAPI.register({
      mobile: form.value.phone,
      password: form.value.password,
      name: form.value.name,
      driverLicenseNumber: form.value.driverLicenseNo,
      driverLevel: form.value.driveType
    })
    
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/driver-login/driver-login' })
    }, 1500)
  } catch (err) {
    uni.showToast({ title: err.message || '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (step.value > 1) {
    step.value--
  } else {
    uni.navigateBack()
  }
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
  display: flex;
  gap: 15px;
}

.btn-next, .btn-prev, .btn-submit {
  flex: 1;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.btn-next, .btn-submit {
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

.btn-next.disabled, .btn-submit.disabled {
  background: #ccc;
  box-shadow: none;
}

.form-tip {
  display: flex;
  align-items: center;
  background: #e6f7ff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
}

.tip-icon {
  font-size: 20px;
  margin-right: 10px;
}

.tip-text {
  font-size: 13px;
  color: #1890ff;
}

.skip-link {
  text-align: center;
  margin-top: 15px;
}

.skip-link text {
  font-size: 14px;
  color: #667eea;
}

.upload-section {
  display: flex;
  gap: 15px;
}

.upload-box {
  flex: 1;
  height: 120px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.picker {
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
}

.picker.placeholder {
  color: #999;
}

@media (min-width: 768px) {
  .form-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 40px 20px;
  }
}
</style>
