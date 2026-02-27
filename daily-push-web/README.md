# Daily Push - 每日资讯精选

Apple 风格的每日资讯聚合网站，展示 AI 热点、万代/Hot Toys 模玩新品、游戏折扣信息。

> **更新**: 现已整合 Skill 数据生成器，项目可独立部署到任何服务器！

## 特性

- **每日自动更新** - 内置数据生成器，9:30 自动生成当日资讯
- **Apple 风格设计** - 简洁优雅的界面，支持深色模式
- **三大板块** - AI 热点 TOP10、模玩新品、游戏折扣
- **响应式布局** - 完美适配手机、平板、桌面
- **独立部署** - 不依赖外部服务，可部署到任何服务器

## 快速开始

### 安装

```bash
npm install
```

安装时会自动生成本日数据。

### 开发

```bash
npm run dev
```

访问 http://localhost:3000

### 生产部署

```bash
npm run build
npm start
```

## 数据更新

### 手动更新

```bash
# 生成并同步今日数据
npm run skill

# 仅生成数据
npm run skill:generate

# 仅同步已有数据
npm run skill:sync

# 生成指定日期
npx tsx skill/index.ts --date 2026-02-27
```

### 自动更新（定时任务）

```bash
# 设置定时任务
./scripts/setup-cron.sh
```

或手动添加 crontab:

```bash
crontab -e
```

添加：

```
# 每天 9:30 更新数据
30 9 * * * cd /path/to/daily-push-web && npm run skill >> /var/log/daily-push.log 2>&1
```

## 项目结构

```
daily-push-web/
├── app/                    # Next.js 应用
│   ├── api/               # API 路由 (/api/health, /api/daily-data)
│   ├── components/        # 页面组件
│   └── page.tsx           # 首页
├── lib/                    # 数据文件（自动生成）
│   ├── data.ts            # TypeScript 数据
│   ├── daily-data.json    # JSON 数据
│   └── sync-status.json   # 同步状态
├── skill/                  # 数据生成器（自包含）
│   ├── index.ts           # 统一入口
│   ├── generator.ts       # 生成逻辑
│   ├── config.ts          # 配置
│   └── output/            # 生成的数据文件
├── scripts/               # 工具脚本
│   ├── health-check.ts    # 健康检查
│   └── setup-cron.sh      # 定时任务设置
└── package.json
```

## 部署方式

### Docker

```bash
docker build -t daily-push-web .
docker run -p 3000:3000 daily-push-web
```

### PM2

```bash
pm2 start ecosystem.config.js
```

### Vercel

连接 GitHub 仓库即可自动部署。

更多部署方式参见 [DEPLOY.md](./DEPLOY.md)。

## API

- `GET /api/daily-data` - 获取今日数据
- `GET /api/health` - 健康检查

## 健康检查

```bash
# 检查数据状态
npm run health

# 检查并自动修复
npm run health:fix
```

## 技术栈

- **框架**: Next.js 14 + React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **UI**: shadcn/ui
- **图标**: Lucide Icons

## License

MIT
