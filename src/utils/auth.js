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

export function request(url, options = {}) {
  const token = getToken()
  
  const mockData = {
    '/api/auth/login': {
      access_token: 'mock_token_123456',
      user: {
        id: 1,
        phone: '13812345678',
        name: '车主'
      }
    },
    '/api/user/info': {
      id: 1,
      phone: '13812345678',
      name: '车主'
    },
    '/api/user/update': {
      success: true
    },
    '/api/vehicles': [
      {
        id: 1,
        plateNumber: '京A12345',
        brand: '比亚迪',
        model: '秦PLUS',
        vin: '1HGCM82633A123456',
        color: '白色',
        repairCount: 5,
        lastRepairDate: '2026-02-15',
        needsRepair: false,
        nextMaintenance: {
          days: 15,
          reminderText: '下次保养：更换机油机滤'
        }
      },
      {
        id: 2,
        plateNumber: '沪B67890',
        brand: '特斯拉',
        model: 'Model 3',
        vin: '5YJ3E1EB5MF123456',
        color: '黑色',
        repairCount: 2,
        lastRepairDate: '2026-01-20',
        needsRepair: true,
        nextMaintenance: {
          days: 3,
          reminderText: '下次保养：更换空调滤芯'
        }
      }
    ],
    '/api/ai/diagnose': {
      diagnosis: '根据您描述的症状和上传的照片分析，车辆存在以下问题：\n\n1. 发动机积碳：启动时有异常响声，这是典型的积碳导致的气门异响症状，需要进行发动机清洗。\n\n2. 刹车系统轻微磨损：刹车时有抖动的感觉，可能是刹车盘表面不平或刹车片磨损不均匀，建议检查刹车片厚度。\n\n3. 传感器信号异常：仪表盘亮起故障灯，可能是氧传感器或水温传感器出现故障，需要使用诊断仪读取具体故障码。\n\n4. 燃油系统问题：行驶中动力不足且油耗增加，可能是燃油泵压力不足或喷油嘴堵塞。',
      reasons: [
        '发动机积碳导致气门异响',
        '刹车盘表面不平或刹车片磨损',
        '氧传感器或水温传感器故障',
        '燃油泵压力不足或喷油嘴堵塞'
      ],
      solutions: [
        '到4S店进行发动机清洗服务',
        '检查并更换刹车片，必要时研磨刹车盘',
        '使用诊断仪读取故障码，更换故障传感器',
        '检查燃油泵压力，清洗喷油嘴'
      ],
      priority: 'high',
      timestamp: new Date().toISOString()
    }
  }
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === '/api/auth/login' && options.method === 'POST') {
        resolve(mockData['/api/auth/login'])
      } else if (url === '/api/user/info' && options.method === 'GET') {
        resolve(mockData['/api/user/info'])
      } else if (url === '/api/user/update' && options.method === 'POST') {
        resolve(mockData['/api/user/update'])
      } else if (url === '/api/vehicles' && options.method === 'GET') {
        resolve(mockData['/api/vehicles'])
      } else if (url === '/api/ai/diagnose' && options.method === 'POST') {
        resolve(mockData['/api/ai/diagnose'])
      } else if (url.startsWith('/api/vehicles/') && options.method === 'PUT') {
        resolve({ success: true })
      } else if (url.startsWith('/api/vehicles/') && options.method === 'DELETE') {
        resolve({ success: true })
      } else if (url === '/api/vehicles' && options.method === 'POST') {
        resolve({ success: true })
      } else {
        resolve({})
      }
    }, 500)
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

export function del(url) {
  return request(url, { method: 'DELETE' })
}