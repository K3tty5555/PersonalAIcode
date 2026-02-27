# Daily Push - 每日资讯精选

Apple 风格的每日资讯聚合网站，展示 AI 热点、万代/Hot Toys 模玩新品、游戏折扣信息。

## 项目架构

```
daily-push-web/
├── app/                    # Next.js 前端应用
│   ├── components/         # 页面组件
│   │   ├── AINewsSection.tsx    # AI资讯板块
│   │   ├── ToysSection.tsx      # 玩具模型板块
│   │   └── GamesSection.tsx     # 游戏折扣板块
│   ├── api/                # API路由
│   └── page.tsx            # 主页面
│
├── lib/                    # 数据文件（由skill生成）
│   ├── daily-data.json     # 每日数据（自动生成）
│   ├── sync-status.json    # 同步状态（自动生成）
│   └── data.ts             # TypeScript类型（自动生成）
│
├── skill/                  # 数据抓取引擎
│   ├── index.ts            # CLI入口
│   ├── generator.ts        # 数据生成器
│   ├── fetcher.ts          # 新闻抓取
│   └── fetcher-v2.ts       # 商品/游戏抓取
│
└── .github/workflows/
    └── daily-update.yml    # 每日自动更新
```

## 数据流

```
skill/index.ts ──抓取数据──▶ lib/daily-data.json ──▶ Web展示
     │                                               ▲
     └──────── GitHub Actions 每日 00:00 ─────────────┘
```

## 快速开始

### 开发

```bash
npm install
npm run dev
```

### 手动更新数据

```bash
npm run skill        # 生成数据
npm run skill:health # 健康检查
```

### 自动更新

GitHub Actions 每天北京时间 00:00 自动：
1. 运行 `npm run skill` 抓取数据
2. 更新 `lib/daily-data.json`
3. 构建并部署

## 数据来源

| 类别 | 来源 | 更新频率 |
|------|------|----------|
| AI资讯 | 36氪、知乎、IT之家 | 每日 |
| 万代模型 | bandaihobbysite.cn | 每月 |
| Hot Toys | 小红书@HotToys | 每月 |
| Steam折扣 | store.steampowered.com | 实时 |
| PlayStation | store.playstation.com | 实时 |

## 技术栈

- **框架**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **UI**: shadcn/ui + Lucide Icons
- **部署**: GitHub Pages
- **自动化**: GitHub Actions

## License

MIT
