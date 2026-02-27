# Daily Push Web - 数据同步机制

本文档说明 daily-push-web 与 skill 之间的数据同步机制。

## 问题背景

**原有问题：**
- daily-push-web 在 00:00 自动生成数据（基于模板）
- skill 在 9:00 生成真实数据
- 导致 0:00-9:00 期间网站显示的是模板数据而非真实数据

**解决方案：**
1. 移除 00:00 的自动生成
2. 改为 9:00+ 从 skill 获取真实数据
3. 添加兜底机制处理 skill 生成延迟的情况

## 数据流向

```
┌─────────────────────────────────────────────────────────────┐
│                         Skill 端                             │
│  9:00 执行三轮推送                                          │
│       ↓                                                      │
│  生成 output/daily-push-YYYY-MM-DD.json                     │
│       ↓                                                      │
│  运行 save-to-website.ts → 同步到 daily-push-web/lib/data.ts │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      daily-push-web 端                       │
│  1. 静态数据: lib/data.ts (编译时嵌入)                       │
│  2. 动态数据: lib/daily-data.json (运行时读取)               │
│  3. API 端点: /api/daily-data, /api/health                   │
└─────────────────────────────────────────────────────────────┘
```

## 定时任务配置

### Skill 端（9:00 执行）

```yaml
# skill 定时任务配置
job_id: 7d71919d-15fe-46b3-a5da-71c9a335df7b
name: 每日三轮推送
schedule: "0 9 * * *"
timezone: Asia/Shanghai
timeout: 900s
```

### Web 端（9:30/10:00 执行）

```bash
# 添加到 crontab (crontab -e)

# 9:30 首次同步（等待 skill 执行完成）
30 9 * * * cd /path/to/daily-push-web && npm run sync

# 10:00 第二次同步（兜底）
0 10 * * * cd /path/to/daily-push-web && npm run sync

# 每 15 分钟健康检查
*/15 * * * * cd /path/to/daily-push-web && npm run health:fix
```

或使用提供的脚本：
```bash
./scripts/setup-cron.sh
```

## 可用命令

### 数据同步

```bash
# 从 skill 同步数据（带兜底机制）
npm run sync

# 强制重试同步（忽略已有状态）
npm run sync:retry

# 生成静态数据（旧方案，不推荐）
npm run data:generate
```

### 健康检查

```bash
# 检查数据状态
npm run health

# 检查并自动修复
npm run health:fix
```

## 兜底机制

### 1. 自动重试

```typescript
// scripts/sync-from-skill.ts
const CONFIG = {
  maxRetries: 3,              // 最多重试 3 次
  retryInterval: 5 * 60000,   // 每 5 分钟重试一次
}
```

### 2. 历史数据兜底

如果今日数据不存在，自动使用：
1. 昨日数据
2. 最近 7 天内的数据

### 3. 健康检查自动修复

每 15 分钟检查一次，如果数据过期则自动触发同步。

### 4. API 动态刷新

- `GET /api/daily-data` - 获取最新数据（优先 JSON，回退静态）
- `GET /api/health` - 健康检查
- `POST /api/daily-data` - 触发同步

## 数据结构

### JSON 数据文件 (lib/daily-data.json)

```json
{
  "date": "2026-02-27",
  "keywords": ["AI", "大模型", "..."],
  "news": [...],
  "bandai": [...],
  "hotToys": [...],
  "steam": [...],
  "playstation": [...],
  "nintendo": {...},
  "generatedAt": "2026-02-27T09:30:00.000Z"
}
```

### 同步状态 (lib/sync-status.json)

```json
{
  "success": true,
  "date": "2026-02-27",
  "source": "today",
  "isFresh": true,
  "timestamp": "2026-02-27T09:30:00.000Z"
}
```

## 故障排查

### 数据未更新

```bash
# 1. 检查健康状态
npm run health

# 2. 手动触发同步
npm run sync

# 3. 检查 skill 数据是否存在
ls -la ../skill/skill-hub/.claude/skills/daily-push-suite/output/
```

### 网站显示旧数据

```bash
# 1. 检查静态数据日期
grep "generatedAt" lib/data.ts

# 2. 检查 JSON 数据
cat lib/daily-data.json | grep date

# 3. 强制刷新
npm run sync:retry
```

### 定时任务未执行

```bash
# 查看 cron 日志
tail -f /var/log/syslog | grep CRON

# 手动测试命令
cd /path/to/daily-push-web && npm run sync
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `scripts/sync-from-skill.ts` | 主同步脚本，带兜底机制 |
| `scripts/health-check.ts` | 健康检查脚本 |
| `scripts/setup-cron.sh` | 定时任务配置脚本 |
| `lib/daily-data.json` | 动态数据文件 |
| `lib/sync-status.json` | 同步状态记录 |
| `app/api/daily-data/route.ts` | API 端点 |
| `app/api/health/route.ts` | 健康检查 API |

## 注意事项

1. **时间协调**: Skill 9:00 执行，Web 端 9:30/10:00 同步，留出足够缓冲时间
2. **路径配置**: 确保 `sync-from-skill.ts` 中的 `skillOutputDir` 指向正确的 skill 输出目录
3. **权限**: 确保定时任务运行用户有权限访问两个项目目录
4. **日志**: 定期检查 `logs/` 目录下的同步和健康检查日志
