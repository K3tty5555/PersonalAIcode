// Skill 数据生成器 - 统一入口
// 整合新闻(每日) + 商品(每月) + 游戏折扣(实时)

import * as fs from 'fs';
import * as path from 'path';
import { fetchAllNews, validateNewsData, checkDataFreshness, type NewsItem as FetcherNewsItem } from './fetcher';
import { fetchAllProductData, type BandaiProduct, type HotToysProduct, type SteamDeal, type PSDeal, type NintendoData } from './fetcher-v2';

// 配置
const CONFIG = {
  outputDir: './lib',
  filePrefix: 'daily-data',
};

// 数据类型
export interface NewsItem {
  id: string;
  rank: number;
  title: string;
  keywords: string[];
  highlight: string;
  url: string;
  source: string;
  image?: string;
  publishTime?: string;
}

export interface DailyPushData {
  date: string;
  yearMonth: string;
  keywords: string[];
  news: NewsItem[];
  bandai: BandaiProduct[];
  hotToys: HotToysProduct[];
  steam: SteamDeal[];
  playstation: PSDeal[];
  nintendo: NintendoData;
  generatedAt: string;
  dataQuality: {
    freshness: 'fresh' | 'warning' | 'stale';
    sources: string[];
    confidence: number;
  };
}

// 获取日期
export function getTodayDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// 融合新闻数据
function mergeNews(rawNews: FetcherNewsItem[]): NewsItem[] {
  return rawNews.slice(0, 10).map((item, index) => ({
    id: `news-${index + 1}`,
    rank: index + 1,
    title: item.title,
    keywords: item.tags.length > 0 ? item.tags : ['AI', '科技'],
    highlight: item.summary || '点击了解更多详情',
    url: item.url,
    source: item.source,
    image: item.cover,
    publishTime: item.publishTime,
  }));
}

// 生成关键词
function generateKeywords(news: NewsItem[]): string[] {
  const keywordCount = new Map<string, number>();
  news.forEach((item) => {
    item.keywords.forEach((kw) => {
      keywordCount.set(kw, (keywordCount.get(kw) || 0) + 1);
    });
  });

  return Array.from(keywordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kw]) => kw);
}

// 备用新闻
function generateBackupNews(date: string): NewsItem[] {
  return [
    {
      id: 'backup-1',
      rank: 1,
      title: `${date} AI行业热点回顾`,
      keywords: ['AI', '行业动态'],
      highlight: '今日人工智能领域最新动态汇总，点击搜索获取实时资讯',
      url: 'https://36kr.com/search/articles/AI',
      source: '36氪',
    },
    {
      id: 'backup-2',
      rank: 2,
      title: '国内大模型最新进展',
      keywords: ['大模型', '国产AI'],
      highlight: '文心一言、通义千问、豆包等国产大模型更新',
      url: 'https://www.zhihu.com/search?type=content&q=大模型',
      source: '知乎',
    },
  ];
}

// 校验数据
async function validateData(data: DailyPushData): Promise<{ valid: boolean; corrections: string[] }> {
  const corrections: string[] = [];

  // 校验新闻
  const newsValidation = validateNewsData(data.news);
  if (!newsValidation.valid) {
    corrections.push(...newsValidation.errors);
    data.news = newsValidation.corrected;
  }

  // 补充新闻数量
  if (data.news.length < 5) {
    const backup = generateBackupNews(data.date);
    let rank = data.news.length + 1;
    backup.forEach((item) => {
      if (data.news.length < 10) {
        data.news.push({ ...item, rank: rank++ });
      }
    });
    corrections.push('已补充备用新闻数据');
  }

  // 重新生成关键词
  if (data.keywords.length === 0) {
    data.keywords = generateKeywords(data.news);
    corrections.push('关键词已重新生成');
  }

  // 检查新鲜度
  const freshness = checkDataFreshness(data.generatedAt, 120);
  data.dataQuality.freshness = freshness.isFresh ? 'fresh' : freshness.age > 60 ? 'warning' : 'stale';

  return { valid: corrections.length === 0, corrections };
}

// 计算置信度
function calculateConfidence(data: DailyPushData): number {
  let score = 0;

  const uniqueSources = new Set(data.news.map((n) => n.source)).size;
  score += uniqueSources * 10;
  score += Math.min(data.news.length * 5, 30);
  if (data.bandai.length > 0) score += 15;
  if (data.hotToys.length > 0) score += 15;
  if (data.steam.length > 0) score += 10;
  if (data.playstation.length > 0) score += 10;
  if (data.keywords.length >= 3) score += 10;

  return Math.min(score, 100);
}

