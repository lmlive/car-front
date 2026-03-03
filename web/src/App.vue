<template>
  <el-container class="layout">
    <el-aside width="220px">
      <div class="logo">
        <span class="logo-icon">🚗</span>
        <span class="logo-text">智能车诊</span>
      </div>
      <el-menu :default-active="$route.path" router class="menu">
        <el-menu-item index="/">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/vehicles">
          <el-icon><Van /></el-icon>
          <span>车辆管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-right">
          <span class="header-title">管理员后台</span>
          <el-button type="primary" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { DataAnalysis, User, Van } from '@element-plus/icons-vue'

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  location.href = '/login'
}
</script>

<style>
* { margin: 0; padding: 0; }
html, body, #app { height: 100%; }
.layout { height: 100%; }

.el-aside {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.logo {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu {
  border: none;
  background: transparent !important;
}

.menu .el-menu-item {
  color: rgba(255,255,255,0.7);
  margin: 5px 10px;
  border-radius: 8px;
}

.menu .el-menu-item:hover {
  background: rgba(255,255,255,0.1) !important;
  color: #fff;
}

.menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.el-header {
  background: #fff;
  line-height: 60px;
  padding: 0 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.el-main {
  background: #f5f7fa;
  padding: 20px;
}

.el-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: none;
}
</style>
