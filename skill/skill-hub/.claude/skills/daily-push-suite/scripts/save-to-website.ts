// Skill 推送数据保存到网站项目
// 在 skill 执行完三轮推送后自动运行
// 支持从推送文本或 JSON 文件读取数据

import * as fs from 'fs';
import * as path from 'path';

// 网站项目数据文件路径
const WEBSITE_DATA_PATH = path.join(__dirname, '../../../../../daily-push-web/lib/data.ts');
const SKILL_OUTPUT_DIR = path.join(__dirname, '../output');

// 数据类型定义
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

interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  type: 'new-low' | 'historical-low' | 'daily-deal';
  image?: string;
}

interface PSDeal {
  id: string;
  name: string;
  priceHKD: string;
  priceCNY?: number;
  discount: string;
  eventName: string;
  validUntil: string;
  image?: string;
}

interface SwitchDeal {
  id: string;
  name: string;
  price?: string;
  discount?: string;
  region: 'JP' | 'HK' | 'US';
  available: boolean;
}

interface DailyPushData {
  date: string;
  keywords: string[];
  news: NewsItem[];
  bandai: BandaiProduct[];
  hotToys: HotToysProduct[];
  steam: SteamDeal[];
  playstation: PSDeal[];
  nintendo: {
    hasDeals: boolean;
    deals: SwitchDeal[];
    note?: string;
  };
}

// 获取今日日期
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 计算未来日期
function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 从 JSON 文件读取今日数据
function readTodayData(): DailyPushData | null {
  const today = getTodayDate();
  const jsonPath = path.join(SKILL_OUTPUT_DIR, `daily-push-${today}.json`);

  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️ 今日数据文件不存在: ${jsonPath}`);
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`✅ 从 JSON 文件读取数据: ${jsonPath}`);
    return data;
  } catch (error) {
    console.error(`❌ 读取 JSON 文件失败:`, error);
    return null;
  }
}

// 从推送文本解析数据
function parseFullPushText(text: string): DailyPushData {
  const today = getTodayDate();

  const data: DailyPushData = {
    date: today,
    keywords: [],
    news: [],
    bandai: [],
    hotToys: [],
    steam: [],
    playstation: [],
    nintendo: { hasDeals: false, deals: [], note: '本周暂无特别优惠活动' },
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

  // 提取游戏折扣（简化解析，实际应从 gameDeals 部分详细解析）
  const gameSection = text.match(/🎮\s*\*\*.+?游戏折扣[\s\S]+?(?=━━━|$)/);
  if (gameSection) {
    // Steam 新史低
    const newLowMatches = gameSection[0].matchAll(/🔥\s*新史低\s*\n((?:•.+\n?)+)/);
    const historicalMatches = gameSection[0].matchAll(/📉\s*史低\s*\n((?:•.+\n?)+)/);
    const dailyMatches = gameSection[0].matchAll(/⭐\s*每日特惠\s*\n((?:•.+\n?)+)/);

    // 解析游戏列表
    let steamId = 1;
    const steamGames: SteamDeal[] = [];

    // 解析新史低
    for (const match of newLowMatches) {
      const lines = match[1].split('\n').filter(l => l.trim().startsWith('•'));
      for (const line of lines) {
        const gameMatch = line.match(/•\s*(.+?)\s*——\s*(.+)/);
        if (gameMatch) {
          steamGames.push({
            id: `s${steamId++}`,
            name: gameMatch[1].trim(),
            originalPrice: '',
            discountPrice: gameMatch[2].trim(),
            discount: '',
            type: 'new-low',
          });
        }
      }
    }

    data.steam = steamGames.slice(0, 6);
  }

  return data;
}

// 生成 data.ts 文件内容
function generateDataTS(data: DailyPushData): string {
  const today = getTodayDate();

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
    steam: ${JSON.stringify(data.steam.slice(0, 6), null, 2)},
    playstation: ${JSON.stringify(data.playstation.slice(0, 4), null, 2)},
    nintendo: ${JSON.stringify(data.nintendo, null, 2)},
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

// 保存同步状态记录
function saveSyncStatus(status: { success: boolean; date: string; timestamp: string; error?: string }) {
  const statusPath = path.join(SKILL_OUTPUT_DIR, 'sync-status.json');
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');
}

// 主函数：保存到网站
export function saveToWebsite(input?: string): boolean {
  try {
    console.log('🚀 开始同步数据到网站项目...');
    console.log(`📅 今日日期: ${getTodayDate()}`);

    let data: DailyPushData | null = null;

    // 优先尝试从 JSON 文件读取
    data = readTodayData();

    // 如果 JSON 不存在且提供了文本，从文本解析
    if (!data && input) {
      console.log('📝 从推送文本解析数据...');
      data = parseFullPushText(input);
    }

    if (!data) {
      throw new Error('没有可用的数据源（JSON 文件或推送文本）');
    }

    // 验证数据完整性
    if (data.news.length === 0) {
      console.warn('⚠️ 警告: AI 新闻数据为空');
    }

    console.log('📝 生成 data.ts 文件...');
    const dataTS = generateDataTS(data);

    // 确保目录存在
    const dir = path.dirname(WEBSITE_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(WEBSITE_DATA_PATH, dataTS, 'utf-8');

    // 保存同步状态
    saveSyncStatus({
      success: true,
      date: getTodayDate(),
      timestamp: new Date().toISOString(),
    });

    console.log('✅ 已同步到网站项目:', WEBSITE_DATA_PATH);
    console.log(`📊 AI热点: ${data.news.length} 条`);
    console.log(`🎌 万代: ${data.bandai.length} 款`);
    console.log(`🔥 Hot Toys: ${data.hotToys.length} 款`);
    console.log(`🎮 Steam折扣: ${data.steam.length} 款`);

    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ 同步失败:', errorMsg);

    saveSyncStatus({
      success: false,
      date: getTodayDate(),
      timestamp: new Date().toISOString(),
      error: errorMsg,
    });

    return false;
  }
}

// CLI 用法
if (require.main === module) {
  const pushText = process.env.SKILL_PUSH_TEXT || process.argv[2];
  const success = saveToWebsite(pushText);
  process.exit(success ? 0 : 1);
}
