# 健康生活系统

基于 Next.js + Supabase + Tailwind CSS 的全栈健康追踪应用。

## 功能

- **目标管理**：创建长期和短期目标，追踪完成进度
- **日程安排**：规划饮食、运动、睡眠等日常活动
- **饮食记录**：记录每餐食物，自动计算热量，支持搜索食物库
- **每日建议**：随机获取健康、饮食、运动、睡眠等方面的生活建议

## 技术栈

- **框架**：Next.js 14 (App Router)
- **数据库**：Supabase (PostgreSQL + 行级安全)
- **样式**：Tailwind CSS
- **图标**：Lucide React
- **日期**：date-fns

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 创建新项目
2. 在 SQL Editor 中执行 `supabase/migrations/001_init.sql` 的迁移脚本
3. 复制项目 URL 和 Anon Key

### 2. 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 Supabase 信息

# 启动开发服务器
npm run dev
```

### 3. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

或在 Vercel Dashboard 中：
1. 导入 GitHub 仓库
2. 设置环境变量 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. 部署

## 项目结构

```
app/
  page.tsx          # 仪表盘主页
  goals/page.tsx    # 目标管理
  schedule/page.tsx # 日程安排
  diet/page.tsx     # 饮食记录
  tips/page.tsx     # 每日建议
components/         # 共享组件
lib/
  supabase.ts       # Supabase 客户端
types/
  index.ts          # 应用类型
  database.ts       # Supabase 数据库类型
supabase/migrations/# 数据库迁移
```
