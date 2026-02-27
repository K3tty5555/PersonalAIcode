// Skill 数据生成器 V2
// 真实数据获取 + 校验纠正机制

import * as fs from 'fs';
import * as path from 'path';
import { SKILL_CONFIG, getTodayDate } from './config';
import {
  fetchAllData,
  fetch36KrNews,
  fetchZhihuHot,
  fetchITHome,
  fetchBandaiProducts,
  fetchHotToysProducts,
  fetchSteamDeals,
  fetchPSDeals,
  fetchNintendoDeals,
  checkDataFreshness,
  validateNewsData,
  validateProductData,
  validateGameDeals,
  type Kr36NewsItem,
  type ZhihuHotItem,
  type ITHomeItem,
  type BandaiProduct,
  type HotToysProduct,
  type SteamDeal,
  type PSDeal,
  type NintendoData,
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

interface DailyPushData {
  date: string;
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

  return Array.from(newsMap.values())
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);
}

// 备用新闻数据
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

// ===== 数据校验与纠正 =====
interface CorrectionResult {
  data: DailyPushData;
  corrections: string[];
  warnings: string[];
}

async function validateAndCorrect(data: DailyPushData): Promise<CorrectionResult> {
  const corrections: string[] = [];
  const warnings: string[] = [];

  // 1. 校验新闻数据
  const newsValidation = validateNewsData(data.news);
  if (!newsValidation.valid) {
    warnings.push(...newsValidation.errors);
    data.news = newsValidation.corrected;
    corrections.push('新闻数据已纠正');
  }

  // 2. 补充新闻数量
  if (data.news.length < 5) {
    warnings.push(`新闻数量不足: ${data.news.length} 条`);
    const backup = generateBackupNews();
    let rank = data.news.length + 1;
    backup.forEach((item) => {
      if (data.news.length < 10) {
        data.news.push({ ...item, rank: rank++ });
      }
    });
    corrections.push('已补充备用新闻数据');
  }

  // 3. 校验商品数据
  const bandaiValidation = validateProductData(data.bandai, 'bandai');
  if (!bandaiValidation.valid) {
    warnings.push(...bandaiValidation.errors);
    data.bandai = await fetchBandaiProducts();
    corrections.push('万代数据已重新获取');
  }

  const hottoysValidation = validateProductData(data.hotToys, 'hottoys');
  if (!hottoysValidation.valid) {
    warnings.push(...hottoysValidation.errors);
    data.hotToys = await fetchHotToysProducts();
    corrections.push('Hot Toys 数据已重新获取');
  }

  // 4. 校验游戏数据
  const steamValidation = validateGameDeals(data.steam, 'Steam');
  if (!steamValidation.valid) {
    warnings.push(...steamValidation.errors);
    data.steam = await fetchSteamDeals();
    corrections.push('Steam 数据已重新获取');
  }

  const psValidation = validateGameDeals(data.playstation, 'PlayStation');
  if (!psValidation.valid) {
    warnings.push(...psValidation.errors);
    data.playstation = await fetchPSDeals();
    corrections.push('PlayStation 数据已重新获取');
  }

  // 5. 检查日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    data.date = getTodayDate();
    corrections.push('日期格式已纠正');
  }

  // 6. 确保每个新闻都有关键词
  data.news.forEach((item) => {
    if (!item.keywords || item.keywords.length === 0) {
      item.keywords = ['AI', '科技'];
    }
  });

  // 7. 重新生成关键词
  if (data.keywords.length === 0) {
    data.keywords = generateKeywords(data.news);
    corrections.push('关键词已重新生成');
  }

  // 8. 检查数据新鲜度
  const freshness = checkDataFreshness(data.generatedAt, 120);
  if (!freshness.isFresh) {
    warnings.push(freshness.warning || '数据可能过期');
    data.dataQuality.freshness = 'stale';
  } else if (freshness.age > 60) {
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

  // 获取所有真实数据
  const allData = await fetchAllData();

  // 融合新闻数据
  const news = mergeAndRankNews(
    allData.news.kr36,
    allData.news.zhihu,
    allData.news.ithome
  );
  const keywords = generateKeywords(news);

  const data: DailyPushData = {
    date: today,
    keywords,
    news,
    bandai: allData.products.bandai,
    hotToys: allData.products.hotToys,
    steam: allData.games.steam,
    playstation: allData.games.playstation,
    nintendo: allData.games.nintendo,
    generatedAt: new Date().toISOString(),
    dataQuality: {
      freshness: 'fresh',
      sources: [],
      confidence: 0,
    },
  };

  // 记录数据来源
  const sources: string[] = [];
  if (allData.news.kr36.length > 0) sources.push('36氪');
  if (allData.news.zhihu.length > 0) sources.push('知乎');
  if (allData.news.ithome.length > 0) sources.push('IT之家');
  if (allData.products.bandai.length > 0) sources.push('万代');
  if (allData.products.hotToys.length > 0) sources.push('HotToys');
  if (allData.games.steam.length > 0) sources.push('Steam');
  if (allData.games.playstation.length > 0) sources.push('PlayStation');
  data.dataQuality.sources = sources;

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

// 计算数据置信度
function calculateConfidence(data: DailyPushData): number {
  let score = 0;

  // 新闻来源多样性
  const uniqueNewsSources = new Set(data.news.map((n) => n.source)).size;
  score += uniqueNewsSources * 10;

  // 新闻数量
  score += Math.min(data.news.length * 5, 30);

  // 商品数据
  if (data.bandai.length > 0) score += 15;
  if (data.hotToys.length > 0) score += 15;

  // 游戏数据
  if (data.steam.length > 0) score += 10;
  if (data.playstation.length > 0) score += 10;

  // 关键词
  if (data.keywords.length >= 3) score += 10;

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

    // 检查新闻数据
    const newsValidation = validateNewsData(data.news || []);
    if (!newsValidation.valid) {
      issues.push(...newsValidation.errors);
    }

    // 检查新鲜度
    if (data.generatedAt) {
      const freshness = checkDataFreshness(data.generatedAt, 120);
      if (!freshness.isFresh) {
        issues.push(freshness.warning || '数据过期');
        recommendations.push('重新运行数据生成以获取最新资讯');
      }
    }

    // 检查商品数据
    if (!data.bandai || data.bandai.length === 0) {
      issues.push('万代数据缺失');
    }
    if (!data.hotToys || data.hotToys.length === 0) {
      issues.push('Hot Toys 数据缺失');
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
    console.log(`   AI热点: ${data.news.length} 条 (来源: ${data.dataQuality.sources.filter(s => ['36氪', '知乎', 'IT之家'].includes(s)).join(', ')})`);
    console.log(`   万代商品: ${data.bandai.length} 款`);
    console.log(`   Hot Toys: ${data.hotToys.length} 款`);
    console.log(`   Steam折扣: ${data.steam.length} 款`);
    console.log(`   PlayStation: ${data.playstation.length} 款`);
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
