# Skill 学习训练营

通过 5 关闯关教学，从零学会创建和使用 Claude Code Skills。内含实战案例（访谈写作）和 Skill 模板。

## 项目结构

```
skill-hub/
├── .claude/skills/              # 所有技能定义
│   ├── interview-write/         # 教学案例：单人访谈写作（/interview-write）
│   ├── interview-write-team/    # 教学案例：团队对抗写作（/interview-write-team）
│   └── learn/                   # 核心：闯关式交互教学（/learn）
├── writing/                     # 写作工作空间
│   ├── examples/                # 风格参考文章（可替换为你自己的）
│   ├── drafts/                  # 中间产物（不入 git）
│   └── output/                  # 最终产出（不入 git）
├── templates/                   # Skill 模板骨架
│   ├── basic/                   # 最简模板（~15行）
│   └── standard/                # 标准模板（~35行，含进阶结构）
├── learning/                    # 学习工作空间
│   ├── setup-guide.md           # 环境安装指南
│   ├── progress.md              # 闯关进度（不入 git）
│   └── my-first-skill/          # 学员作品（不入 git）
└── CLAUDE.md
```

## 路径约定

所有路径使用相对路径（相对于项目根目录）。写作相关路径以 `./writing/` 为前缀。

## 技能说明

| 技能 | 说明 |
|------|------|
| `/learn [关卡编号]` | 闯关教学：5关从入门到创建自己的 Skill |
| `/interview-write [主题]` | 教学案例：访谈 → 写作 → 自动优化 |
| `/interview-write-team [主题]` | 教学案例：访谈 → 双写手对抗 → 评审 → 综合终稿 |
| `/build-course [学习主题]` | 课程生成器：输入主题 → 设计5关课程 → 生成 Skill 文件 → 模拟审计 |

## 写作风格规范

- **字数**：1000 字符以内（默认，可在 style-guide.md 中调整）
- **标题**：3 个备选，极其吸睛
- **前三行**：3 秒内抓住读者
- **金句**：加粗（`**`），每 50-80 字一个
- **风格参考**：写作前必须读取 `./writing/examples/` 中所有 `.md` 文件

## 自定义风格案例

`writing/examples/` 目录存放写作风格参考文章。这些是项目作者的公众号文章，写作 Skill 会从中学习写作风格（节奏、金句密度、开场方式等）。

**你应该替换为自己喜欢的文章：**
- 支持 `.md` 格式
- 建议放 3-5 篇能代表你想要风格的文章
- AI 学习的是风格和节奏，不是字数——参考文章可以比输出上限长
- 修改后立即生效，无需重启

## Skill 模板

想自己创建新 Skill？从模板开始：
- `templates/basic/SKILL.md` — 最简骨架，快速上手
- `templates/standard/SKILL.md` — 完整模板，含 references/、Anti-Pattern 等进阶结构
