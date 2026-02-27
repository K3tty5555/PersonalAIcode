// 自动生成的数据文件
// 生成时间: 2026-02-27T16:19:46.253Z
// 数据来源: skill 每日推送 (V2)
// 数据质量: 置信度 100%, 新鲜度 fresh

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
  image?: string;
  publishTime?: string;
}

export interface BandaiProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceJPY?: number;
  priceCNY?: number;
  releaseDate: string;
  type?: string;
  image?: string;
  url?: string;
}

export interface HotToysProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceHKD?: number;
  priceCNY?: number;
  announceDate: string;
  status?: string;
  image?: string;
  url?: string;
}

export interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  discountPercent: number;
  type: 'new-low' | 'historical-low' | 'daily-deal';
  image?: string;
  url?: string;
}

export interface PSDeal {
  id: string;
  name: string;
  priceHKD: string;
  priceCNY?: number;
  discount: string;
  discountPercent: number;
  eventName: string;
  validUntil: string;
  image?: string;
  url?: string;
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

// 今日数据
const today = getTodayDate();
const todayCN = getTodayDateCN();

export const todayPush: DailyPush = {
  id: today,
  date: today,
  aiNews: {
    keywords: ["AI","大模型","具身智能","AI应用","硬件"],
    items: [
  {
    "id": "news-1",
    "rank": 1,
    "title": "氪星晚报｜蜜雪冰城要在河南老家建“雪王乐园”；DHL集团与京东签署谅解备忘录；日本芯片公司Rapidus获佳能、软银、索尼等公司投资",
    "keywords": [
      "AI应用",
      "自动驾驶",
      "硬件"
    ],
    "highlight": "大公司：\n  特斯拉无人驾驶技术在阿布扎比完成道路实测\n  阿布扎比综合交通中心（ITC）",
    "url": "https://36kr.com/p/3701306699017862?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 19:15:36  +0800"
  },
  {
    "id": "news-2",
    "rank": 2,
    "title": "业绩快报 | 爱奇艺2025全年营收272.9亿元，海外会员收入同比激增超30%",
    "keywords": [
      "AI",
      "大模型",
      "AIGC"
    ],
    "highlight": "2月26日，爱奇艺（NASDAQ:IQ）发布2025年第四季度及全年财报。受益于高品质多元化内容的持续供给，爱奇艺交出一份稳健的成绩单。数据显示，公司2025年全年实现总收入272.9亿元（人民币，下同），Non-GAAP运营利润6.4亿元，连续四年运营盈利。其中，第四季度总收入为67.9亿元，实现同环比双增长。\n  内容是爱奇艺发展的基石。2025年爱奇艺高品质内容接连涌现，",
    "url": "https://36kr.com/p/3701287910895495?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 16:37:01  +0800"
  },
  {
    "id": "news-3",
    "rank": 3,
    "title": "从短视频到长文：当抖音把资讯也交给AI",
    "keywords": [
      "字节",
      "AI"
    ],
    "highlight": "作者&nbsp;|&nbsp;肖思佳\n  编辑&nbsp;|&nbsp;乔芊\n  在抖音引爆短视频行业10年后，曾被视作低效、过时的长文，却重新受到关注。\n  2025年底，抖音上线长图文功能，向素人创作者和媒体机构开放深度长文创作入口，并向优质长图文提供流量扶持。目前，用户仅可通过抖音网页端，完成文章的上传与发布。\n  作为一款从“短",
    "url": "https://36kr.com/p/3700444303814536?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 11:48:42  +0800"
  },
  {
    "id": "news-4",
    "rank": 4,
    "title": "创新“新特区”，AWE2026上海新国际博览中心W3馆创新科技展区正式亮相",
    "keywords": [
      "AI",
      "大模型",
      "具身智能"
    ],
    "highlight": "在中国家电与消费电子产业规模优势持续巩固的背景下，行业正站在向结构升级和技术跃迁转变的关键节点。AWE2026选择在上海新国际博览中心这一高度成熟、产业密度最高的核心展区内，开辟一个全新的“特区型”板块——创新科技展区，以此响应产业新增长动能的需求。\n  <img data-img-size-val=\"1213,808\" src=\"h",
    "url": "https://36kr.com/p/3700996120915848?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 11:30:50  +0800"
  },
  {
    "id": "news-5",
    "rank": 5,
    "title": "给宇树做“大脑”的具身智能公司，融资数亿元，红杉中国投了",
    "keywords": [
      "AI",
      "大模型",
      "具身智能"
    ],
    "highlight": "文｜富充\n  编辑｜苏建勋\n  在我们访谈具身智能公司“中科第五纪”期间，两件事情先后发生。\n  第一件事，是2026年1月，中科第五纪获得宇树科技“核心生态合作伙伴”称号。在To B及工业场景，中科第五纪目前作为宇树机器人的“大脑”模型供应商。\n  第二件事，是中科第",
    "url": "https://36kr.com/p/3700919151538052?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 10:11:09  +0800"
  },
  {
    "id": "news-6",
    "rank": 6,
    "title": "去年出货10万件、降低打印成本80%，这家高精度金属3D打印公司连融两轮丨36氪首发",
    "keywords": [
      "具身智能",
      "机器人"
    ],
    "highlight": "作者丨欧雪\n  编辑丨袁斯来\n  硬氪获悉，高精度微米级金属3D打印企业——云耀深维（江苏）科技有限公司（以下简称“云耀深维”）完成了天使轮及Pre-A轮数千万元融资。\n  其天使轮投资方为红杉种子基金、深圳高新投及璞跃中国。Pre-A轮融资由博远资本领投，蓝郡资本跟投。资金主要用于核心技术的迭代研发、产能提升、团队扩充以及市场拓展等。\n  ",
    "url": "https://36kr.com/p/3700876701642374?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 09:37:02  +0800"
  },
  {
    "id": "news-7",
    "rank": 7,
    "title": "8点1氪丨玛莎拉蒂母公司全年净亏损1800亿元人民币；男童发育不良新药引爆股价，长春高新回应；德国总理默茨参访宇树科技",
    "keywords": [
      "AIGC",
      "图像",
      "AI应用"
    ],
    "highlight": "今日热点导览\n  德国总理默茨参访宇树科技\n  魅族被曝大量欠款成坏账\n  特斯拉中国官宣5年0息方案\n  携程集团总裁、董事双双辞职\n  微信上线新功能：同一文件多聊转发不重复占存储\n  TOP3大新闻\n  巨亏1800亿元，玛莎拉蒂母公司业绩爆雷</",
    "url": "https://36kr.com/p/3700794963193734?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-27 08:05:50  +0800"
  },
  {
    "id": "news-8",
    "rank": 8,
    "title": "氪星晚报 ｜魅族手机或将成为历史：业务实质性停摆，3月正式退市；英伟达黄仁勋：年内将寻机进行资本运作",
    "keywords": [
      "硬件",
      "芯片",
      "NVIDIA"
    ],
    "highlight": "大公司：\n  英伟达黄仁勋：年内将寻机进行资本运作\n  美东时间周三盘后，在英伟达财报电话会上，公司CEO黄仁勋表示，公司仍在持续开展股票回购和股息分红，并将在年内寻找合适的时机，把握独特的投资机会，推进相关资本运作。他还指出，生态系统投资将始终是公司资本配置的核心环节，同时我们也会持续推进战",
    "url": "https://36kr.com/p/3699924181134984?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-26 17:23:30  +0800"
  },
  {
    "id": "news-9",
    "rank": 9,
    "title": "携程的变与不变",
    "keywords": [
      "AI",
      "科技"
    ],
    "highlight": "<img data-img-size-val=\"900,931\" src=\"https://img.36krcdn.com/hsossms/20260226/v2_c433517a259b447fb20691616aa92a82@1267484143_oswg809744oswg900oswg931_img_000?x-oss-process=im",
    "url": "https://36kr.com/p/3699717997031300?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-26 16:46:02  +0800"
  },
  {
    "id": "news-10",
    "rank": 10,
    "title": "主题为科技与美学，2026亿邦新竞争力品牌大会定档四月",
    "keywords": [
      "AI",
      "科技"
    ],
    "highlight": "<img data-img-size-val=\"940,200\" src=\"https://img.36krcdn.com/hsossms/20260226/v2_4cda565601bb4171b05744d9d48ea085@5868219_oswg7347oswg940oswg200_img_000?x-oss-process=image/f",
    "url": "https://36kr.com/p/3699776528854664?f=rss",
    "source": "36氪",
    "publishTime": "2026-02-26 14:50:46  +0800"
  }
],
  },
  bandai: [
  {
    "id": "bandai-1",
    "name": "RG 1/144 RX-78-2 高达 Ver.2.1",
    "series": "机动战士高达",
    "price": "¥3,850",
    "priceJPY": 3850,
    "priceCNY": 185,
    "releaseDate": "2026-03-14",
    "type": "新品",
    "url": "https://bandai-hobby.net/item/0000/"
  },
  {
    "id": "bandai-2",
    "name": "MG 1/100 高达EX",
    "series": "机动战士高达GQuuuuuuX",
    "price": "¥8,800",
    "priceJPY": 8800,
    "priceCNY": 422,
    "releaseDate": "2026-03-21",
    "type": "新品",
    "url": "https://bandai-hobby.net/item/0001/"
  },
  {
    "id": "bandai-3",
    "name": "HG 1/144 GQuuuuuuX",
    "series": "机动战士高达GQuuuuuuX",
    "price": "¥2,750",
    "priceJPY": 2750,
    "priceCNY": 132,
    "releaseDate": "2026-03-21",
    "type": "新品",
    "url": "https://bandai-hobby.net/item/0002/"
  }
],
  hotToys: [
  {
    "id": "hottoys-1",
    "name": "蜘蛛侠 黑金战衣",
    "series": "蜘蛛侠：英雄无归",
    "price": "HK$1,880",
    "priceHKD": 1880,
    "priceCNY": 1730,
    "announceDate": "2026-03-30",
    "status": "预定中",
    "url": "https://www.hottoys.com.hk/"
  },
  {
    "id": "hottoys-2",
    "name": "曼达洛人 2.0 豪华版",
    "series": "曼达洛人 第三季",
    "price": "HK$2,180",
    "priceHKD": 2180,
    "priceCNY": 2006,
    "announceDate": "2026-04-14",
    "status": "预定中",
    "url": "https://www.hottoys.com.hk/"
  },
  {
    "id": "hottoys-3",
    "name": "蝙蝠侠 黑暗骑士 1/4",
    "series": "蝙蝠侠：黑暗骑士",
    "price": "HK$3,280",
    "priceHKD": 3280,
    "priceCNY": 3018,
    "announceDate": "2026-04-29",
    "status": "新品预告",
    "url": "https://www.hottoys.com.hk/"
  }
],
  gameDeals: {
    steam: [
  {
    "id": "steam-1",
    "name": "赛博朋克 2077",
    "originalPrice": "¥298",
    "discountPrice": "¥119",
    "discount": "-60%",
    "discountPercent": 60,
    "type": "new-low",
    "url": "https://store.steampowered.com/app/1091500"
  },
  {
    "id": "steam-2",
    "name": "博德之门 3",
    "originalPrice": "¥298",
    "discountPrice": "¥149",
    "discount": "-50%",
    "discountPercent": 50,
    "type": "historical-low",
    "url": "https://store.steampowered.com/app/1086940"
  },
  {
    "id": "steam-3",
    "name": "艾尔登法环",
    "originalPrice": "¥298",
    "discountPrice": "¥178",
    "discount": "-40%",
    "discountPercent": 40,
    "type": "daily-deal",
    "url": "https://store.steampowered.com/app/1245620"
  },
  {
    "id": "steam-4",
    "name": "霍格沃茨之遗",
    "originalPrice": "¥384",
    "discountPrice": "¥153",
    "discount": "-60%",
    "discountPercent": 60,
    "type": "new-low",
    "url": "https://store.steampowered.com/app/990080"
  }
],
    playstation: [
  {
    "id": "ps-1",
    "name": "最终幻想 VII 重生",
    "priceHKD": "HK$468",
    "priceCNY": 431,
    "discount": "-30%",
    "discountPercent": 30,
    "eventName": "春季特惠",
    "validUntil": "2026-03-14",
    "url": "https://store.playstation.com/zh-hans-hk/product/"
  },
  {
    "id": "ps-2",
    "name": "漫威蜘蛛侠 2",
    "priceHKD": "HK$323",
    "priceCNY": 297,
    "discount": "-50%",
    "discountPercent": 50,
    "eventName": "春季特惠",
    "validUntil": "2026-03-14",
    "url": "https://store.playstation.com/zh-hans-hk/product/"
  },
  {
    "id": "ps-3",
    "name": "战神：诸神黄昏",
    "priceHKD": "HK$234",
    "priceCNY": 215,
    "discount": "-60%",
    "discountPercent": 60,
    "eventName": "春季特惠",
    "validUntil": "2026-03-14",
    "url": "https://store.playstation.com/zh-hans-hk/product/"
  },
  {
    "id": "ps-4",
    "name": "黑神话：悟空",
    "priceHKD": "HK$224",
    "priceCNY": 206,
    "discount": "-30%",
    "discountPercent": 30,
    "eventName": "春季特惠",
    "validUntil": "2026-03-14",
    "url": "https://store.playstation.com/zh-hans-hk/product/"
  }
],
    nintendo: {
  "hasDeals": false,
  "deals": [],
  "note": "本周暂无特别优惠活动，建议关注下周的例行折扣更新"
},
  },
};

// 历史数据
export const historyPushes: DailyPush[] = [
  todayPush,
];

// 汇率数据
export const exchangeRates = {
  jpy: 0.048,
  hkd: 0.92,
};