// 主生成函数
export async function generateDailyData(date?: string): Promise<DailyPushData> {
  const today = date || getTodayDate();
  const yearMonth = today.slice(0, 7);

  console.log(`📅 生成日期: ${today}\n`);

  // 并行获取数据
  console.log('🔍 获取资讯数据...');
  const newsData = await fetchAllNews();

  console.log('🎮 获取商品数据...');
  const productData = await fetchAllProductData();

  // 融合数据
  const news = mergeNews(newsData);
  const keywords = generateKeywords(news);

  const data: DailyPushData = {
    date: today,
    yearMonth,
    keywords,
    news,
    bandai: productData.bandai,
    hotToys: productData.hotToys,
    steam: productData.steam,
    playstation: productData.playstation,
    nintendo: productData.nintendo,
    generatedAt: new Date().toISOString(),
    dataQuality: {
      freshness: 'fresh',
      sources: [],
      confidence: 0,
    },
  };

  // 记录来源
  const sources: string[] = [];
  if (newsData.length > 0) sources.push('36氪');
  if (productData.bandai.length > 0) sources.push('万代官网');
  if (productData.hotToys.length > 0) sources.push('Hot Toys');
  if (productData.steam.length > 0) sources.push('Steam');
  if (productData.playstation.length > 0) sources.push('PlayStation');
  data.dataQuality.sources = sources;

  // 校验
  console.log('\n🔍 数据校验...');
  const validation = await validateData(data);
  if (validation.corrections.length > 0) {
    console.log('✅ 已纠正:', validation.corrections.join(', '));
  }

  // 计算置信度
  data.dataQuality.confidence = calculateConfidence(data);

  return data;
}

// 保存数据
export function saveData(data: DailyPushData): string {
  const outputDir = path.resolve(process.cwd(), CONFIG.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 保存JSON
  const jsonPath = path.join(outputDir, `${CONFIG.filePrefix}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

  // 保存状态
  const statusPath = path.join(outputDir, 'sync-status.json');
  const status = {
    success: true,
    date: data.date,
    source: 'skill',
    isFresh: data.dataQuality.freshness === 'fresh',
    confidence: data.dataQuality.confidence,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');

  console.log(`\n💾 数据已保存:`);
  console.log(`   JSON: ${jsonPath}`);
  console.log(`   Status: ${statusPath}`);

  return jsonPath;
}

// 生成TypeScript类型文件
export function generateTypes(data: DailyPushData): void {
  const outputDir = path.resolve(process.cwd(), CONFIG.outputDir);

  const content = `// 自动生成的数据文件
// 生成时间: ${data.generatedAt}
// 数据来源: skill
// 数据质量: 置信度 ${data.dataQuality.confidence}%, 新鲜度 ${data.dataQuality.freshness}

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
  announceDate?: string;
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
  releaseDate: string;
  announceDate: string;
  status?: string;
  image?: string;
  url?: string;
  source?: string;
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

// 获取日期函数
export function getTodayDate(): string {
  return '${data.date}';
}

export function getTodayDateCN(): string {
  return new Date('${data.date}').toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

// 今日数据
export const todayPush: DailyPush = {
  id: '${data.date}',
  date: '${data.date}',
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

// 汇率
export const exchangeRates = {
  jpy: 0.048,
  hkd: 0.92,
};
`;

  fs.writeFileSync(path.join(outputDir, 'data.ts'), content, 'utf-8');
  console.log(`   Types: ${path.join(outputDir, 'data.ts')}`);
}

// 主函数
export async function main() {
  console.log('🚀 Skill 数据生成器启动\n');

  try {
    const data = await generateDailyData();
    saveData(data);
    generateTypes(data);

    console.log('\n📊 生成统计:');
    console.log(`   AI热点: ${data.news.length} 条`);
    console.log(`   万代: ${data.bandai.length} 款 (${data.yearMonth})`);
    console.log(`   Hot Toys: ${data.hotToys.length} 款`);
    console.log(`   Steam: ${data.steam.length} 款`);
    console.log(`   PlayStation: ${data.playstation.length} 款`);
    console.log(`   置信度: ${data.dataQuality.confidence}%`);

    console.log('\n✅ 完成!');
    return { success: true, data };
  } catch (error) {
    console.error('\n❌ 生成失败:', error);
    return { success: false, error };
  }
}

if (require.main === module) {
  main();
}
