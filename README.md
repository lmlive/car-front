# 智能车诊系统

## 项目结构

```
car-app/
├── server/          # NestJS 后端 API
├── app/             # uni-app 司机端
├── web/             # Vue3 管理后台
├── docker-compose.yml
└── README.md
```

## 快速启动

### 1. 安装依赖

```bash
# 后端
cd server && npm install

# 管理后台
cd web && npm install

# App (需要 HBuilderX 或配置 uni-app 开发环境)
cd app
```

### 2. 配置环境变量

```bash
cd server
cp .env.example .env
# 编辑 .env 填入 OPENAI_API_KEY
```

### 3. 启动服务

#### 开发模式

```bash
# 后端
cd server && npm run start:dev

# 管理后台
cd web && npm run dev
```

#### Docker 部署

```bash
# 需先设置 OPENAI_API_KEY 环境变量
export OPENAI_API_KEY=sk-xxxxx

docker-compose up -d
```

- 管理后台: http://localhost:8080
- 后端API: http://localhost:3000

## 功能说明

### 司机端 (App)
- 用户注册/登录
- 车辆管理（增删改查）
- AI故障诊断

### 管理端 (Web)
- 数据概览
- 用户管理（查看、禁用/启用）
- 车辆管理（查看、添加、删除）

## 技术栈

- 后端: NestJS + TypeORM + PostgreSQL
- App: uni-app + Vue3
- Web: Vue3 + Element Plus
- AI: OpenAI GPT API
