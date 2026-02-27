# Skill 与网站数据同步指南

## 工作流程

```
00:00 ─────▶ 网站自动生成数据（基于模板）
09:00 ─────▶ skill 执行三轮推送（AI/玩具/游戏）
09:05 ─────▶ 运行同步脚本，更新网站数据
09:10 ─────▶ 重新构建网站
```

## 同步方法

### 方法1：skill 推送后手动同步（推荐）

在 skill 完成三轮推送后，复制推送文本，然后运行：

```bash
cd daily-push-web

# 将 skill 推送的完整文本传入脚本
npx tsx scripts/update-from-skill.ts "📰 2月27日 AI热点 TOP10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1️⃣ 中国AI调用量首超美国...**
🏷️ 大模型、API调用
💬 OpenRouter数据显示...

..."

# 重新构建网站
npm run build
```

### 方法2：通过环境变量传入

```bash
export SKILL_PUSH_TEXT="📰 2月27日 AI热点 TOP10..."
npx tsx scripts/update-from-skill.ts
npm run build
```

### 方法3：使用管道

```bash
cat push-text.txt | xargs -I {} npx tsx scripts/update-from-skill.ts "{}"
npm run build
```

## 数据解析规则

脚本会自动解析 skill 推送的以下格式：

### AI 热点
```
**1️⃣ 标题**
🏷️ 关键词1、关键词2
💬 亮点描述
```

### 万代商品
```
• **商品名** | 系列 | 约XXX元 | 发售日期
• **RG 1/144 海牛高达** | 逆袭的夏亚 | 约420元 | 3月15日
```

### Hot Toys
```
• **商品名** | 系列 | 约X,XXX港币 | 日期
• **Mark 43 2.0 钢铁侠** | 复仇者联盟2 | 约2,680港币 | 2026年Q2
```

## 同步后验证

运行以下命令验证数据是否正确更新：

```bash
# 检查 lib/data.ts 文件
grep -A 5 "Mark 43" lib/data.ts

# 构建网站
npm run build

# 本地预览
python3 -m http.server 3000 --directory dist
```

## 注意事项

1. **推送文本完整性**：确保传入完整的推送内容，包括所有三个板块
2. **格式一致性**：保持 skill 的标准输出格式
3. **汇率自动计算**：脚本会自动计算人民币价格
4. **游戏折扣**：当前版本暂不解析游戏折扣，使用固定数据

## 自动化方案（高级）

如果需要完全自动化，可以在 skill 任务最后添加：

```typescript
// 在 skill 执行完成后
const pushText = /* 获取完整推送文本 */;
require('./scripts/save-to-website').saveToWebsite(pushText);
```

或者配置 GitHub Actions 监听特定事件触发重建。

## 故障排查

| 问题 | 解决 |
|------|------|
| 解析失败 | 检查推送文本格式是否完整 |
| 商品数量不对 | 确认 `• **商品** | 系列 | 价格 | 日期` 格式正确 |
| 价格显示错误 | 确保价格包含 "元" 或 "港币" 单位 |
| 构建失败 | 检查 TypeScript 类型是否匹配 |

## 更新记录

- 2026-02-27: 初始版本，支持解析 skill 推送文本
