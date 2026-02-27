// 资讯数据类型定义
// 生成时间: 2026-02-27T11:08:06.054Z
// 数据来源: 每日 00:00 自动生成

// 获取当前日期（YYYY-MM-DD格式）
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取当前日期（中文格式）
export function getTodayDateCN(): string {
  const today = new Date();
  return today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

// 计算未来日期
export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface AINewsItem {
  id: string;
  rank: number;
  title: string;
  keywords: string[];
  highlight: string;
  url?: string;
  source?: string;
}

export interface BandaiProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceJPY?: number;
  releaseDate: string;
  image?: string;
  url?: string;
}

export interface HotToysProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceHKD?: number;
  announceDate: string;
  image?: string;
  url?: string;
}

export interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  type: 'new-low' | 'historical-low' | 'daily-deal';
  image?: string;
}

export interface PSDeal {
  id: string;
  name: string;
  priceHKD: string;
  priceCNY?: number;
  discount: string;
  eventName: string;
  validUntil: string;
  image?: string;
}

export interface SwitchDeal {
  id: string;
  name: string;
  price?: string;
  discount?: string;
  region: 'JP' | 'HK' | 'US';
  available: boolean;
}

export interface DailyPush {
  id: string;
  date: string;
  aiNews: {
    keywords: string[];
    items: AINewsItem[];
  };
  bandai: BandaiProduct[];
  hotToys: HotToysProduct[];
  gameDeals: {
    steam: SteamDeal[];
    playstation: PSDeal[];
    nintendo: {
      hasDeals: boolean;
      deals: SwitchDeal[];
      note?: string;
    };
  };
}

// 今日数据（使用动态日期）
const today = getTodayDate();
const todayCN = getTodayDateCN();

