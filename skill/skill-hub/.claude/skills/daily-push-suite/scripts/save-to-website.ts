// Skill 推送数据保存到网站项目
// 在 skill 执行完三轮推送后运行此脚本

import * as fs from 'fs';
import * as path from 'path';

// 网站项目数据文件路径
const WEBSITE_DATA_PATH = path.join(__dirname, '../../../../../daily-push-web/lib/data.ts');

interface NewsItem {
  id: string;
  rank: number;
  title: string;
  keywords: string[];
  highlight: string;
  url: string;
  source: string;
}

interface BandaiProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceJPY?: number;
  priceCNY?: number;
  releaseDate: string;
  type?: string;
}

interface HotToysProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceHKD?: number;
  priceCNY?: number;
  announceDate: string;
  status?: string;
}

// 解析完整的 skill 推送文本
export function parseFullPushText(text: string) {
  const today = new Date().toISOString().split('T')[0];

  const data: {
    date: string;
    keywords: string[];
    news: NewsItem[];
    bandai: BandaiProduct[];
    hotToys: HotToysProduct[];
  } = {
    date: today,
    keywords: [],
    news: [],
    bandai: [],
    hotToys: [],
  };

  // 提取 AI 关键词
  const keywordsMatch = text.match(/今日AI圈关键词[:：](.+)/);
  if (keywordsMatch) {
    data.keywords = keywordsMatch[1].split(/[|｜]/).map(k => k.trim()).filter(Boolean);
  }

  // 提取 AI 新闻
  const newsSection = text.match(/📰\s*\*\*.+?\*\*([\s\S]+?)(?=━━━|📅|$)/);
  if (newsSection) {
    const newsMatches = newsSection[1].matchAll(/\*\*[\d１２３４５６７８９０][️⃣]?\s*(.+?)\*\*[\s\n]*🏷️\s*(.+?)[\s\n]*💬\s*(.+?)(?=\*\*[\d１２３４５６７８９０]|$)/g);
    let rank = 1;
    for (const match of newsMatches) {
      data.news.push({
        id: `ai-${rank}`,
        rank: rank,
        title: match[1].trim(),
        keywords: match[2].trim().split(/[,，、]/).map(k => k.trim()).filter(Boolean),
        highlight: match[3].trim(),
        url: '',
        source: 'AI热点',
      });
      rank++;
    }
  }

  // 提取万代商品（在 🎌 万代 和 🔥 Hot Toys 之间）
  const bandaiSection = text.match(/🎌\s*\*\*万代[\s\S]+?(?=🔥\s*\*\*Hot Toys|$)/);
  if (bandaiSection) {
    const bandaiMatches = bandaiSection[0].matchAll(/•\s*\*\*(.+?)\*\*\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+)/g);
    let id = 1;
    for (const match of bandaiMatches) {
      const priceStr = match[3].trim();
      const priceMatch = priceStr.match(/约?¥?([\d,]+)/);
      const jpy = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : undefined;

      data.bandai.push({
        id: `b${id}`,
        name: match[1].trim(),
        series: match[2].trim(),
        price: priceStr,
        priceJPY: jpy,
        priceCNY: jpy ? Math.round(jpy * 0.048) : undefined,
        releaseDate: match[4].trim(),
        type: '新品',
      });
      id++;
    }
  }

  // 提取 Hot Toys 商品（在 🔥 Hot Toys 之后）
  const hotToysSection = text.match(/🔥\s*\*\*Hot Toys[\s\S]+?(?=━━━|$)/);
  if (hotToysSection) {
    const hotToysMatches = hotToysSection[0].matchAll(/•\s*\*\*(.+?)\*\*\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+)/g);
    let id = 1;
    for (const match of hotToysMatches) {
      const priceStr = match[3].trim();
      // 匹配 "约2,680港币" 格式
      const priceMatch = priceStr.match(/约?([\d,]+)\s*港币/);
      const hkd = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : undefined;

      data.hotToys.push({
        id: `h${id}`,
        name: match[1].trim(),
        series: match[2].trim(),
        price: hkd ? `HK$${hkd.toLocaleString()}` : priceStr,
        priceHKD: hkd,
        priceCNY: hkd ? Math.round(hkd * 0.92) : undefined,
        announceDate: match[4].trim(),
        status: '预定中',
      });
      id++;
    }
  }

  return data;
}

