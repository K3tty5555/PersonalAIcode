# Daily Push Web - 部署指南

本项目是自包含的，可以在任何支持 Node.js 的服务器上部署。

## 项目结构

```
daily-push-web/
├── app/                    # Next.js 应用代码
├── lib/                    # 数据文件（自动生成）
│   ├── data.ts            # TypeScript 数据
│   ├── daily-data.json    # JSON 数据
│   └── sync-status.json   # 同步状态
├── skill/                  # Skill 数据生成器
│   ├── index.ts           # 统一入口
│   ├── generator.ts       # 数据生成逻辑
│   ├── config.ts          # 配置
│   └── output/            # 生成的数据文件
├── scripts/               # 工具脚本
└── package.json
```

## 快速部署

### 1. 克隆代码

```bash
git clone <your-repo-url>
cd daily-push-web
```

### 2. 安装依赖

```bash
npm install
```

安装时会自动运行 `npm run skill` 生成初始数据。

### 3. 构建

```bash
npm run build
```

### 4. 启动服务

```bash
npm start
```

默认运行在 http://localhost:3000

## 定时更新数据

### 使用 crontab（推荐）

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每天 9:30 更新数据）
30 9 * * * cd /path/to/daily-push-web && npm run skill >> /var/log/daily-push.log 2>&1

# 或者使用提供的脚本
./scripts/setup-cron.sh
```

### 使用 systemd（Linux 服务器）

创建服务文件 `/etc/systemd/system/daily-push-update.service`:

```ini
[Unit]
Description=Daily Push Data Update
After=network.target

[Service]
Type=oneshot
WorkingDirectory=/path/to/daily-push-web
ExecStart=/usr/bin/npm run skill
User=www-data
```

创建定时器 `/etc/systemd/system/daily-push-update.timer`:

```ini
[Unit]
Description=Run Daily Push Update daily at 9:30

[Timer]
OnCalendar=*-*-* 9:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

启用定时器:

```bash
sudo systemctl daemon-reload
sudo systemctl enable daily-push-update.timer
sudo systemctl start daily-push-update.timer
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | 3000 |
| `NODE_ENV` | 环境模式 | production |

## Docker 部署

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3'
services:
  daily-push:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./skill/output:/app/skill/output
      - ./lib:/app/lib
    restart: unless-stopped
```

### 定时更新（Docker）

在宿主机上添加 crontab:

```bash
30 9 * * * docker compose exec daily-push npm run skill
```

## 手动更新数据

```bash
# 生成并同步今日数据
npm run skill

# 仅生成数据（不同步）
npm run skill:generate

# 仅同步已有数据
npm run skill:sync

# 生成指定日期数据
npx tsx skill/index.ts --date 2026-02-27
```

## 健康检查

```bash
# 检查数据状态
npm run health

# 检查并自动修复
npm run health:fix
```

API 端点:
- `GET /api/health` - 健康检查
- `GET /api/daily-data` - 获取数据

## 使用 Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 构建命令: `npm run build`
3. 输出目录: 保持默认
4. 添加环境变量（如有需要）

**注意**: Vercel 的无服务器环境不支持文件写入，建议:
- 在本地生成数据后提交到仓库
- 或使用外部数据存储（如 Redis/Database）

## 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 创建配置文件 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'daily-push-web',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

# 启动
pm2 start ecosystem.config.js

# 保存配置
pm2 save
pm2 startup
```

## 常见问题

### Q: 数据没有自动更新？

A: 检查以下几点:
1. 定时任务是否正确配置: `crontab -l`
2. 脚本是否有执行权限: `ls -la scripts/`
3. 查看日志: `tail -f /var/log/daily-push.log`

### Q: 如何修改更新时间？

A: 编辑 crontab 或 systemd timer，修改时间配置。

### Q: 如何备份数据？

A: 备份以下文件:
- `skill/output/*.json` - 历史数据
- `lib/data.ts` - 当前数据
- `lib/daily-data.json` - JSON 数据

### Q: 如何在开发环境测试？

A:
```bash
npm run dev        # 启动开发服务器
npm run skill      # 生成数据（在另一个终端）
```

## 更新日志

- **2026-02-27**: 整合 skill 到项目内部，支持独立部署
