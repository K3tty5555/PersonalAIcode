# Skill Hub — Skill 学习训练营

通过 5 关闯关教学，从零学会创建和使用 [Claude Code Skills](https://code.claude.com/docs/en/skills)。内含实战案例（访谈写作）和 Skill 模板。

基于 [Agent Skills](https://agentskills.io) 开放标准，通过 Claude Code 驱动。

## 技能索引

| 技能 | 说明 | 调用方式 |
|------|------|---------|
| **learn** | 闯关教学：5关从入门到创建自己的 Skill | `/learn [关卡编号]` |
| **build-course** | 课程生成器：输入主题 → 设计5关课程 → 生成 Skill 文件 → 模拟审计 | `/build-course [学习主题]` |
| **interview-write** | 教学案例：深度访谈 → 风格学习 → 写作 → 自动优化 | `/interview-write [主题]` |
| **interview-write-team** | 教学案例：访谈 → 双写手对抗 → 评审 → 综合终稿 | `/interview-write-team [主题]` |

## 快速开始

```bash
git clone https://github.com/cccccccAi/skill-hub.git
cd skill-hub
claude

# 开始闯关教学（推荐新手从这里开始）
# /learn

# 生成一套新的学习课程
# /build-course MCP Server 教学

# 单人写作
# /interview-write 我最近的创业故事

# 团队写作
# /interview-write-team AI时代的焦虑
```

## 项目结构

```
skill-hub/
├── .claude/skills/              # 所有技能定义
│   ├── learn/                   # 核心：闯关式交互教学（5关）
│   ├── build-course/            # 课程生成器（自动设计+生成闯关课程）
│   ├── interview-write/         # 教学案例：单人访谈写作
│   └── interview-write-team/    # 教学案例：团队对抗写作
├── templates/                   # Skill 模板骨架
│   ├── basic/                   # 最简模板（~15行）
│   └── standard/                # 标准模板（~35行）
├── writing/                     # 写作工作空间
│   ├── examples/                # 风格参考文章（可替换为你自己的）
│   ├── drafts/                  # 中间产物（不入 git）
│   └── output/                  # 最终产出（不入 git）
├── learning/                    # 学习工作空间
│   ├── setup-guide.md           # 环境安装指南
│   ├── official-skill-guide.md  # 官方 Skill 搭建指南
│   ├── progress.md              # 闯关进度（不入 git）
│   └── my-first-skill/          # 学员作品（不入 git）
└── CLAUDE.md
```

## 自定义风格案例

`writing/examples/` 存放写作风格参考文章。写作 Skill 会从中学习风格（节奏、金句密度、开场方式等）。

替换为你自己喜欢的文章即可，支持 `.md` 格式，建议 3-5 篇。修改后立即生效。

## 创建自己的 Skill

从模板开始：
- `templates/basic/SKILL.md` — 最简骨架，快速上手
- `templates/standard/SKILL.md` — 完整模板，含 references/、Anti-Pattern 等进阶结构

或者用 `/build-course` 自动生成一套完整的闯关教学课程。
