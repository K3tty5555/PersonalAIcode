// 从 skill 推送更新网站数据
// 运行时机：skill 完成每日三轮推送后
// 用法：npx tsx scripts/update-from-skill.ts "推送文本内容"

import * as fs from 'fs';
import * as path from 'path';

const SKILL_DATA_PATH = path.join(__dirname, '../../skill/skill-hub/.claude/skills/daily-push-suite/output');
const DATA_TS_PATH = path.join(__dirname, '../lib/data.ts');

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

// 解析 skill 推送文本
function parsePushText(text: string) {
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
  const newsMatches = text.matchAll(/\*\*[\d１２３４５６７８９０][️⃣]?\s*(.+?)\*\*[\s\n]*🏷️\s*(.+?)[\s\n]*💬\s*(.+?)(?=\*\*[\d１２３４５６７８９０]|$)/g);
  let rank = 1;
  for (const match of newsMatches) {
    data.news.push({
      id: `ai-${rank}`,
      rank: rank,
      title: match[1].trim(),
      keywords: match[2].trim().split(/[,，、]/).map((k: string) => k.trim()).filter(Boolean),
      highlight: match[3].trim(),
      url: '',
      source: 'AI热点',
    });
    rank++;
  }

  // 提取万代商品
  const bandaiMatches = text.matchAll(/•\s*\*\*(.+?)\*\*\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+)/g);
  let bandaiId = 1;
  for (const match of bandaiMatches) {
    if (text.indexOf('🎌') < text.indexOf(match[0]) && text.indexOf(match[0]) < text.indexOf('🔥')) {
      const priceStr = match[3].trim();
      const priceMatch = priceStr.match(/约?¥?([\d,]+)/);
      const jpy = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : undefined;

      data.bandai.push({
        id: `b${bandaiId}`,
        name: match[1].trim(),
        series: match[2].trim(),
        price: priceStr,
        priceJPY: jpy,
        priceCNY: jpy ? Math.round(jpy * 0.048) : undefined,
        releaseDate: match[4].trim(),
        type: '新品',
      });
      bandaiId++;
    }
  }

  // 提取 Hot Toys 商品（在 🔥 Hot Toys 之后）
  const hotToysSection = text.match(/🔥\s*\*\*Hot Toys[\s\S]+?(?=━━━|$)/);
  if (hotToysSection) {
    const hotToysMatches = hotToysSection[0].matchAll(/•\s*\*\*(.+?)\*\*\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+?)\s*[|｜]\s*(.+)/g);
    let hotToysId = 1;
    for (const match of hotToysMatches) {
      const priceStr = match[3].trim();
      // 匹配 "约2,680港币" 或 "HK$2,680" 格式
      const priceMatch = priceStr.match(/约?([\d,]+)\s*港币/);
      const hkd = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : undefined;

      data.hotToys.push({
        id: `h${hotToysId}`,
        name: match[1].trim(),
        series: match[2].trim(),
        price: hkd ? `HK$${hkd.toLocaleString()}` : priceStr,
        priceHKD: hkd,
        priceCNY: hkd ? Math.round(hkd * 0.92) : undefined,
        announceDate: match[4].trim(),
        status: '预定中',
      });
      hotToysId++;
    }
  }

  return data;
}

// 生成 data.ts 内容
function generateDataTS(data: ReturnType<typeof parsePushText>): string {
  return `// 资讯数据类型定义
// 生成时间: ${new Date().toISOString()}
// 数据来源: skill 每日推送

export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return \`\${year}-\${month}-\${day}\`;
}

export function getTodayDateCN(): string {
  const today = new Date();
  return today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

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
    ],
    nintendo: {
      hasDeals: false,
      deals: [],
      note: '本周暂无特别优惠活动',
    },
  },
};

export const historyPushes: DailyPush[] = [todayPush];

export const exchangeRates = {
  jpy: 0.048,
  hkd: 0.92,
};
`;
}

// 主函数
function main() {
  const pushText = process.argv[2];

  if (!pushText) {
    console.log('用法: npx tsx scripts/update-from-skill.ts "推送文本"');
    console.log('或者设置环境变量 SKILL_PUSH_TEXT');
    process.exit(1);
  }

  console.log('🔄 正在解析 skill 推送数据...');
  const data = parsePushText(pushText);

  console.log('📝 生成 data.ts 文件...');
  const dataTS = generateDataTS(data);

  fs.writeFileSync(DATA_TS_PATH, dataTS, 'utf-8');

  console.log('✅ 已更新网站数据！');
  console.log(`📊 AI热点: ${data.news.length} 条`);
  console.log(`🎌 万代: ${data.bandai.length} 款`);
  console.log(`🔥 Hot Toys: ${data.hotToys.length} 款`);
  console.log('\n下一步: 运行 npm run build 重新构建网站');
}

// 如果设置了环境变量，自动执行
if (process.env.SKILL_PUSH_TEXT) {
  main();
} else if (require.main === module) {
  main();
}

export { parsePushText, generateDataTS };
