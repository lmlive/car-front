import { get, post } from './request.js'

export const driverAPI = {
  register(data) {
    return post('/driver/register', data)
  },
  
  login(data) {
    return post('/driver/login', data)
  },
  
  getDriverInfo() {
    return get('/driver/get')
  },
  
  certification(data) {
    return post('/driver/certification', data)
  }
}
