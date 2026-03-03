import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/Users.vue'
import Vehicles from '../views/Vehicles.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/users', component: Users },
  { path: '/vehicles', component: Vehicles },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
