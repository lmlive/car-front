const TOKEN_KEY = 'car_app_token'
const USER_KEY = 'car_app_user'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY)
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

export function getUser() {
  const user = uni.getStorageSync(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setUser(user) {
  uni.setStorageSync(USER_KEY, JSON.stringify(user))
}

// 品牌名到ID的映射（用于原型演示，实际部署时应从API获取）
const BRAND_NAME_TO_ID = {
  '比亚迪': 1,
  '特斯拉': 2,
  '理想': 3,
  '小鹏': 4,
  '蔚来': 5,
  '吉利': 6,
  '长城': 7,
  '长安': 8,
  '奇瑞': 9,
  '其他': 10
}

// 模型名到ID的映射（用于原型演示，实际部署时应从API获取）
const MODEL_NAME_TO_ID = {
  '秦PLUS': 1,
  '汉EV': 2,
  'Model 3': 3,
  'Model Y': 4,
  '理想ONE': 5,
  '理想L9': 6,
  '小鹏P7': 7,
  '小鹏P5': 8,
  '蔚来ES6': 9,
  '蔚来ET5': 10
}

// 将前端字段名转换为后端字段名
function convertToFrontendFields(vehicle) {
  if (!vehicle) return vehicle
  return {
    id: vehicle.id,
    userId: vehicle.userId,
    plateNumber: vehicle.licensePlate,  // 后端字段: licensePlate -> 前端字段: plateNumber
    brand: vehicle.brandName || vehicle.brand,  // 后端可能返回brandName或brand
    model: vehicle.modelName || vehicle.model,  // 后端可能返回modelName或model
    vin: vehicle.vinCode,  // 后端字段: vinCode -> 前端字段: vin
    color: vehicle.color,
    mileage: vehicle.mileage,
    registerDate: vehicle.purchaseDate,  // 后端字段: purchaseDate -> 前端字段: registerDate
    nextInspectDate: vehicle.nextMaintenanceDate,  // 后端字段: nextMaintenanceDate -> 前端字段: nextInspectDate
    insuranceCompany: vehicle.insuranceCompany,
    insuranceDate: vehicle.insuranceExpiryDate,  // 后端字段: insuranceExpiryDate -> 前端字段: insuranceDate
    commercialInsuranceDate: vehicle.commercialInsuranceDate,
    maintenanceInterval: vehicle.maintenanceInterval,
    nextMaintenanceMileage: vehicle.nextMaintenanceMileage,
    nextMaintenanceDate: vehicle.nextMaintenanceDate,
    licenseFront: vehicle.licenseFront,
    licenseBack: vehicle.licenseBack,
    status: vehicle.status,
    createTime: vehicle.create_time || vehicle.createTime
  }
}

// 将后端字段名转换为前端字段名
function convertToBackendFields(vehicle) {
  if (!vehicle) return vehicle
  return {
    id: vehicle.id,
    userId: vehicle.userId,
    licensePlate: vehicle.plateNumber,  // 前端字段: plateNumber -> 后端字段: licensePlate
    brandId: typeof vehicle.brand === 'string' ? BRAND_NAME_TO_ID[vehicle.brand] || 1 : vehicle.brand,  // 映射品牌名到ID
    modelId: typeof vehicle.model === 'string' ? MODEL_NAME_TO_ID[vehicle.model] || 1 : vehicle.model,  // 映射模型名到ID
    vinCode: vehicle.vin,  // 前端字段: vin -> 后端字段: vinCode
    color: vehicle.color,
    mileage: vehicle.mileage,
    purchaseDate: vehicle.registerDate,  // 前端字段: registerDate -> 后端字段: purchaseDate
    nextMaintenanceDate: vehicle.nextInspectDate,  // 前端字段: nextInspectDate -> 后端字段: nextMaintenanceDate
    insuranceCompany: vehicle.insuranceCompany,
    insuranceExpiryDate: vehicle.insuranceDate,  // 前端字段: insuranceDate -> 后端字段: insuranceExpiryDate
    commercialInsuranceDate: vehicle.commercialInsuranceDate,
    maintenanceInterval: vehicle.maintenanceInterval,
    nextMaintenanceMileage: vehicle.nextMaintenanceMileage,
    images: vehicle.photos ? JSON.stringify(vehicle.photos) : null,  // 前端字段: photos -> 后端字段: images
    engineModel: vehicle.engineModel,
    displacement: vehicle.displacement,
    maxPower: vehicle.maxPower,
    maxTorque: vehicle.maxTorque,
    transmission: vehicle.transmission,
    driveMode: vehicle.driveMode,
    fuelType: vehicle.fuelType,
    seatCount: vehicle.seats,  // 前端字段: seats -> 后端字段: seatCount
    year: vehicle.year,
    purchaseAmount: vehicle.purchasePrice  // 前端字段: purchasePrice -> 后端字段: purchaseAmount
  }
}

export function request(url, options = {}) {
  const token = getToken()
  
  // 检查是否为公共API（不需要登录）
  const isPublicAPI = url.startsWith('/auth/') || url.startsWith('/driver/') || url === '/login' || url === '/register'
  
  // 如果不是公共API并且没有token，返回错误
  if (!isPublicAPI && !token) {
    console.error('未登录，无法访问此API:', url)
    uni.reLaunch({ url: '/pages/login/login' })
    return Promise.reject(new Error('未登录'))
  }
  
  console.log('发起请求:', url, options)
  
  // 将相对路径转换为完整路径
  const apiUrl = url.startsWith('/') ? url : '/' + url
  
  // 构建请求配置
  const config = {
    url: 'http://localhost:48080' + apiUrl,  // 后端服务地址
    method: options.method || 'GET',
    header: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }
  
  // 根据不同方法添加数据
  if (options.method === 'POST' || options.method === 'PUT') {
    // 对于车辆相关的POST/PUT请求，转换字段名
    if (url.includes('/vehicle')) {
      config.data = convertToBackendFields(options.data)
    } else {
      config.data = options.data
    }
  } else if (options.method === 'GET' && options.data) {
    // 添加查询参数
    const queryString = Object.keys(options.data)
      .filter(key => options.data[key] !== undefined && options.data[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options.data[key])}`)
      .join('&')
    if (queryString) {
      config.url += (apiUrl.includes('?') ? '&' : '?') + queryString
    }
  } else if (options.method === 'DELETE' && options.data) {
    // 为DELETE请求添加查询参数
    const queryString = Object.keys(options.data)
      .filter(key => options.data[key] !== undefined && options.data[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options.data[key])}`)
      .join('&')
    if (queryString) {
      config.url += (apiUrl.includes('?') ? '&' : '?') + queryString
    }
  }
  
  console.log('发送请求到:', config.url, '方法:', config.method, '数据:', config.data)
  
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (res) => {
        console.log('请求响应:', res)
        // 检查是否为401未授权错误
        if (res.statusCode === 401) {
          console.error('登录已过期，请重新登录')
          // 使用setTimeout确保在当前回调完成后执行跳转
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/login' })
          }, 0)
          reject(new Error('登录已过期'))
          return
        }
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          let responseData = res.data
          
          // 如果是车辆相关的响应，转换字段名
          if (url.includes('/vehicle') && responseData && responseData.data) {
            if (Array.isArray(responseData.data)) {
              // 如果是数组（如列表）
              responseData.data = responseData.data.map(convertToFrontendFields)
            } else if (typeof responseData.data === 'object') {
              // 如果是单个对象
              responseData.data = convertToFrontendFields(responseData.data)
            }
          }
          
          resolve(responseData)
        } else {
          console.error('请求失败:', res.statusCode, res.data)
          // 如果是401错误，即使不在200-300范围内也要特殊处理
          if (res.statusCode === 401) {
            console.error('登录已过期，请重新登录')
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
            }, 0)
            reject(new Error('登录已过期'))
          } else {
            reject(new Error(`请求失败: ${res.statusCode} ${res.errMsg || res.data?.message || '未知错误'}`))
          }
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        // 检查网络错误或其他连接问题
        if (err.errMsg && err.errMsg.includes('request:fail')) {
          // 尝试重新检查登录状态，因为可能是在后台太久token过期了
          const currentToken = getToken()
          if (currentToken) {
            // 如果有token但请求失败，可能是token过期
            console.warn('请求失败，可能token已过期')
            // 尝试跳转到登录页
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
            }, 0)
          }
        }
        reject(err)
      }
    })
  })
}

export function get(url, params) {
  return request(url, { method: 'GET', data: params })
}

export function post(url, data) {
  return request(url, { method: 'POST', data })
}

export function put(url, data) {
  return request(url, { method: 'PUT', data })
}

export function del(url, params) {
  return request(url, { method: 'DELETE', data: params })
}

// 专门用于车辆相关操作的函数（自动处理字段转换）
export function getVehicleList() {
  return get('/car/app/vehicle/list')
}

export function getVehicle(id) {
  return get('/car/app/vehicle/get', { id })
}

export function createVehicle(vehicle) {
  return post('/car/app/vehicle/create', vehicle)
}

export function updateVehicle(vehicle) {
  return put('/car/app/vehicle/update', vehicle)
}

export function deleteVehicle(id) {
  return del('/car/app/vehicle/delete', { id })
}

// 全局登录检查函数
export function checkLoginAndRedirect() {
  const hasToken = !!getToken()
  if (!hasToken) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  return true
}