<template>
  <div class="vehicles">
    <div class="header">
      <h2 class="page-title">车辆管理</h2>
      <el-button type="primary" @click="showAdd = true">
        <el-icon><Plus /></el-icon>
        添加车辆
      </el-button>
    </div>
    
    <el-card>
      <el-table :data="vehicles" border stripe v-loading="loading">
        <el-table-column prop="plateNumber" label="车牌号" min-width="120">
          <template #default="{ row }">
            <el-tag type="primary" effect="dark">{{ row.plateNumber }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" min-width="100" />
        <el-table-column prop="model" label="车型" min-width="100" />
        <el-table-column prop="vin" label="车架号" min-width="160">
          <template #default="{ row }">
            <span class="vin-text">{{ row.vin || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.phone" label="车主" min-width="120">
          <template #default="{ row }">
            {{ row.user?.phone || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="录入时间" min-width="160">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showAdd" title="添加车辆" width="500px" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px" class="vehicle-form">
        <el-form-item label="车主ID" required>
          <el-input v-model="form.userId" placeholder="用户ID" />
        </el-form-item>
        <el-form-item label="车牌号" required>
          <el-input v-model="form.plateNumber" placeholder="如：粤B12345" />
        </el-form-item>
        <el-form-item label="品牌" required>
          <el-input v-model="form.brand" placeholder="如：比亚迪" />
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="form.model" placeholder="如：秦PLUS" />
        </el-form-item>
        <el-form-item label="车架号">
          <el-input v-model="form.vin" placeholder="17位车架号" maxlength="17" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-input v-model="form.color" placeholder="如：白色" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="handleAdd" :loading="adding">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '../api'

const vehicles = ref([])
const loading = ref(false)
const showAdd = ref(false)
const adding = ref(false)
const form = ref({ userId: '', plateNumber: '', brand: '', model: '', vin: '', color: '' })

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
}

const loadVehicles = async () => {
  loading.value = true
  try {
    vehicles.value = await api.getVehicles()
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = async () => {
  if (!form.value.userId || !form.value.plateNumber || !form.value.brand) {
    ElMessage.warning('请填写必填项')
    return
  }
  adding.value = true
  try {
    await api.createVehicle(form.value)
    ElMessage.success('添加成功')
    showAdd.value = false
    loadVehicles()
    form.value = { userId: '', plateNumber: '', brand: '', model: '', vin: '', color: '' }
  } catch (e) {
    ElMessage.error('添加失败')
  } finally {
    adding.value = false
  }
}

const handleDelete = async (id) => {
  await api.deleteVehicle(id)
  ElMessage.success('删除成功')
  loadVehicles()
}

onMounted(() => {
  loadVehicles()
})
</script>

<style scoped>
.vehicles {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  color: #333;
  font-weight: 600;
}

.el-card {
  border-radius: 12px;
}

.vin-text {
  font-family: monospace;
  color: #666;
}

.vehicle-form {
  padding: 10px 0;
}
</style>
