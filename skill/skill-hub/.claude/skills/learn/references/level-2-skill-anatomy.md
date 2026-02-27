# 第2关：理解 Skill 结构

## 目标

让用户理解 SKILL.md 的结构和各部分作用，为后面创建自己的 Skill 打基础。

## 教学流程

### 1. 打开一个真实的 Skill

> 我们来看一个真实的 Skill 是怎么写的。

读取 `.claude/skills/interview-write/SKILL.md` 并展示给用户。

### 2. 逐块讲解

#### Frontmatter（YAML 头部）

```yaml
---
name: interview-write
description: >-
  通过凯文·凯利式深度访谈挖掘用户故事...
argument-hint: "[主题或文件路径]"
allowed-tools: Read Write Edit Bash(ls) Bash(mkdir)
---
```

讲解每个字段：

- **name** — Skill 的唯一标识，用户通过 `/name` 来调用。必须是小写字母加连字符。
- **description** — 对这个 Skill 的说明。Claude Code 用它来理解这个 Skill 是干什么的。
- **argument-hint** — 提示用户可以传什么参数。比如 `/interview-write 我的创业故事`。
- **allowed-tools** — 这个 Skill 被允许使用哪些工具。相当于给 Skill 设置权限。

#### 正文流程

> Frontmatter 之后就是正文，告诉 Claude 具体怎么做。

指出正文的关键部分：
- **概述** — 一句话说清这个 Skill 的角色定位
- **执行流程** — 分阶段描述 Skill 的工作步骤（Phase 1, 2, 3...）
- **边缘情况** — 处理各种特殊情况
- **Anti-Pattern** — 明确不应该做的事

#### References 目录

```bash
ls .claude/skills/interview-write/references/
```

> 复杂的内容可以拆到 references/ 子目录里，SKILL.md 用链接引用它们。
> 这样主文件保持简洁，详细内容放在独立文件中。

### 3. 对比团队版

快速展示 interview-write-team 的 frontmatter，指出一个关键差异：

```yaml
disable-model-invocation: true
```

> 团队模式会启动多个 Agent 并行工作，开销更大，所以加了这个标记。

## 验证：选择题

使用 AskUserQuestion 工具的 options 参数，向用户出 3 道 4 选 1 选择题。从以下 5 道题库中随机选 3 题：

### 题库

**Q1: 用户通过什么方式调用一个 Skill？**

使用 AskUserQuestion：
- options:
  - "在 CLAUDE.md 里写指令"
  - "输入 /技能名（如 /interview-write）" ← 正确
  - "运行 node skill.js"
  - "在设置中启用插件"

**Q2: SKILL.md 中的 name 字段有什么要求？**

使用 AskUserQuestion：
- options:
  - "必须是中文"
  - "可以用任意格式"
  - "小写字母+连字符（如 my-skill）" ← 正确
  - "必须和文件夹名不同"

**Q3: allowed-tools 字段的作用是什么？**

使用 AskUserQuestion：
- options:
  - "定义 Skill 的安装依赖"
  - "列出需要的 API Key"
  - "限制 Skill 可以使用的工具权限" ← 正确
  - "指定 Skill 的输出格式"

**Q4: 如果 Skill 内容很多，怎么组织？**

使用 AskUserQuestion：
- options:
  - "全部写在 SKILL.md 里"
  - "拆到 references/ 子目录，主文件用链接引用" ← 正确
  - "写在 CLAUDE.md 里"
  - "拆成多个 SKILL.md"

**Q5: disable-model-invocation: true 表示什么？**

使用 AskUserQuestion：
- options:
  - "Skill 被禁用了"
  - "不允许用户调用"
  - "标记为高开销，需要用户确认才运行" ← 正确
  - "只能在团队模式使用"

### 判分规则

- 每题用户选完后立刻反馈对错，错了给出正确答案和简短解释
- 答对 2/3 即通过，不需要重来

通过后显示：

```
✅ 第2关通过！你已经理解了 Skill 的结构。
```
