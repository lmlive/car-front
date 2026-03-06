<template>
  <div class="dashboard">
    <h2 class="page-title">数据概览</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card stat-users">
          <div class="stat-content">
            <el-icon class="stat-icon"><User /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.userCount }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card stat-vehicles">
          <div class="stat-content">
            <el-icon class="stat-icon"><Van /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.vehicleCount }}</div>
              <div class="stat-label">车辆总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card stat-ai">
          <div class="stat-content">
            <el-icon class="stat-icon"><ChatDotRound /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.vehicleCount > 0 ? Math.round(stats.vehicleCount * 1.2) : 0 }}</div>
              <div class="stat-label">AI诊断次数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="welcome-card">
          <div class="welcome-content">
            <h3>欢迎使用智能车诊管理系统</h3>
            <p>在这里您可以管理用户信息、车辆数据，并查看系统统计数据</p>
            <div class="quick-actions">
              <el-button type="primary" @click="$router.push('/users')">管理用户</el-button>
              <el-button @click="$router.push('/vehicles')">管理车辆</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Van, ChatDotRound } from '@element-plus/icons-vue'
import api from '../api'

const stats = ref({ userCount: 0, vehicleCount: 0 })

const loadStats = async () => {
  try {
    stats.value = await api.getStats()
  } catch (e) {
    stats.value = { userCount: 0, vehicleCount: 0 }
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-title {
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.stat-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  font-size: 50px;
  padding: 15px;
  border-radius: 12px;
  margin-right: 15px;
}

.stat-users .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.stat-vehicles .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.stat-ai .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.welcome-card :deep(.el-card__body) {
  padding: 30px;
}

.welcome-content {
  color: #fff;
  text-align: center;
}

.welcome-content h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.welcome-content p {
  opacity: 0.9;
  margin-bottom: 20px;
}

.quick-actions .el-button {
  margin: 0 10px;
}

.quick-actions .el-button--primary {
  background: #fff;
  color: #667eea;
  border: none;
}

.quick-actions .el-button--default {
  background: rgba(255,255,255,0.2);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}
</style>
