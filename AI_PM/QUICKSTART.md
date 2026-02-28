# AI_PM 快速上手指南

## 安装

1. 确保 `AI_PM` 文件夹在你的项目根目录
2. 启动 Claude Code

```bash
cd /path/to/your/project
claude
```

## 目录结构

每个需求都有独立的项目文件夹：

```
AI_PM/ai-pm/output/
├── projects/
│   ├── meeting-assistant-20260228/    # 项目1
│   │   ├── 01-requirement-draft.md
│   │   ├── 02-analysis-report.md
│   │   ├── 03-competitor-report.md
│   │   ├── 04-user-stories.md
│   │   └── 05-PRD-v1.0.md
│   ├── accounting-app-20260301/       # 项目2
│   └── ...
└── .current-project                    # 记录当前项目
```

## 使用方式

### 方式1：创建新项目

```
/ai-pm "我想做一个帮助程序员做代码审查的工具"
```

AI 会：
1. 建议项目名（如 `code-review-tool-20260228`）
2. 创建项目文件夹
3. **引导你完善需求（深度访谈）**
4. **每个阶段前询问补充**：用户画像/竞品/场景等
5. 依次生成所有文档

### 交互补充机制

AI_PM 在每个阶段前都会主动询问你是否有补充：

| 阶段 | 询问内容 |
|------|---------|
| 需求分析前 | 关于【用户画像/痛点/功能/指标】有什么补充？ |
| 竞品研究前 | 你知道哪些竞品？有什么特别关注？ |
| 用户故事前 | 有什么特殊场景、异常流程需要考虑？ |
| PRD生成前 | 确认基于前面的分析生成PRD？ |

**如何回复：**
- **有补充** → 直接告诉AI补充内容
- **无补充** → 回复"继续"或"没有补充"
- **需要修改** → 告诉AI修改前面阶段的内容

### 方式2：生成网页原型

PRD 完成后，可以生成交互式网页原型：

```
/ai-pm prototype
```

**交互流程：**

```
AI: 🎨 即将开始：原型设计

    请告诉我设计偏好：

    1. 设备类型：
       • 移动端 App（手机应用）
       • Web 端（电脑浏览器）
       • 响应式（同时适配）

    2. 设计风格（可选，默认 Apple 风格）：
       • Apple 风格（简洁、圆角、毛玻璃）
       • Material Design
       • 自定义描述

你: 移动端，Apple风格

AI: ✅ 原型生成完成！

    📁 文件位置：06-prototype/
    📄 入口文件：index.html

    🌐 预览方式：
       python -m http.server 8080
       访问 http://localhost:8080
```

**原型预览：**

```bash
cd AI_PM/ai-pm/output/projects/{项目名}/06-prototype
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

### 方式3：查看所有项目

```
/ai-pm list
```

输出：
```
📁 AI_PM 项目列表

▶ meeting-assistant-20260228 - 100% (当前项目)
  accounting-app-20260301 - 40%
  fitness-tracker-20260305 - 0%

共 3 个项目
```

### 方式4：切换项目

```
/ai-pm switch accounting-app-20260301
```

然后可以在该项目继续：
```
/ai-pm          # 从断点继续
/ai-pm analyze  # 重新执行需求分析
```

### 方式5：查看当前项目状态

```
/ai-pm status
```

输出：
```
📊 AI_PM 项目状态

📁 项目: meeting-assistant-20260228
   路径: ai-pm/output/projects/meeting-assistant-20260228/

   ✅ 阶段 1: 需求澄清 (4.2KB, 02-28 10:30)
   ✅ 阶段 2: 需求分析 (12.5KB, 02-28 10:35)
   ✅ 阶段 3: 竞品研究 (15.8KB, 02-28 10:42)
   ⏳ 阶段 4: 用户故事
   ⏳ 阶段 5: PRD生成

   进度: 60% (3/5)

🔄 继续命令:
   /ai-pm story    # 继续用户故事
