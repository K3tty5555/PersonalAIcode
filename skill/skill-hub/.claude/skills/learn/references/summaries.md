# 每关通关总结

每关验证通过后，展示对应的学习要点和原理图，然后再进入下一关。

---

## 第1关总结

### 学习要点

✅ Git 仓库管理：clone、status、add、commit
✅ skill-hub 目录结构：skills 定义、writing 工作空间、learning 学习空间
✅ 各目录的职责分工

### 背后的原理

```
你做了什么：
  git clone → 把远程仓库拉到本地

仓库结构的设计逻辑：
  .claude/skills/   → 技能定义（Claude Code 会自动扫描这里）
  writing/           → 技能的工作空间（输入输出都在这里）
  learning/          → 你的学习空间
  CLAUDE.md          → 项目说明书（Claude Code 每次启动都读）
```

---

## 第2关总结

### 学习要点

✅ SKILL.md 由两部分组成：frontmatter（元数据）+ 正文（执行流程）
✅ name 决定调用方式（/name），必须是小写+连字符
✅ allowed-tools 控制 Skill 的权限边界
✅ 复杂内容拆到 references/ 子目录

### 背后的原理

```
当你输入 /interview-write 时，发生了什么：

  用户输入 /skill-name
        ↓
  Claude Code 扫描 .claude/skills/ 下所有子目录
        ↓
  找到 frontmatter 中 name 匹配的 SKILL.md
        ↓
  加载 SKILL.md 作为 Agent 的指令
        ↓
  按 allowed-tools 限制可用工具
        ↓
  执行正文中定义的流程
```

---

## 第3关总结

### 学习要点

✅ Skill 的完整生命周期：调用 → 执行 → 产出文件
✅ 访谈是素材收集过程，写作是素材转化过程
✅ 风格参考（examples/）让 AI 学习特定写作风格
✅ 输出文件保存在 writing/output/

### 背后的原理

```
/interview-write 的执行流程：

  Phase 1: 开场
    解析你传入的主题
        ↓
  Phase 2: 深度访谈
    通过提问收集你的故事素材
    实时保存到 drafts/interview-transcript.md
        ↓
  Phase 3: 判断终止
    素材足够时提议结束访谈
        ↓
  Phase 4: 学习风格
    读取 examples/ 中的参考文章
        ↓
  Phase 5: 写作
    结合素材+风格，生成文章
        ↓
  Phase 6: 自动优化
    检查金句密度、开头张力、字数
        ↓
  保存到 writing/output/
```

---

## 第4关总结

### 学习要点

✅ 单人模式 vs 团队模式的核心差异
✅ 多 Agent 分工：Interviewer / Writer A / Writer B / Critic
✅ 对抗式写作的价值：不同视角碰撞出更好的内容
✅ Critic 评审确保质量，Team Lead 综合终稿取各家之长
✅ 想体验完整团队模式，可运行 `/interview-write-team`

### 背后的原理

```
单人模式                         团队模式
┌──────────────┐          ┌─────────────────────────────┐
│              │          │                             │
│  一个 Agent   │          │  Interviewer → 访谈素材      │
│  全流程完成   │    vs     │  Writer A (悬念派) ──┐       │
│              │          │  Writer B (洞察派) ──┤→ Critic│
│              │          │                    └→ 终稿  │
└──────────────┘          └─────────────────────────────┘

关键差异：
  单人 → 一个人的视角，风格统一
  团队 → 多视角碰撞，取各家之长，质量更高
```

---

## 第5关总结

### 学习要点

✅ 从零创建 Skill 的完整流程
✅ frontmatter 各字段的作用和规范
✅ 正文如何定义执行流程
✅ 如何让 Skill 可被 /name 调用

### 背后的原理

```
创建一个 Skill 只需要 3 步：

  1. 确定需求
     你要解决什么问题？用在什么场景？
        ↓
  2. 写 SKILL.md
     frontmatter: name + description + allowed-tools
     正文: 执行流程（Step 1, 2, 3...）
        ↓
  3. 放到正确位置
     .claude/skills/你的skill名/SKILL.md
        ↓
  完成！输入 /你的skill名 即可使用
```
