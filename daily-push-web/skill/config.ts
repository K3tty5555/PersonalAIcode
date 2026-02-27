// Skill 配置文件 V2
// 集中管理数据生成和同步的配置

export const SKILL_CONFIG = {
  // 数据输出目录
  outputDir: './skill/output',

  // 数据文件前缀
  filePrefix: 'daily-push',

  // 生成时间（每天几点执行）
  scheduleHour: 9,

  // 数据新鲜度阈值（分钟）
  freshnessThreshold: 120,

  // 重试配置
  retry: {
    maxAttempts: 3,
    intervalMinutes: 5,
  },

  // 汇率配置
  exchangeRates: {
    jpyToCny: 0.048,
    hkdToCny: 0.92,
  },

  // 数据源配置
  sources: {
    // 国内AI新闻源（按优先级排序）
    aiNews: {
      // 主要数据源
      primary: [
        { name: '36氪', url: 'https://36kr.com/feed', enabled: true },
        { name: '36氪快讯', url: 'https://36kr.com/api/newsflash', enabled: true },
      ],
      // 补充数据源
      secondary: [
        { name: '知乎热榜', url: 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total', enabled: true },
        { name: 'IT之家', url: 'https://www.ithome.com/rss/', enabled: true },
        { name: '极客公园', url: 'https://www.geekpark.net/rss', enabled: false },
      ],
      // 趋势数据
      trends: [
        { name: '小红书', enabled: true },
        { name: '百度指数', enabled: false },
      ],
    },

    // 游戏数据
    games: {
      steam: { enabled: true, api: 'https://store.steampowered.com/api/featuredcategories/' },
      playstation: { enabled: true, url: 'https://store.playstation.com/zh-hans-hk/category/' },
      nintendo: { enabled: false, url: 'https://store.nintendo.com.hk/' },
    },

    // 万代模型数据
    bandai: {
      official: 'https://www.bandai.co.jp/catalog/item.php?gid=' ,
      bilibili: 'https://search.bilibili.com/all?keyword=',
      products: [
        {
          name: 'RG 1/144 RX-78-2 高达 Ver.2.1',
          series: '机动战士高达',
          priceJPY: 3850,
          releaseDate: '2026-03-14',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000000.jpg',
        },
        {
          name: 'MG 1/100 高达EX',
          series: '机动战士高达GQuuuuuuX',
          priceJPY: 8800,
          releaseDate: '2026-03-21',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000001.jpg',
        },
        {
          name: 'HG 1/144 GQuuuuuuX',
          series: '机动战士高达GQuuuuuuX',
          priceJPY: 2750,
          releaseDate: '2026-03-21',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000002.jpg',
        },
        {
          name: 'RG 1/144 正义高达',
          series: '机动战士高达SEED',
          priceJPY: 3850,
          releaseDate: '2026-04-11',
          type: '再版',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000003.jpg',
        },
        {
          name: 'MGSD 自由高达',
          series: '机动战士高达SEED',
          priceJPY: 4950,
          releaseDate: '2026-04-18',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000004.jpg',
        },
        {
          name: 'HG 1/144 高达Barbatos 第6形态',
          series: '机动战士高达 铁血的奥尔芬斯',
          priceJPY: 2200,
          releaseDate: '2026-04-25',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000005.jpg',
        },
        {
          name: 'S.H.Figuarts 假面骑士Gavv 脆脆薯片形态',
          series: '假面骑士Gavv',
          priceJPY: 7700,
          releaseDate: '2026-03-28',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000006.jpg',
        },
        {
          name: '真骨雕 假面骑士空我 全能形态 20周年版',
          series: '假面骑士空我',
          priceJPY: 8800,
          releaseDate: '2026-04-04',
          type: '再版',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000007.jpg',
        },
        {
          name: 'S.H.Figuarts 布雷萨奥特曼 月辉形态',
          series: '布雷萨奥特曼',
          priceJPY: 7150,
          releaseDate: '2026-03-21',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000008.jpg',
        },
        {
          name: 'Figur-rise Standard 亚古兽 -勇气之绊-',
          series: '数码宝贝',
          priceJPY: 3300,
          releaseDate: '2026-04-18',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000009.jpg',
        },
        {
          name: 'RG 1/144 拂晓高达 大鹫装备',
          series: '机动战士高达SEED FREEDOM',
          priceJPY: 8250,
          releaseDate: '2026-05-02',
          type: '新品',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000010.jpg',
        },
        {
          name: 'MG 1/100 高达F91 Ver.2.0',
          series: '机动战士高达F91',
          priceJPY: 5500,
          releaseDate: '2026-05-09',
          type: '再版',
          image: 'https://bandai-a.akamaihd.net/bc/img/model/b_item/00000000000000000000000000000011.jpg',
        },
      ],
    },

    // Hot Toys 数据
    hotToys: {
      official: 'https://www.hottoys.com.hk/',
      bilibili: 'https://search.bilibili.com/all?keyword=',
      products: [
        {
          name: '蜘蛛侠 黑金战衣',
          series: '蜘蛛侠：英雄无归',
          priceHKD: 1880,
          announceDate: '2026-04-15',
          status: '预定中',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000000.jpg',
        },
        {
          name: '雷神索尔 4.0',
          series: '雷神4：爱与雷霆',
          priceHKD: 2280,
          announceDate: '2026-04-22',
          status: '即将截单',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000001.jpg',
        },
        {
          name: '曼达洛人 2.0 豪华版',
          series: '曼达洛人 第三季',
          priceHKD: 2180,
          announceDate: '2026-03-30',
          status: '预定中',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000002.jpg',
        },
        {
          name: '达斯·摩尔 克隆人战争版',
          series: '星球大战：克隆人战争',
          priceHKD: 1680,
          announceDate: '2026-05-10',
          status: '新品预告',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000003.jpg',
        },
        {
          name: '钢铁侠 Mark LXXXV 战损版',
          series: '复仇者联盟4：终局之战',
          priceHKD: 2680,
          announceDate: '2026-03-25',
          status: '再版预定',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000004.jpg',
        },
        {
          name: '蝙蝠侠 黑暗骑士 1/4',
          series: '蝙蝠侠：黑暗骑士',
          priceHKD: 3280,
          announceDate: '2026-05-20',
          status: '预定中',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000005.jpg',
        },
        {
          name: '安纳金·天行者 绝地武士',
          series: '星球大战：西斯的复仇',
          priceHKD: 1780,
          announceDate: '2026-04-08',
          status: '即将出货',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000006.jpg',
        },
        {
          name: '死侍 3.0',
          series: '死侍与金刚狼',
          priceHKD: 1980,
          announceDate: '2026-06-01',
          status: '新品预告',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000007.jpg',
        },
        {
          name: '金刚狼 2.0',
          series: '死侍与金刚狼',
          priceHKD: 2080,
          announceDate: '2026-06-01',
          status: '新品预告',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000008.jpg',
        },
        {
          name: '美国队长 经典版',
          series: '美国队长4：勇敢新世界',
          priceHKD: 1880,
          announceDate: '2026-04-30',
          status: '预定中',
          image: 'https://www.hottoys.com.hk/assets/products/00000000000000000000000000000009.jpg',
        },
      ],
    },

    // Steam 游戏数据
    steam: {
      games: [
        {
          name: '博德之门 3',
          originalPrice: '¥298',
          discountPrice: '¥149',
          discount: '-50%',
          type: 'historical-low' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
        },
        {
          name: '赛博朋克 2077',
          originalPrice: '¥298',
          discountPrice: '¥119',
          discount: '-60%',
          type: 'new-low' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
        },
        {
          name: '艾尔登法环',
          originalPrice: '¥298',
          discountPrice: '¥178',
          discount: '-40%',
          type: 'daily-deal' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
        },
        {
          name: '霍格沃茨之遗',
          originalPrice: '¥384',
          discountPrice: '¥153',
          discount: '-60%',
          type: 'new-low' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
        },
        {
          name: '星空 Starfield',
          originalPrice: '¥298',
          discountPrice: '¥149',
          discount: '-50%',
          type: 'historical-low' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
        },
        {
          name: '方舟：生存飞升',
          originalPrice: '¥248',
          discountPrice: '¥99',
          discount: '-60%',
          type: 'new-low' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2399830/header.jpg',
        },
        {
          name: '怪物猎人：荒野',
          originalPrice: '¥368',
          discountPrice: '¥258',
          discount: '-30%',
          type: 'daily-deal' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2246340/header.jpg',
        },
        {
          name: '黑神话：悟空',
          originalPrice: '¥268',
          discountPrice: '¥228',
          discount: '-15%',
          type: 'daily-deal' as const,
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg',
        },
      ],
    },

    // PlayStation 折扣
    playstation: {
      deals: [
        {
          name: '最终幻想 VII 重生',
          priceHKD: 'HK$468',
          priceCNY: 416,
          discount: '-30%',
          eventName: '春季特惠',
          validUntil: '14',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202309/0600/00000000000000000000000000000000.jpg',
        },
        {
          name: '漫威蜘蛛侠 2',
          priceHKD: 'HK$323',
          priceCNY: 287,
          discount: '-50%',
          eventName: '春季特惠',
          validUntil: '14',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1300/00000000000000000000000000000000.jpg',
        },
        {
          name: '战神：诸神黄昏',
          priceHKD: 'HK$234',
          priceCNY: 208,
          discount: '-60%',
          eventName: '春季特惠',
          validUntil: '14',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/00000000000000000000000000000000.jpg',
        },
        {
          name: '黑神话：悟空',
          priceHKD: 'HK$224',
          priceCNY: 199,
          discount: '-30%',
          eventName: '春季特惠',
          validUntil: '14',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202408/0600/00000000000000000000000000000000.jpg',
        },
      ],
    },
  },

  // 图片占位符配置
  placeholders: {
    news: '/images/news-placeholder.jpg',
    game: '/images/game-placeholder.jpg',
    toy: '/images/toy-placeholder.jpg',
  },
} as const;

// 获取今日日期
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取未来日期
export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 数据新鲜度检查
export function isDataFresh(generatedAt: string, maxAgeMinutes = SKILL_CONFIG.freshnessThreshold): boolean {
  const generated = new Date(generatedAt);
  const now = new Date();
  const ageMinutes = (now.getTime() - generated.getTime()) / (1000 * 60);
  return ageMinutes < maxAgeMinutes;
}