// 生成 data.ts 文件内容
function generateDataTS(data: typeof parseFullPushText extends (...args: any[]) => infer R ? R : never): string {
  return `// 资讯数据类型定义
// 生成时间: ${new Date().toISOString()}
// 数据来源: skill 每日推送

// 获取当前日期（YYYY-MM-DD格式）
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return \`\${year}-\${month}-\${day}\`;
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
  return \`\${year}-\${month}-\${day}\`;
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

// 今日数据（来自 skill 推送）
const today = getTodayDate();
const todayCN = getTodayDateCN();

export const todayPush: DailyPush = {
  id: today,
  date: today,
  aiNews: {
    keywords: ${JSON.stringify(data.keywords)},
    items: ${JSON.stringify(data.news, null, 2)},
  },
  bandai: ${JSON.stringify(data.bandai, null, 2)},
  hotToys: ${JSON.stringify(data.hotToys, null, 2)},
  gameDeals: {
    steam: [
      {
        id: 's1',
        name: '博德之门 3',
        originalPrice: '¥298',
        discountPrice: '¥149',
        discount: '-50%',
        type: 'historical-low',
      },
      {
        id: 's2',
        name: '赛博朋克 2077',
        originalPrice: '¥298',
        discountPrice: '¥119',
        discount: '-60%',
        type: 'new-low',
      },
      {
        id: 's3',
        name: '艾尔登法环',
        originalPrice: '¥298',
        discountPrice: '¥178',
        discount: '-40%',
        type: 'daily-deal',
      },
      {
        id: 's4',
        name: '霍格沃茨之遗',
        originalPrice: '¥384',
        discountPrice: '¥153',
        discount: '-60%',
        type: 'new-low',
      },
    ],
    playstation: [
      {
        id: 'p1',
        name: '最终幻想 VII 重生',
        priceHKD: 'HK$468',
        priceCNY: 416,
        discount: '-30%',
        eventName: '春季特惠',
        validUntil: getFutureDate(14),
      },
      {
        id: 'p2',
        name: '漫威蜘蛛侠 2',
        priceHKD: 'HK$323',
        priceCNY: 287,
        discount: '-50%',
        eventName: '春季特惠',
        validUntil: getFutureDate(14),
      },
    ],
    nintendo: {
      hasDeals: false,
      deals: [],
      note: '本周暂无特别优惠活动',
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
`;
}

// 主函数：保存到网站
export function saveToWebsite(pushText: string): void {
  console.log('🔄 解析 skill 推送数据...');
  const data = parseFullPushText(pushText);

  console.log('📝 生成 data.ts 文件...');
  const dataTS = generateDataTS(data);

  // 确保目录存在
  const dir = path.dirname(WEBSITE_DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(WEBSITE_DATA_PATH, dataTS, 'utf-8');

  console.log('✅ 已同步到网站项目:', WEBSITE_DATA_PATH);
  console.log(`📊 AI热点: ${data.news.length} 条`);
  console.log(`🎌 万代: ${data.bandai.length} 款`);
  console.log(`🔥 Hot Toys: ${data.hotToys.length} 款`);
}

// CLI 用法
if (require.main === module) {
  const pushText = process.env.SKILL_PUSH_TEXT || process.argv[2];

  if (!pushText) {
    console.error('请提供推送文本，或通过环境变量 SKILL_PUSH_TEXT 传入');
    process.exit(1);
  }

  saveToWebsite(pushText);
}