```

### 方式5：单独执行某个阶段

```
/ai-pm analyze   # 仅执行需求分析
/ai-pm research  # 仅执行竞品研究
/ai-pm story     # 仅执行用户故事
/ai-pm prd       # 仅生成 PRD
```

### 方式6：从文件读取需求

```
/ai-pm ./docs/my-idea.md
```

会创建新项目并导入文件内容。

## 项目管理命令

| 命令 | 作用 | 示例 |
|------|------|------|
| `/ai-pm list` | 列出所有项目 | - |
| `/ai-pm status` | 显示当前项目详细状态 | - |
| `/ai-pm switch {项目名}` | 切换到指定项目 | `/ai-pm switch meeting-assistant` |
| `/ai-pm new {项目名}` | 创建空项目 | `/ai-pm new my-project` |
| `/ai-pm delete {项目名}` | 删除项目 | `/ai-pm delete old-project` |

## 最佳实践

### 1. 项目命名

- ✅ **自动生成**：`记账app-20260301`
- ✅ **指定名称**：`/ai-pm new accounting-mvp`
- ❌ **避免**：太长的名字、特殊字符

### 2. 多需求管理

每个独立需求创建独立项目：
```
/ai-pm "做一个记账App"           # 项目1: accounting-app-20260301
/ai-pm new fitness-tracker        # 项目2: fitness-tracker
/ai-pm "团队需要一个文档协作工具"  # 项目3: doc-collaboration-20260302
```

### 3. 与 AI 对话时

- 把 AI 当作你的「产品合伙人」
- 回答问题时尽量具体，举例子
- 不清楚的地方可以直接说"不太确定"或"让我想想"
- 随时可以打断说"等等，我觉得..."

### 4. 中途修改

如果某个阶段输出不满意：
```
"我觉得目标用户分析得不够准，应该是..."
"漏了一个重要场景，就是..."
"我想重新调整一下功能优先级"
```

## 产出文件说明

每个项目包含：

| 文件 | 序号 | 内容 |
|------|------|------|
| `01-requirement-draft.md` | 1 | 澄清后的需求 |
| `02-analysis-report.md` | 2 | 需求分析报告 |
| `03-competitor-report.md` | 3 | 竞品研究报告 |
| `04-user-stories.md` | 4 | 用户故事 |
| `05-PRD-v1.0.md` | 5 | 完整产品需求文档 |

**加序号的好处：**
- 文件按执行顺序排列
- 清楚看到项目进展
- 方便版本管理（如 `05-PRD-v1.1.md`）

## 示例对话

**示例1：创建新项目**

```
你：/ai-pm 我想做一个记账小程序

AI：👋 你好，我是你的 AI 产品经理。

    📁 创建新项目

    项目命名建议：
    - accounting-app-20260301（自动生成）
    - 或你想指定一个项目名？

你：就叫 accounting-mvp 吧

AI：✅ 创建项目: accounting-mvp
    路径: ai-pm/output/projects/accounting-mvp/

    收到你的初步需求："我想做一个记账小程序"

    第一个问题：这个记账小程序主要是给谁用的？
    ...
```

**示例2：查看并切换项目**

```
你：/ai-pm list

AI：📁 AI_PM 项目列表

    ▶ meeting-assistant-20260228 - 60% (当前项目)
      accounting-mvp - 20%

    共 2 个项目

你：/ai-pm switch accounting-mvp

AI：✅ 已切换到项目: accounting-mvp

    📊 当前进度: 20% (1/5)
    ✅ 阶段 1: 需求澄清
    ⏳ 阶段 2: 需求分析

    🔄 继续命令:
       /ai-pm analyze  # 继续需求分析
```

**示例3：在某个项目重新执行某阶段**

```
你：/ai-pm switch meeting-assistant

AI：✅ 已切换到项目: meeting-assistant

你：/ai-pm analyze

AI：⚠️ 需求分析报告已存在 (02-analysis-report.md)

    请选择：
    1. 重新生成（覆盖现有文件）
    2. 查看现有报告
    3. 取消

你：1

AI：🔄 重新执行需求分析...
```

## 故障排除

### Q: 技能没有响应？

检查 AI_PM 文件夹位置：
```bash
ls -la AI_PM/.claude/skills/ai-pm/
```

应该有 `SKILL.md` 文件。

### Q: 想清空某个项目重新开始？

```
/ai-pm switch {项目名}
```

然后删除该项目的输出文件，或直接删除项目重建。

### Q: 项目文件在哪里？

```bash
ls -la AI_PM/ai-pm/output/projects/
```

### Q: 如何备份项目？

项目文件夹就是普通文件夹，可以直接复制：
```bash
cp -r AI_PM/ai-pm/output/projects/my-project ./backup/
```

### Q: 可以同时处理多个需求吗？

可以！每个需求是独立的项目文件夹，随时切换：
```
/ai-pm switch project-a  # 处理需求A
/ai-pm switch project-b  # 处理需求B
```

## 进阶使用

- 修改 `.claude/skills/ai-pm-analyze/SKILL.md` 可以自定义分析框架
- 修改 `.claude/skills/ai-pm-prd/SKILL.md` 可以自定义 PRD 模板
- 所有 skill 都是 Markdown 文件，可以直接编辑

---

祝你使用愉快！有任何问题随时反馈。
