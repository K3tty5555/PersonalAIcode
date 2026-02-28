# AI_PM - AI 产品经理

一个模仿产品经理工作流的 Claude Code 技能套件。将简短的需求描述转化为完整、专业的产品需求文档（PRD）。

**核心特点**：支持多项目管理，每个需求独立存放，清晰不混乱。

## 功能特点

- **需求分析** - 深入理解用户需求，输出结构化分析报告
- **竞品研究** - 分析市场竞争格局，识别差异化机会
- **用户故事** - 编写详细的用户故事和验收标准
- **PRD 生成** - 输出专业级产品需求文档
- **多项目管理** - 每个需求独立项目文件夹，避免文件混乱

## 目录结构

```
AI_PM/
├── .claude/skills/
│   ├── ai-pm/              # 主控技能
│   ├── ai-pm-analyze/      # 需求分析技能
│   ├── ai-pm-research/     # 竞品研究技能
│   ├── ai-pm-story/        # 用户故事技能
│   └── ai-pm-prd/          # PRD 生成技能
└── ai-pm/output/
    ├── projects/                    # 所有项目
    │   ├── meeting-assistant-20260228/    # 项目1
    │   │   ├── 01-requirement-draft.md
    │   │   ├── 02-analysis-report.md
    │   │   ├── 03-competitor-report.md
    │   │   ├── 04-user-stories.md
    │   │   └── 05-PRD-v1.0.md
    │   ├── accounting-app-20260301/       # 项目2
    │   └── ...
    └── .current-project             # 记录当前项目
```

## 快速开始

### 安装

将 `AI_PM` 文件夹复制到你的项目根目录。

### 创建第一个项目

```bash
/ai-pm "我想做一个记账小程序，帮助年轻人管理日常开支"
```

AI 会：
1. 创建项目文件夹（如 `accounting-app-20260301`）
2. 深度访谈，挖掘需求细节
3. 依次生成分析、竞品、故事、PRD 文档

### 常用命令

```bash
# 项目管理
/ai-pm list                          # 列出所有项目
/ai-pm status                        # 查看当前项目状态
/ai-pm switch {项目名}               # 切换到指定项目
/ai-pm new {项目名}                  # 创建新项目

# 执行流程
/ai-pm                               # 从断点继续当前项目
/ai-pm "新需求描述"                  # 创建新项目
/ai-pm analyze                       # 仅执行需求分析
/ai-pm research                      # 仅执行竞品研究
/ai-pm story                         # 仅执行用户故事
/ai-pm prd                           # 仅生成 PRD
```

## 工作流程

```
用户输入需求
    ↓
创建项目文件夹 (projects/项目名-日期/)
    ↓
深度访谈澄清需求
    ↓ 保存 01-requirement-draft.md
需求分析
    ↓ 保存 02-analysis-report.md
竞品研究
    ↓ 保存 03-competitor-report.md
用户故事
    ↓ 保存 04-user-stories.md
PRD 生成
    ↓ 保存 05-PRD-v1.0.md
✅ 完成
```

## 多项目管理

### 同时处理多个需求

```bash
# 需求A：会议助手
/ai-pm "做一个AI会议助手，实时转录并生成纪要"

# 需求B：记账App
/ai-pm "做一个记账小程序"

# 查看所有项目
/ai-pm list
# 输出：
# ▶ meeting-assistant-20260228 - 60% (当前项目)
#   accounting-app-20260301 - 20%

# 切换到记账App项目继续
/ai-pm switch accounting-app-20260301
/ai-pm
```

### 项目文件命名

每个项目内的文档按执行顺序编号：

| 文件 | 说明 |
|------|------|
| `01-requirement-draft.md` | 澄清后的需求 |
| `02-analysis-report.md` | 需求分析报告 |
| `03-competitor-report.md` | 竞品研究报告 |
| `04-user-stories.md` | 用户故事 |
| `05-PRD-v1.0.md` | 完整需求文档 |

编号好处：
- 按执行顺序排列
- 清楚看到项目进展
- 支持版本迭代（如 `05-PRD-v1.1.md`）

## 交互式需求澄清

不像其他工具只接受一句话需求，AI_PM 会像真正的产品经理一样追问：

```
AI: 第一个问题——这个记账小程序主要是给谁用的？
    是大学生？还是职场白领？
    最好能描述一个具体的用户形象...

你: 给刚工作的年轻人，想存钱买房的

AI: 明白了！针对想存钱的年轻职场人。

    第二个问题——他们现在怎么记账？
    是用 Excel？还是随手记这类 App？
    现在的记账方式有什么不满意的地方？

你: 用过随手记，但是广告太多，而且不知道怎么分析

AI: 了解了！现有 App 广告多、缺乏分析洞察。
    还有几个问题...
```

## 示例

### 示例 1: 简单需求

```
/ai-pm "做一个番茄钟 App，帮助用户专注工作"
```

### 示例 2: 复杂需求

```
/ai-pm "开发一个智能客服系统，能自动回复常见问题，
支持多渠道接入（微信、网页、APP），
并且可以转接人工客服"
```

### 示例 3: 从文件读取

```bash
# 先创建需求文件
echo "我想做一个读书笔记分享平台" > my-idea.txt

# 然后调用技能
/ai-pm my-idea.txt
```

## 文档说明

详见 [QUICKSTART.md](./QUICKSTART.md) 获取完整使用指南。

## 自定义

- 修改 `.claude/skills/ai-pm-analyze/SKILL.md` 可自定义分析框架
- 修改 `.claude/skills/ai-pm-prd/SKILL.md` 可自定义 PRD 模板
- 所有 skill 都是 Markdown 文件，可直接编辑

## License

MIT
