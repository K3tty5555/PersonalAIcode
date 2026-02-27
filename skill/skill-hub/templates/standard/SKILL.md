---
name: my-skill
description: >-
  在这里用一句话描述你的 Skill 能做什么。
  第三人称，说明方法和最终产出。
argument-hint: "[参数说明]"
allowed-tools: Read Write Edit Bash(ls) Bash(mkdir)
---

# {Skill 名称}

## 概述

{用 2-3 句话说明这个 Skill 的角色和目标。
告诉 AI "你是谁"以及"你的目标是什么"。}

## 执行流程

### Step 1: 解析输入

解析 `$ARGUMENTS`：
- **文件路径** → 读取文件内容
- **文本内容** → 直接使用
- **为空** → 提示用户输入

### Step 2: {核心处理}

{描述 Skill 的主要工作流程。
如果逻辑复杂，可以拆到 references/ 子目录：
详细流程见 [detail.md](references/detail.md)}

### Step 3: {加工/优化}

{可选：对结果做进一步加工}

### Step 4: 输出结果

输出格式：{Markdown 表格 / 分段叙述 / Checklist / 混合}

保存到 `{输出目录}/{文件名}.md`。

## 边缘情况

| 场景 | 处理 |
|------|------|
| 输入为空 | 提示用户输入 |
| 内容太少 | {你的处理方式} |
| 内容太多 | {你的处理方式} |

## Anti-Pattern

- 不要 {列出 AI 不应该做的事情}
- 不要 {避免的行为}
