---
name: my-skill
description: >-
  在这里用一句话描述你的 Skill 能做什么。
argument-hint: "[参数说明]"
allowed-tools: Read Write Edit Bash(ls)
---

# {Skill 名称}

## 概述

{用 2-3 句话说明这个 Skill 的角色和目标}

## 执行流程

### Step 1: 解析输入

解析 `$ARGUMENTS`，判断用户给了什么：
- **文件路径** → 读取文件内容
- **文本内容** → 直接使用
- **为空** → 提示用户输入

### Step 2: {你的核心步骤}

{描述 Skill 的主要工作流程}

### Step 3: 输出结果

{描述输出格式和保存位置}
