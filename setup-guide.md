# Claude Code 环境安装指南

> 请在 Trae IDE 中打开此文档，让 Trae AI 协助你完成以下安装步骤。
> 本指南兼容 macOS 和 Windows，无需 Anthropic 账号。

---

## Step 0: 打开 Trae 终端

1. 打开 Trae IDE
2. 按 `Ctrl + ~` 或点击菜单「终端 → 新建终端」打开内置终端

**Windows 用户注意：** 确认终端类型是 **PowerShell**（不是 CMD）。如果显示的是 CMD，点击终端右上角的下拉箭头切换到 PowerShell。

---

## Step 1: 安装 Node.js 18+

Node.js 是运行 Claude Code 所需的基础工具。

### macOS

前往 https://nodejs.org → 点击下载 LTS 版本（.pkg 文件）→ 双击安装 → 一路点「继续」直到完成。

### Windows

前往 https://nodejs.org → 点击下载 LTS 版本（.msi 文件）→ 双击安装 → 安装时**勾选 "Add to PATH"** → 一路点「Next」直到完成。

### 验证

安装完成后，在 Trae 终端输入：

```bash
node -v
```

看到 `v18.x.x` 或更高版本号即成功。如果提示"命令未找到"，请**关闭并重新打开 Trae 终端**再试。

---

## Step 2: 安装 Git

Git 是代码版本管理工具，Claude Code 依赖它运行。

**Windows 用户必须先完成此步骤，否则后续 Claude Code 安装会失败。**

### macOS

在 Trae 终端运行：

```bash
xcode-select --install
```

会弹出安装对话框，点击「安装」，等待完成（可能需要几分钟）。

如果提示"已经安装"，说明你已经有 Git 了，跳过此步。

### Windows

1. 前往 https://git-scm.com/downloads/win
2. 下载安装包（选 "64-bit Git for Windows Setup"）
3. 双击运行，**所有选项保持默认**，一路点「Next」直到完成
4. **安装完毕后，关闭并重新打开 Trae 终端**

### 验证

```bash
git --version
```

看到 `git version x.x.x` 即成功。

---

## Step 3: 安装 Claude Code

### macOS

在 Trae 终端运行：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows（PowerShell）

在 Trae 终端运行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

### 验证

```bash
claude --version
```

看到版本号即成功。

**暂时不要运行 `claude`**，先完成下一步配置模型。

---

## Step 4: 安装 cc-switch 并配置模型

cc-switch 是一个模型切换工具，让你可以使用 Qwen 等国产大模型来驱动 Claude Code。

### 4a. 获取 Qwen API Key

如果你已经有 Qwen API Key，跳到 4b。

1. 前往阿里云百炼平台（https://bailian.console.aliyun.com/）注册/登录
2. 进入控制台 → 点击「API Key 管理」
3. 点击「创建 API Key」→ 复制保存（后面要用）

### 4b. 安装 cc-switch

#### macOS（方式一：有 Homebrew）

如果你已经安装了 Homebrew，在终端运行：

```bash
brew tap farion1231/ccswitch && brew install --cask cc-switch
```

#### macOS（方式二：无 Homebrew / 不确定）

1. 前往 https://github.com/farion1231/cc-switch/releases
2. 找到最新版本，下载 `CC-Switch-vX.X.X-macOS.zip`
3. 解压后，将 CC-Switch 拖入「应用程序」文件夹
4. 首次打开可能提示「无法验证开发者」：
   - 关闭提示
   - 打开「系统设置 → 隐私与安全」
   - 往下滚动找到 CC-Switch 的提示，点击「仍要打开」

#### Windows

1. 前往 https://github.com/farion1231/cc-switch/releases
2. 找到最新版本，下载 `CC-Switch-vX.X.X-Windows.msi`
3. 双击安装

### 4c. 配置 Qwen 模型

1. 启动 cc-switch 应用
2. 点击 **"Add Provider"**
3. 选择 **Qwen**
4. 粘贴你的 API Key
5. 点击 **"Enable"**
6. **关闭并重新打开 Trae 终端**

---

## Step 5: 验证环境

在 Trae 终端依次运行以下命令：

```bash
node -v          # 应看到 v18+
git --version    # 应看到 git version x.x.x
claude --version # 应看到版本号
```

最后运行：

```bash
claude
```

如果能正常启动并对话，说明环境配置成功！输入 `/exit` 退出。

---

## 环境验证清单

完成以上所有步骤后，确认以下项目全部通过：

- [ ] Trae IDE 已安装，终端可用
- [ ] Node.js 18+（`node -v` 通过）
- [ ] Git（`git --version` 通过）
- [ ] Claude Code（`claude --version` 通过）
- [ ] cc-switch 已配置 Qwen，`claude` 可正常启动

全部通过后，你就可以开始 Skill-Hub 闯关学习了！

---

## 常见问题

### Q: Windows 上 `irm` 命令报错？
确认你使用的是 **PowerShell** 而不是 CMD。在 Trae 终端右上角可以切换。

### Q: macOS 上 `curl` 命令报错 "command not found"？
这种情况极少见，curl 是 macOS 自带工具。尝试重启终端，或在 Trae 中新建一个终端窗口。

### Q: `claude` 启动后无法对话？
确认 cc-switch 中已经 Enable 了一个模型提供商，并且 API Key 正确。

### Q: cc-switch 打不开（macOS）？
前往「系统设置 → 隐私与安全」，找到 CC-Switch 的提示，点击「仍要打开」。
