<template>
  <div class="users">
    <h2 class="page-title">用户管理</h2>
    <el-card>
      <el-table :data="users" border stripe v-loading="loading">
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="100">
          <template #default="{ row }">
            {{ row.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="160">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'active'" 
              type="danger" 
              size="small"
              @click="handleDisable(row.id)"
            >禁用</el-button>
            <el-button 
              v-else 
              type="success" 
              size="small"
              @click="handleEnable(row.id)"
            >启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'

const users = ref([])
const loading = ref(false)

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
}

const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await api.getUsers()
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleDisable = async (id) => {
  await api.disableUser(id)
  ElMessage.success('已禁用')
  loadUsers()
}

const handleEnable = async (id) => {
  await api.enableUser(id)
  ElMessage.success('已启用')
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users {
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

.el-card {
  border-radius: 12px;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}
</style>
