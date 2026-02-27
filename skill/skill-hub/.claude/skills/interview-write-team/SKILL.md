---
name: interview-write-team
description: >-
  多 Agent 协作写作团队。深度访谈 → 双写手对抗写作（悬念派 vs 洞察派）→
  6维度评审 → Team Lead 综合终稿。支持素材文件跳过访谈直接写作。
argument-hint: "[主题或文件路径]"
disable-model-invocation: true
allowed-tools: Read Write Edit Bash(ls) Bash(mkdir)
---

# 访谈式写作团队

## 静默执行协议

- 不询问"是否继续"，直接执行下一步
- 数据缺失时使用默认值或主动追问
- 团队创建、队友生成、任务分配全部自动执行
- 唯一需要用户交互的环节是访谈阶段
- 文件写入时不弹确认，直接保存

## 概述

你是写作团队的总指挥（Team Lead）。协调 4 个 Agent 通过对抗式协作产出高质量公众号文章。

```
Phase 1: 访谈       Phase 2: 对抗写作        Phase 3: 评审       Phase 4: 综合
┌─────────────┐    ┌───────────────────┐    ┌─────────────┐    ┌─────────────┐
│ Interviewer │───▶│ Writer A (悬念派) │───▶│             │    │             │
│ (深度访谈)  │    │ Writer B (洞察派) │───▶│   Critic    │───▶│  Team Lead  │
│             │    │ (并行写作)        │    │ (对比评审)  │    │ (综合终稿)  │
└─────────────┘    └───────────────────┘    └─────────────┘    └─────────────┘
```

## 执行流程

### Step 1: 创建团队

解析 `$ARGUMENTS`，提取主题或文件路径。创建 Agent Team `writing-team`，确保 `./writing/drafts/` 存在。

任务列表：

| 任务 | 分配给 | 依赖 |
|------|--------|------|
| 深度访谈，提取故事素材 | Interviewer | 无 |
| 悬念/冲突风格写作 | Writer A | 访谈完成 |
| 洞察/思辨风格写作 | Writer B | 访谈完成 |
| 对比评审两篇草稿 | Critic | 两篇草稿完成 |
| 综合终稿 | Team Lead | 评审完成 |

### Step 2: 访谈阶段

生成 Interviewer 队友，使用 [interviewer.md](references/interviewer.md) 中的 prompt。将 `{topic}` 替换为 `$ARGUMENTS`。

提示用户：可用 Shift+Down 切换到 Interviewer 会话，完成后 Shift+Up 返回。

等待 Interviewer 标记任务完成。

### Step 3: 并行写作阶段

访谈完成后，**同时**生成两个队友：
- **Writer A（悬念派）**：使用 [writer-a.md](references/writer-a.md) 中的 prompt
- **Writer B（洞察派）**：使用 [writer-b.md](references/writer-b.md) 中的 prompt

等待两位 Writer 都标记任务完成。

### Step 4: 评审阶段

生成 Critic 队友，使用 [critic.md](references/critic.md) 中的 prompt。

等待 Critic 标记任务完成。

### Step 5: 综合终稿

Team Lead 自己执行：

1. **读取所有中间产物**：
   - `./writing/drafts/interview-notes.md`
   - `./writing/drafts/draft-a-suspense.md`
   - `./writing/drafts/draft-b-insight.md`
   - `./writing/drafts/critic-review.md`

2. **读取风格参考**：`./writing/examples/` 所有 `.md` 文件

3. **综合写作**：以 Critic 推荐底稿为基础，合并优秀元素，应用改进建议

4. **写作规范**：详见 [style-guide.md](../interview-write/references/style-guide.md)

5. **保存终稿**：文件名 `YYYY-MM-DD-标题.md`，保存到 `./writing/output/`，添加日期时间行

6. **终端展示**：在终端展示协作过程摘要 + 终稿全文

   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 协作过程
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✍️ Writer A（悬念派）：{摘录亮点}
   ✍️ Writer B（洞察派）：{摘录亮点}
   🔍 Critic 推荐：{推荐底稿和理由}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📄 终稿
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   {终稿全文}

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📁 已保存到：writing/output/{文件名}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

7. **清理团队**：关闭所有队友，清理资源

## 边缘情况

| 场景 | 处理 |
|------|------|
| 给了文件而非主题 | 跳过访谈，直接进入并行写作 |
| 给了主题+文件 | 读取文件后仍进行补充访谈 |
| 队友超时/停止 | 向用户报告，重新生成该队友 |
| 两篇草稿风格太相似 | Critic 指出，Lead 综合时加大差异 |
| 访谈素材太少 | Writer 补充合理推断，标注推断部分 |

## Anti-Pattern

- Team Lead 不要自己写文章——必须等队友的草稿
- 不要跳过 Critic 评审
- 不要让两个 Writer 看到对方的草稿
- 不要在访谈阶段催促用户
- 不要生成超过 1000 字符的终稿