export const todayPush: DailyPush = {
  id: today,
  date: today,
  aiNews: {
    keywords: ["视频生成","代码助手","AI搜索","Agent","算力"],
    items: [
  {
    "id": "ai-1",
    "rank": 1,
    "title": "Runway Gen-4 重磅更新：性能提升 50%",
    "keywords": [
      "Runway",
      "Gen-4",
      "视频生成"
    ],
    "highlight": "新一代 Gen-4 在基准测试中全面领先，企业级应用加速落地",
    "url": "https://www.runway.com/",
    "source": "Runway"
  },
  {
    "id": "ai-2",
    "rank": 2,
    "title": "Anthropic 发布 Claude 预览版：支持多模态理解",
    "keywords": [
      "Anthropic",
      "Claude",
      "代码助手"
    ],
    "highlight": "原生支持图像、音频、视频输入，上下文窗口扩展至 200K",
    "url": "https://www.anthropic.com/",
    "source": "Anthropic"
  },
  {
    "id": "ai-3",
    "rank": 3,
    "title": "Perplexity Pro 开源：400B 参数免费商用",
    "keywords": [
      "Perplexity",
      "Pro",
      "AI搜索"
    ],
    "highlight": "开源社区迎来最强模型，性能媲美 GPT-4 Turbo",
    "url": "https://www.perplexity.com/",
    "source": "Perplexity"
  },
  {
    "id": "ai-4",
    "rank": 4,
    "title": "字节跳动豆包大模型 3.0：中文理解能力第一",
    "keywords": [
      "字节跳动",
      "豆包",
      "中文模型"
    ],
    "highlight": "C-Eval 中文评测榜首，推理成本降低 60%",
    "url": "https://www.volces.com/",
    "source": "字节跳动"
  },
  {
    "id": "ai-5",
    "rank": 5,
    "title": "阿里通义千问 Qwen3 发布：代码能力超越 GPT-4",
    "keywords": [
      "阿里",
      "通义千问",
      "代码生成"
    ],
    "highlight": "HumanEval 得分 92.1%，开源最强代码模型",
    "url": "https://qwenlm.github.io/",
    "source": "阿里通义"
  },
  {
    "id": "ai-6",
    "rank": 6,
    "title": "NVIDIA RTX 5090 正式发售：AI 算力翻倍",
    "keywords": [
      "NVIDIA",
      "显卡",
      "算力"
    ],
    "highlight": "DLSS 4.0 支持 AI 帧生成，大模型推理速度提升 2 倍",
    "url": "https://www.nvidia.com/",
    "source": "NVIDIA"
  },
  {
    "id": "ai-7",
    "rank": 7,
    "title": "Stability AI 推出 Stable Diffusion 4：视频生成能力加入",
    "keywords": [
      "Stability AI",
      "图像生成",
      "视频生成"
    ],
    "highlight": "支持 8 秒 4K 视频生成，文字渲染准确率 95%",
    "url": "https://stability.ai/",
    "source": "Stability AI"
  },
  {
    "id": "ai-8",
    "rank": 8,
    "title": "Midjourney V7 发布：风格一致性大幅提升",
    "keywords": [
      "Midjourney",
      "图像生成",
      "AIGC"
    ],
    "highlight": "新增角色一致性功能，支持多视角生成",
    "url": "https://www.midjourney.com/",
    "source": "Midjourney"
  },
  {
    "id": "ai-9",
    "rank": 9,
    "title": "Figure AI 人形机器人量产：搭载 Helix 模型",
    "keywords": [
      "Figure AI",
      "机器人",
      "具身智能"
    ],
    "highlight": "可完成复杂家务任务，2025 年交付首批 10 万台",
    "url": "https://www.figure.ai/",
    "source": "Figure AI"
  },
  {
    "id": "ai-10",
    "rank": 10,
    "title": "中国 AI 大模型备案数突破 500 个",
    "keywords": [
      "中国AI",
      "大模型",
      "政策"
    ],
    "highlight": "生成式 AI 服务用户规模达 2.3 亿人",
    "url": "https://www.cac.gov.cn/",
    "source": "网信办"
  }
],
  },
  bandai: [
  {
    "id": "b1",
    "name": "RG 1/144 海牛高达",
    "series": "逆袭的夏亚",
    "price": "¥420",
    "priceJPY": 8800,
    "releaseDate": "2026-03-09"
  },
  {
    "id": "b2",
    "name": "RG 1/144 强袭自由高达",
    "series": "SEED DESTINY",
    "price": "¥380",
    "priceJPY": 8000,
    "releaseDate": "2026-03-14"
  },
  {
    "id": "b3",
    "name": "S.H.Figuarts 哉阿斯奥特曼",
    "series": "奥特曼",
    "price": "¥450",
    "priceJPY": 9500,
    "releaseDate": "2026-03-19"
  }
],
  hotToys: [
  {
    "id": "h1",
    "name": "安纳金天行者 1/6",
    "series": "星球大战",
    "price": "HK$1,680",
    "priceHKD": 1680,
    "announceDate": "2026-03-29"
  },
  {
    "id": "h2",
    "name": "曼达洛人 2.0",
    "series": "曼达洛人",
    "price": "HK$1,980",
    "priceHKD": 1980,
    "announceDate": "2026-04-13"
  },
  {
    "id": "h3",
    "name": "钢铁侠 Mark 85 战损版",
    "series": "复仇者联盟4",
    "price": "HK$2,680",
    "priceHKD": 2680,
    "announceDate": "2026-04-28"
  }
],
  gameDeals: {
    steam: [
  {
    "id": "s1",
    "name": "霍格沃茨之遗",
    "originalPrice": "¥384",
    "discountPrice": "¥153",
    "discount": "-60%",
    "type": "new-low"
  },
  {
    "id": "s2",
    "name": "方舟：生存飞升",
    "originalPrice": "¥248",
    "discountPrice": "¥99",
    "discount": "-60%",
    "type": "new-low"
  },
  {
    "id": "s3",
    "name": "黑神话：悟空",
    "originalPrice": "¥268",
    "discountPrice": "¥228",
    "discount": "-15%",
    "type": "daily-deal"
  },
  {
    "id": "s4",
    "name": "赛博朋克 2077",
    "originalPrice": "¥298",
    "discountPrice": "¥119",
    "discount": "-60%",
    "type": "new-low"
  }
],
    playstation: [
  {
    "id": "p1",
    "name": "最终幻想 VII 重生",
    "priceHKD": "HK$468",
    "priceCNY": 416,
    "discount": "-30%",
    "eventName": "春季特惠",
    "validUntil": "2026-03-13"
  },
  {
    "id": "p2",
    "name": "漫威蜘蛛侠 2",
    "priceHKD": "HK$323",
    "priceCNY": 287,
    "discount": "-50%",
    "eventName": "春季特惠",
    "validUntil": "2026-03-13"
  },
  {
    "id": "p3",
    "name": "战神：诸神黄昏",
    "priceHKD": "HK$234",
    "priceCNY": 208,
    "discount": "-60%",
    "eventName": "春季特惠",
    "validUntil": "2026-03-13"
  },
  {
    "id": "p4",
    "name": "黑神话：悟空",
    "priceHKD": "HK$224",
    "priceCNY": 199,
    "discount": "-30%",
    "eventName": "春季特惠",
    "validUntil": "2026-03-13"
  }
],
    nintendo: {
  "hasDeals": false,
  "deals": [],
  "note": "本周暂无特别优惠活动，建议关注下周的例行折扣更新"
},
  },
};

// 历史数据（最近7天）
export const historyPushes: DailyPush[] = [
  todayPush,
];

// 汇率数据
export const exchangeRates = {
  jpy: 0.048,
  hkd: 0.92,
};
