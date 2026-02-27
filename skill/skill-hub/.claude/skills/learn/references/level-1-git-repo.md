# 第1关：Git 仓库与目录导览

## 目标

让用户拥有 skill-hub 仓库，了解目录结构和基本 git 操作。

## 教学流程

### 1. 检查当前位置

运行 `git rev-parse --is-inside-work-tree`。

- **已在 git 仓库** → 检查是否是 skill-hub（`.claude/skills/` 目录存在且有内容）
  - 是 → 跳关
  - 不是 → 提示用户需要 clone skill-hub
- **不在 git 仓库** → 进入教学

### 2. Clone 仓库

告诉用户：

> 我们先把 Skill-Hub 仓库拉到本地。在终端运行：

```bash
git clone https://github.com/cccccccAi/skill-hub.git
cd skill-hub
```

等用户完成后，验证 clone 是否成功。

### 3. 目录导览

带用户看目录结构：

```bash
ls -la
```

讲解每个关键目录：

- **`.claude/skills/`** — 所有技能定义的家。每个子目录就是一个 Skill。
- **`writing/`** — 写作工作空间
  - `examples/` — 风格参考文章，Skill 会读取这些学习写作风格
  - `drafts/` — 中间产物，写作过程中的草稿
  - `output/` — 最终文章，也就是成品
- **`learning/`** — 你的学习工作空间（就是现在用的）
- **`CLAUDE.md`** — 项目的"说明书"，Claude Code 每次启动都会读这个文件

### 4. 基本 Git 操作（快速过）

简要介绍三个最常用的命令：

```bash
git status       # 查看当前状态：哪些文件改了、哪些是新增的
git add <文件>    # 把文件加入暂存区（准备提交）
git commit -m "说明"  # 提交改动
```

> 后面闯关过程中你会自然用到这些，不用现在死记。

## 验证

运行以下检查：

1. `git rev-parse --is-inside-work-tree` → 返回 `true`
2. `ls .claude/skills/ | wc -l` → 至少 2 个目录

全部通过 → 显示：

```
✅ 第1关通过！你已经拥有了 skill-hub 仓库。
```
