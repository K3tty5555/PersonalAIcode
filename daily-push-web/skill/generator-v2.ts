// Skill 数据生成器 V2
// 真实数据获取 + 校验纠正机制

import * as fs from 'fs';
import * as path from 'path';
import { SKILL_CONFIG, getTodayDate } from './config';
import {
  fetchAllAINews,
  fetchSteamDeals,
  checkDataFreshness,
  validateData,
  Kr36NewsItem,
  ZhihuHotItem,
  ITHomeItem,
} from './fetcher';

// 数据类型定义
interface NewsItem {
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

interface BandaiProduct {
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

interface HotToysProduct {
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

interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  type: 'new-low' | 'historical-low' | 'daily-deal';
  image?: string;
  url?: string;
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
  url?: string;
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
    deals: any[];
    note?: string;
  };
  generatedAt: string;
  dataQuality: {
    freshness: 'fresh' | 'warning' | 'stale';
    sources: string[];
    confidence: number;
  };
}

// ===== 数据融合与排名 =====
function mergeAndRankNews(
  kr36: Kr36NewsItem[],
  zhihu: ZhihuHotItem[],
  ithome: ITHomeItem[]
): NewsItem[] {
  const newsMap = new Map<string, NewsItem>();

  // 36氪作为首选源
  kr36.forEach((item, index) => {
    const key = item.title.slice(0, 20);
    newsMap.set(key, {
      id: `news-${index + 1}`,
      rank: index + 1,
      title: item.title,
      keywords: item.tags.length > 0 ? item.tags : ['AI', '科技'],
      highlight: item.summary || '点击了解更多详情',
      url: item.url,
      source: '36氪',
      image: item.cover,
      publishTime: item.publishTime,
    });
  });

  // 知乎补充
  let rank = newsMap.size + 1;
  zhihu.forEach((item) => {
    const key = item.title.slice(0, 20);
    if (!newsMap.has(key) && rank <= 10) {
      newsMap.set(key, {
        id: `news-${rank}`,
        rank: rank++,
        title: item.title,
        keywords: item.tags.length > 0 ? item.tags : ['AI', '热议'],
        highlight: item.excerpt || '知乎热榜讨论',
        url: item.url,
        source: '知乎',
      });
    }
  });

  // IT之家补充
  ithome.forEach((item) => {
    const key = item.title.slice(0, 20);
    if (!newsMap.has(key) && rank <= 10) {
      newsMap.set(key, {
        id: `news-${rank}`,
        rank: rank++,
        title: item.title,
        keywords: item.tags.length > 0 ? item.tags : ['科技', '资讯'],
        highlight: item.summary || '点击查看详情',
        url: item.url,
        source: 'IT之家',
      });
    }
  });

  // 如果数据不足，使用备用数据
  if (newsMap.size < 5) {
    console.warn(`⚠️ 数据不足 (${newsMap.size} 条)，启用备用数据...`);
    const backupNews = generateBackupNews();
    backupNews.forEach((item) => {
      if (!newsMap.has(item.title.slice(0, 20)) && rank <= 10) {
        newsMap.set(item.title.slice(0, 20), { ...item, rank: rank++ });
      }
    });
  }

  return Array.from(newsMap.values())
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
}

// 备用新闻数据（当所有API都失败时使用）
function generateBackupNews(): NewsItem[] {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  return [
    {
      id: 'backup-1',
      rank: 1,
      title: `${dateStr} AI行业热点回顾`,
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

// ===== 生成关键词 =====
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

// ===== 格式化价格 =====
function formatJPY(jpy: number): string {
  return `¥${jpy.toLocaleString()}`;
}

function formatHKD(hkd: number): string {
  return `HK$${hkd.toLocaleString()}`;
}

// ===== 生成商品数据 =====
function generateBandaiData(): BandaiProduct[] {
  const products = SKILL_CONFIG.sources.bandai.products;
  const rate = SKILL_CONFIG.exchangeRates.jpyToCny;

  // 随机选择3款
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((p, i) => ({
    id: `b${i + 1}`,
    name: p.name,
    series: p.series,
    price: formatJPY(p.priceJPY),
    priceJPY: p.priceJPY,
    priceCNY: Math.round(p.priceJPY * rate),
    releaseDate: p.releaseDate,
    type: p.type,
    image: p.image,
    url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(p.name)}`,
  }));
}

function generateHotToysData(): HotToysProduct[] {
  const products = SKILL_CONFIG.sources.hotToys.products;
  const rate = SKILL_CONFIG.exchangeRates.hkdToCny;

  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((p, i) => ({
    id: `h${i + 1}`,
    name: p.name,
    series: p.series,
    price: formatHKD(p.priceHKD),
    priceHKD: p.priceHKD,
    priceCNY: Math.round(p.priceHKD * rate),
    announceDate: p.announceDate,
    status: p.status,
    image: p.image,
    url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(p.name)}`,
  }));
}

// ===== 数据校验与纠正 =====
interface CorrectionResult {
  data: DailyPushData;
  corrections: string[];
  warnings: string[];
}

async function validateAndCorrect(data: DailyPushData): Promise<CorrectionResult> {
  const corrections: string[] = [];
  const warnings: string[] = [];

  // 1. 检查新闻数量
  if (data.news.length < 5) {
    warnings.push(`新闻数量不足: ${data.news.length} 条`);
    // 补充备用数据
    const backup = generateBackupNews();
    let rank = data.news.length + 1;
    backup.forEach((item) => {
      if (data.news.length < 10) {
        data.news.push({ ...item, rank: rank++ });
      }
    });
    corrections.push('已补充备用新闻数据');
  }

  // 2. 检查链接有效性
  data.news.forEach((item) => {
    if (!item.url || item.url.includes('google.com')) {
      // 替换为国内搜索
      item.url = `https://36kr.com/search/articles/${encodeURIComponent(item.title.slice(0, 10))}`;
      corrections.push(`[${item.title.slice(0, 15)}...] 链接已替换为国内源`);
    }
  });

  // 3. 检查日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    data.date = getTodayDate();
    corrections.push('日期格式已纠正');
  }

  // 4. 确保每个新闻都有关键词
  data.news.forEach((item) => {
    if (!item.keywords || item.keywords.length === 0) {
      item.keywords = ['AI', '科技'];
    }
  });

  // 5. 重新生成关键词
  if (data.keywords.length === 0) {
    data.keywords = generateKeywords(data.news);
    corrections.push('关键词已重新生成');
  }

  // 6. 检查数据新鲜度
  const freshness = checkDataFreshness(data.generatedAt, 30);
  if (!freshness.isFresh) {
    warnings.push(freshness.warning || '数据可能过期');
    data.dataQuality.freshness = 'stale';
  } else if (freshness.age > 15) {
    data.dataQuality.freshness = 'warning';
  } else {
    data.dataQuality.freshness = 'fresh';
  }

  return { data, corrections, warnings };
}

// ===== 主生成函数 =====
export async function generateDailyData(date?: string): Promise<DailyPushData> {
  const today = date || getTodayDate();
  console.log(`📅 生成日期: ${today}\n`);

  // 获取真实数据
  console.log('🔍 获取 AI 资讯...');
  const { kr36, zhihu, xhs, ithome } = await fetchAllAINews();

  console.log('\n🎮 获取 Steam 折扣...');
  const steamDeals = await fetchSteamDeals();

  // 融合新闻数据（优先36氪）
  const news = mergeAndRankNews(kr36, zhihu, ithome);
  const keywords = generateKeywords(news);

  // 生成商品数据
  const bandai = generateBandaiData();
  const hotToys = generateHotToysData();

  const data: DailyPushData = {
    date: today,
    keywords,
    news,
    bandai,
    hotToys,
    steam: steamDeals.length > 0 ? steamDeals : generateBackupSteamDeals(),
    playstation: SKILL_CONFIG.sources.playstation.deals.map((d, i) => ({
      id: `p${i + 1}`,
      name: d.name,
      priceHKD: d.priceHKD,
      priceCNY: d.priceCNY,
      discount: d.discount,
      eventName: d.eventName,
      validUntil: d.validUntil,
      image: d.image,
      url: `https://store.playstation.com/zh-hans-hk/search/${encodeURIComponent(d.name)}`,
    })),
    nintendo: {
      hasDeals: false,
      deals: [],
      note: '本周暂无特别优惠活动，建议关注下周的例行折扣更新',
    },
    generatedAt: new Date().toISOString(),
    dataQuality: {
      freshness: 'fresh',
      sources: ['36氪', '知乎', 'IT之家', 'Steam'].filter((_, i) =>
        [kr36.length > 0, zhihu.length > 0, ithome.length > 0, steamDeals.length > 0][i]
      ),
      confidence: 0,
    },
  };

  // 计算置信度
  data.dataQuality.confidence = calculateConfidence(data);

  // 校验和纠正
  console.log('\n🔍 数据校验与纠正...');
  const result = await validateAndCorrect(data);

  if (result.corrections.length > 0) {
    console.log('\n✅ 已执行纠正:');
    result.corrections.forEach((c) => console.log(`   • ${c}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️ 警告:');
    result.warnings.forEach((w) => console.log(`   • ${w}`));
  }

  return result.data;
}

// 备用Steam数据
function generateBackupSteamDeals(): SteamDeal[] {
  return SKILL_CONFIG.sources.steam.games.slice(0, 4).map((g, i) => ({
    id: `s${i + 1}`,
    name: g.name,
    originalPrice: g.originalPrice,
    discountPrice: g.discountPrice,
    discount: g.discount,
    type: g.type,
    url: `https://store.steampowered.com/search/?term=${encodeURIComponent(g.name)}`,
  }));
}

// 计算数据置信度
function calculateConfidence(data: DailyPushData): number {
  let score = 0;

  // 新闻来源多样性
  const uniqueSources = new Set(data.news.map((n) => n.source)).size;
  score += uniqueSources * 10;

  // 新闻数量
  score += Math.min(data.news.length * 5, 30);

  // Steam数据
  if (data.steam.length > 0) score += 20;

  // 关键词
  if (data.keywords.length >= 3) score += 15;

  // 新鲜度
  const freshness = checkDataFreshness(data.generatedAt, 60);
  if (freshness.isFresh) score += 25;

  return Math.min(score, 100);
}

// ===== 文件操作 =====
function ensureOutputDir(): string {
  const outputDir = path.resolve(process.cwd(), SKILL_CONFIG.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

export function saveDailyData(data: DailyPushData): string {
  const outputDir = ensureOutputDir();
  const fileName = `${SKILL_CONFIG.filePrefix}-${data.date}.json`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n💾 数据已保存: ${filePath}`);

  return filePath;
}

// ===== 健康检查 =====
export async function healthCheck(): Promise<{
  healthy: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // 检查数据文件
  const outputDir = path.resolve(process.cwd(), SKILL_CONFIG.outputDir);
  const todayFile = path.join(outputDir, `${SKILL_CONFIG.filePrefix}-${getTodayDate()}.json`);

  if (!fs.existsSync(todayFile)) {
    issues.push('今日数据文件不存在');
    recommendations.push('运行 npm run skill 生成今日数据');
  } else {
    const data = JSON.parse(fs.readFileSync(todayFile, 'utf-8'));
    const validation = validateData(data);

    if (!validation.valid) {
      issues.push(...validation.errors);
    }

    // 检查新鲜度
    const freshness = checkDataFreshness(data.generatedAt, 60);
    if (!freshness.isFresh) {
      issues.push(freshness.warning || '数据过期');
      recommendations.push('重新运行数据生成以获取最新资讯');
    }
  }

  return {
    healthy: issues.length === 0,
    issues,
    recommendations,
  };
}

// ===== CLI =====
export async function main() {
  console.log('🚀 Skill 数据生成器 V2 启动...\n');

  try {
    const data = await generateDailyData();
    const filePath = saveDailyData(data);

    console.log('\n📊 生成统计:');
    console.log(`   AI热点: ${data.news.length} 条 (来源: ${data.dataQuality.sources.join(', ')})`);
    console.log(`   万代商品: ${data.bandai.length} 款`);
    console.log(`   Hot Toys: ${data.hotToys.length} 款`);
    console.log(`   Steam折扣: ${data.steam.length} 款`);
    console.log(`   数据置信度: ${data.dataQuality.confidence}%`);
    console.log(`   新鲜度: ${data.dataQuality.freshness}`);

    if (data.dataQuality.confidence < 70) {
      console.log('\n⚠️ 置信度较低，建议检查数据源');
    }

    console.log(`\n✅ 完成! 文件: ${filePath}`);
    return { success: true, filePath, data };
  } catch (error) {
    console.error('\n❌ 生成失败:', error);
    return { success: false, error };
  }
}

if (require.main === module) {
  main();
}
