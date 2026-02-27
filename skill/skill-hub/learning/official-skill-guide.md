# Extend Claude with Skills — 官方指南

> 来源：https://code.claude.com/docs/en/skills
> 保存时间：2026-02-26

Skills extend what Claude can do. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly with `/skill-name`.

Custom slash commands have been merged into skills. A file at `.claude/commands/review.md` and a skill at `.claude/skills/review/SKILL.md` both create `/review` and work the same way. Your existing `.claude/commands/` files keep working. Skills add optional features: a directory for supporting files, frontmatter to control whether you or Claude invokes them, and the ability for Claude to load them automatically when relevant.

Claude Code skills follow the [Agent Skills](https://agentskills.io) open standard.

---

## Getting Started

### Create Your First Skill

1. Create a directory: `mkdir -p ~/.claude/skills/explain-code`
2. Write `SKILL.md` with YAML frontmatter + markdown content
3. Test: ask something matching the description, or invoke directly with `/skill-name`

### Where Skills Live

| Location   | Path                                                | Applies to                     |
| :--------- | :-------------------------------------------------- | :----------------------------- |
| Enterprise | See managed settings                                | All users in your organization |
| Personal   | `~/.claude/skills/<skill-name>/SKILL.md`            | All your projects              |
| Project    | `.claude/skills/<skill-name>/SKILL.md`              | This project only              |
| Plugin     | `<plugin>/skills/<skill-name>/SKILL.md`             | Where plugin is enabled        |

Priority: enterprise > personal > project. Plugin skills use `plugin-name:skill-name` namespace.

### Skill Directory Structure

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

---

## Configure Skills

### Types of Skill Content

**Reference content** — knowledge Claude applies to your current work (conventions, patterns, style guides). Runs inline.

```yaml
---
name: api-conventions
description: API design patterns for this codebase
---
When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation
```

**Task content** — step-by-step instructions for a specific action. Often invoked directly with `/skill-name`.

```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---
Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```

### Frontmatter Reference

All fields are optional. Only `description` is recommended.

| Field                      | Required    | Description                                                                                                                                           |
| :------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | No          | Display name. Lowercase letters, numbers, and hyphens only (max 64 characters). If omitted, uses directory name.                                      |
| `description`              | Recommended | What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content.  |
| `argument-hint`            | No          | Hint shown during autocomplete. Example: `[issue-number]` or `[filename] [format]`.                                                                   |
| `disable-model-invocation` | No          | Set to `true` to prevent Claude from automatically loading this skill. Default: `false`.                                                               |
| `user-invocable`           | No          | Set to `false` to hide from the `/` menu. Default: `true`.                                                                                             |
| `allowed-tools`            | No          | Tools Claude can use without asking permission when this skill is active.                                                                              |
| `model`                    | No          | Model to use when this skill is active.                                                                                                                |
| `context`                  | No          | Set to `fork` to run in a forked subagent context.                                                                                                     |
| `agent`                    | No          | Which subagent type to use when `context: fork` is set.                                                                                                |
| `hooks`                    | No          | Hooks scoped to this skill's lifecycle.                                                                                                                |

### String Substitutions

| Variable               | Description                                                                                                  |
| :--------------------- | :----------------------------------------------------------------------------------------------------------- |
| `$ARGUMENTS`           | All arguments passed when invoking the skill.                                                                |
| `$ARGUMENTS[N]`        | Access a specific argument by 0-based index.                                                                 |
| `$N`                   | Shorthand for `$ARGUMENTS[N]`.                                                                               |
| `${CLAUDE_SESSION_ID}` | The current session ID.                                                                                      |

If `$ARGUMENTS` is not present in the content, arguments are appended as `ARGUMENTS: <value>`.

### Add Supporting Files

Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files.

Reference supporting files from `SKILL.md` so Claude knows what each file contains and when to load it:

```markdown
## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

### Control Who Invokes a Skill

| Frontmatter                      | You can invoke | Claude can invoke | When loaded into context                                     |
| :------------------------------- | :------------- | :---------------- | :----------------------------------------------------------- |
| (default)                        | Yes            | Yes               | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes            | No                | Description not in context, full skill loads when you invoke |
| `user-invocable: false`          | No             | Yes               | Description always in context, full skill loads when invoked |

- `disable-model-invocation: true`: Only you can invoke. Use for workflows with side effects (deploy, commit, send-slack-message).
- `user-invocable: false`: Only Claude can invoke. Use for background knowledge.

### Restrict Tool Access

```yaml
---
name: safe-reader
description: Read files without making changes
allowed-tools: Read, Grep, Glob
---
```

### Pass Arguments to Skills

```yaml
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---
Fix GitHub issue $ARGUMENTS following our coding standards.
```

Run `/fix-issue 123` → Claude receives "Fix GitHub issue 123 following our coding standards..."

Positional access: `$ARGUMENTS[0]` or shorthand `$0`, `$1`, `$2`.

---

## Advanced Patterns

### Inject Dynamic Context

The `` !`command` `` syntax runs shell commands before the skill content is sent to Claude:

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---
## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

Commands execute immediately (preprocessing), Claude only sees the final result.

### Run Skills in a Subagent

Add `context: fork` when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history.

> `context: fork` only makes sense for skills with explicit instructions. Guidelines without a task will return without meaningful output.

| Approach                     | System prompt                             | Task                        | Also loads                   |
| :--------------------------- | :---------------------------------------- | :-------------------------- | :--------------------------- |
| Skill with `context: fork`   | From agent type (`Explore`, `Plan`, etc.) | SKILL.md content            | CLAUDE.md                    |
| Subagent with `skills` field | Subagent's markdown body                  | Claude's delegation message | Preloaded skills + CLAUDE.md |

The `agent` field options: built-in agents (`Explore`, `Plan`, `general-purpose`) or custom subagents from `.claude/agents/`. Default: `general-purpose`.

### Restrict Claude's Skill Access

Three ways to control which skills Claude can invoke:

1. **Disable all skills**: deny the `Skill` tool in `/permissions`
2. **Allow/deny specific skills**: `Skill(commit)`, `Skill(review-pr *)`, `Skill(deploy *)`
3. **Hide individual skills**: `disable-model-invocation: true` in frontmatter

### Generate Visual Output

Skills can bundle and run scripts in any language. Example: codebase visualizer generates interactive HTML.

Pattern: SKILL.md instructs Claude to run a bundled Python/JS script → script generates HTML → opens in browser.

---

## Share Skills

- **Project skills**: Commit `.claude/skills/` to version control
- **Plugins**: Create a `skills/` directory in your plugin
- **Managed**: Deploy organization-wide through managed settings

---

## Troubleshooting

### Skill Not Triggering
1. Check description includes keywords users would naturally say
2. Verify skill appears in "What skills are available?"
3. Try rephrasing request to match description
4. Invoke directly with `/skill-name`

### Skill Triggers Too Often
1. Make description more specific
2. Add `disable-model-invocation: true`

### Claude Doesn't See All Skills
Skill descriptions budget: 2% of context window, fallback 16,000 characters. Override with `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var.

---

## Tips

- To enable extended thinking in a skill, include "ultrathink" in skill content
- Skills from `--add-dir` directories support live change detection
- `user-invocable` only controls menu visibility, not Skill tool access. Use `disable-model-invocation: true` to block programmatic invocation.
