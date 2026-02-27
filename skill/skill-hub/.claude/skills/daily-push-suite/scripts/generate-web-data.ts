// Skill 网页数据生成器
// 在执行每日推送时，同时生成网页所需的 JSON 数据

import * as fs from 'fs';
import * as path from 'path';

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
  releaseDate: string;
  url?: string;
}

interface HotToysProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceHKD?: number;
  announceDate: string;
  url?: string;
}

interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  type: 'new-low' | 'historical-low' | 'daily-deal';
}

interface PSDeal {
  id: string;
  name: string;
  priceHKD: string;
  priceCNY?: number;
  discount: string;
  eventName: string;
  validUntil: string;
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
  generatedAt: string;
}

// 解析 skill 推送文本，提取数据
export function parsePushText(text: string): Partial<DailyPushData> {
  const data: Partial<DailyPushData> = {
    date: new Date().toISOString().split('T')[0],
    keywords: [],
    news: [],
    bandai: [],
    hotToys: [],
    steam: [],
    playstation: [],
    nintendo: { hasDeals: false, deals: [] },
    generatedAt: new Date().toISOString(),
  };

  // 提取关键词
  const keywordsMatch = text.match(/今日AI圈关键词：(.+)/);
  if (keywordsMatch) {
    data.keywords = keywordsMatch[1].split(/\s*\|\s*/).map(k => k.trim()).filter(Boolean);
  }

  // 提取 AI 新闻（简化解析）
  const newsMatches = text.matchAll(/\*\*(\d+)️⃣\s*(.+?)\*\*\s*🏷️\s*(.+?)\s*💬\s*(.+?)(?=\*\*|$)/gs);
  let rank = 1;
  for (const match of newsMatches) {
    if (data.news) {
      data.news.push({
        id: `ai-${rank}`,
        rank: rank,
        title: match[2].trim(),
        keywords: match[3].trim().split(/[,，、]/).map(k => k.trim()).filter(Boolean),
        highlight: match[4].trim(),
        url: '', // skill 输出通常没有 URL
        source: 'AI热点',
      });
      rank++;
    }
  }

  // 提取万代商品
  const bandaiMatches = text.matchAll(/•\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)/g);
  let bandaiId = 1;
  for (const match of bandaiMatches) {
    if (text.includes('万代') && data.bandai) {
      const priceStr = match[3].trim();
      const priceMatch = priceStr.match(/约?(\d+)/);
      data.bandai.push({
        id: `b${bandaiId}`,
        name: match[1].trim(),
        series: match[2].trim(),
        price: priceStr,
        priceJPY: priceMatch ? parseInt(priceMatch[1]) * 100 : undefined,
        releaseDate: match[4].trim(),
      });
      bandaiId++;
    }
  }

  // 提取 Hot Toys 商品
  const hotToysMatches = text.matchAll(/•\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)/g);
  let hotToysId = 1;
  for (const match of hotToysMatches) {
    if (text.includes('Hot Toys') && data.hotToys) {
      const priceStr = match[3].trim();
      const priceMatch = priceStr.match(/(\d+)/);
      data.hotToys.push({
        id: `h${hotToysId}`,
        name: match[1].trim(),
        series: match[2].trim(),
        price: priceStr,
        priceHKD: priceMatch ? parseInt(priceMatch[1]) : undefined,
        announceDate: match[4].trim(),
      });
      hotToysId++;
    }
  }

  return data;
}

// 保存数据到文件
export function saveWebData(data: DailyPushData): string {
  const outputDir = path.join(__dirname, '../output');

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `daily-push-${data.date}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

  return outputPath;
}

// 从网页项目路径获取数据
export function getWebDataForProject(): DailyPushData | null {
  const today = new Date().toISOString().split('T')[0];
  const outputPath = path.join(__dirname, '../output', `daily-push-${today}.json`);

  if (!fs.existsSync(outputPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
}

// CLI 用法
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === '--read') {
    const data = getWebDataForProject();
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error('No data found for today');
      process.exit(1);
    }
  } else {
    console.log('Usage: tsx generate-web-data.ts --read');
  }
}
