import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default {
  getStats: () => request.get('/admin/stats'),
  getUsers: () => request.get('/admin/users'),
  disableUser: (id) => request.post(`/admin/users/${id}/disable`),
  enableUser: (id) => request.post(`/admin/users/${id}/enable`),
  getVehicles: () => request.get('/admin/vehicles'),
  createVehicle: (data) => request.post('/admin/vehicles', data),
  deleteVehicle: (id) => request.delete(`/admin/vehicles/${id}`),
}
