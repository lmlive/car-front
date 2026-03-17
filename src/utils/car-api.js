import { get, post, del, put } from './request.js'

export const carAPI = {
  getVehicleList(params) {
    return get('/car/app/vehicle/page', params)
  },
  
  getVehicle(id) {
    return get(`/car/app/vehicle/${id}`)
  },
  
  createVehicle(data) {
    return post('/car/app/vehicle/create', data)
  },
  
  updateVehicle(data) {
    return put('/car/app/vehicle/update', data)
  },
  
  deleteVehicle(id) {
    return del('/car/app/vehicle/delete', { id })
  }
}
