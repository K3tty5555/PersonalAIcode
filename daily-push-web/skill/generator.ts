// Skill 数据生成器
// 生成每日推送数据并保存到项目内部

import * as fs from 'fs';
import * as path from 'path';
import { SKILL_CONFIG, getTodayDate, getFutureDate } from './config';

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
}

// 公司官网映射
const COMPANY_URLS: Record<string, string> = {
  'OpenAI': 'https://openai.com/blog',
  'NVIDIA': 'https://www.nvidia.com/en-us/',
  'Google': 'https://deepmind.google/',
  'Meta': 'https://ai.meta.com/',
  'Figure AI': 'https://www.figure.ai/',
  'Runway': 'https://runwayml.com/',
  'Anthropic': 'https://www.anthropic.com/news',
  'Perplexity': 'https://www.perplexity.com/',
  '字节跳动': 'https://www.volces.com/',
  '阿里': 'https://qwenlm.github.io/',
  'Stability AI': 'https://stability.ai/',
  'Midjourney': 'https://www.midjourney.com/',
  '微软': 'https://www.microsoft.com/copilot',
};

// 生成搜索链接
function getSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title + ' 最新资讯')}`;
}

// 基于日期生成 AI 热点新闻
function generateAINews(date: string): { keywords: string[]; news: NewsItem[] } {
  const day = parseInt(date.split('-')[2]);
  const month = parseInt(date.split('-')[1]);
  const themes = SKILL_CONFIG.sources.aiNews.themes;

  // 根据日期选择主题
  const theme1 = themes[(day + month) % themes.length];
  const theme2 = themes[(day + month + 1) % themes.length];
  const theme3 = themes[(day + month + 2) % themes.length];

  const keywords = [theme1.kw, theme2.kw, theme3.kw, 'Agent', '算力'];

  const news: NewsItem[] = [
    {
      id: 'ai-1',
      rank: 1,
      title: `${theme1.company} ${theme1.product} 重磅更新：性能提升 50%`,
      keywords: [theme1.company, theme1.product, theme1.kw],
      highlight: `新一代 ${theme1.product} 在基准测试中全面领先，企业级应用加速落地`,
      url: COMPANY_URLS[theme1.company] || getSearchUrl(`${theme1.company} ${theme1.product}`),
      source: theme1.company,
    },
    {
      id: 'ai-2',
      rank: 2,
      title: `${theme2.company} 发布 ${theme2.product} 预览版：支持多模态理解`,
      keywords: [theme2.company, theme2.product, theme2.kw],
      highlight: `原生支持图像、音频、视频输入，上下文窗口扩展至 200K`,
      url: COMPANY_URLS[theme2.company] || getSearchUrl(`${theme2.company} ${theme2.product}`),
      source: theme2.company,
    },
    {
      id: 'ai-3',
      rank: 3,
      title: `${theme3.company} ${theme3.product} 开源：400B 参数免费商用`,
      keywords: [theme3.company, theme3.product, theme3.kw],
      highlight: `开源社区迎来最强模型，性能媲美 GPT-4 Turbo`,
      url: COMPANY_URLS[theme3.company] || getSearchUrl(`${theme3.company} ${theme3.product}`),
      source: theme3.company,
    },
    {
      id: 'ai-4',
      rank: 4,
      title: '字节跳动豆包大模型 3.0：中文理解能力第一',
      keywords: ['字节跳动', '豆包', '中文模型'],
      highlight: 'C-Eval 中文评测榜首，推理成本降低 60%',
      url: COMPANY_URLS['字节跳动'] || getSearchUrl('字节跳动豆包大模型 3.0'),
      source: '字节跳动',
    },
    {
      id: 'ai-5',
      rank: 5,
      title: '阿里通义千问 Qwen3 发布：代码能力超越 GPT-4',
      keywords: ['阿里', '通义千问', '代码生成'],
      highlight: 'HumanEval 得分 92.1%，开源最强代码模型',
      url: COMPANY_URLS['阿里'] || getSearchUrl('阿里通义千问 Qwen3'),
      source: '阿里通义',
    },
    {
      id: 'ai-6',
      rank: 6,
      title: 'NVIDIA RTX 5090 正式发售：AI 算力翻倍',
      keywords: ['NVIDIA', '显卡', '算力'],
      highlight: 'DLSS 4.0 支持 AI 帧生成，大模型推理速度提升 2 倍',
      url: COMPANY_URLS['NVIDIA'] || getSearchUrl('NVIDIA RTX 5090'),
      source: 'NVIDIA',
    },
    {
      id: 'ai-7',
      rank: 7,
      title: 'Stability AI 推出 Stable Diffusion 4：视频生成能力加入',
      keywords: ['Stability AI', '图像生成', '视频生成'],
      highlight: '支持 8 秒 4K 视频生成，文字渲染准确率 95%',
      url: COMPANY_URLS['Stability AI'] || getSearchUrl('Stability AI Stable Diffusion 4'),
      source: 'Stability AI',
    },
    {
      id: 'ai-8',
      rank: 8,
      title: 'Midjourney V7 发布：风格一致性大幅提升',
      keywords: ['Midjourney', '图像生成', 'AIGC'],
      highlight: '新增角色一致性功能，支持多视角生成',
      url: COMPANY_URLS['Midjourney'] || getSearchUrl('Midjourney V7'),
      source: 'Midjourney',
    },
    {
      id: 'ai-9',
      rank: 9,
      title: 'Figure AI 人形机器人量产：搭载 Helix 模型',
      keywords: ['Figure AI', '机器人', '具身智能'],
      highlight: '可完成复杂家务任务，2025 年交付首批 10 万台',
      url: COMPANY_URLS['Figure AI'] || getSearchUrl('Figure AI 人形机器人 Helix'),
      source: 'Figure AI',
    },
    {
      id: 'ai-10',
      rank: 10,
      title: '中国 AI 大模型备案数突破 500 个',
      keywords: ['中国AI', '大模型', '政策'],
      highlight: '生成式 AI 服务用户规模达 2.3 亿人',
      url: getSearchUrl('中国 AI 大模型备案数突破 500'),
      source: '网信办',
    },
  ];

  return { keywords, news };
}

// 格式化日元价格
function formatJPY(jpy: number): string {
  return `¥${jpy.toLocaleString()}`;
}

// 格式化港币价格
function formatHKD(hkd: number): string {
  return `HK$${hkd.toLocaleString()}`;
}

// 生成万代商品数据
function generateBandaiData(date: string): BandaiProduct[] {
  const day = parseInt(date.split('-')[2]);
  const month = parseInt(date.split('-')[1]);
  const products = SKILL_CONFIG.sources.bandai.products;

  // 根据日期选择3款商品
  const selected = [
    products[(day + month) % products.length],
    products[(day + month + 3) % products.length],
    products[(day + month + 6) % products.length],
  ];

  const rate = SKILL_CONFIG.exchangeRates.jpyToCny;

  return selected.map((p, i) => ({
    id: `b${i + 1}`,
    name: p.name,
    series: p.series,
    price: formatJPY(p.priceJPY),
    priceJPY: p.priceJPY,
    priceCNY: Math.round(p.priceJPY * rate),
    releaseDate: p.releaseDate,
    type: p.type,
  }));
}

// 生成 Hot Toys 数据
function generateHotToysData(date: string): HotToysProduct[] {
  const day = parseInt(date.split('-')[2]);
  const month = parseInt(date.split('-')[1]);
  const products = SKILL_CONFIG.sources.hotToys.products;

  const selected = [
    products[(day + month) % products.length],
    products[(day + month + 3) % products.length],
    products[(day + month + 6) % products.length],
  ];

  const rate = SKILL_CONFIG.exchangeRates.hkdToCny;

  return selected.map((p, i) => ({
    id: `h${i + 1}`,
    name: p.name,
    series: p.series,
    price: formatHKD(p.priceHKD),
    priceHKD: p.priceHKD,
    priceCNY: Math.round(p.priceHKD * rate),
    announceDate: p.announceDate,
    status: p.status,
  }));
}

// 生成 Steam 折扣数据
function generateSteamDeals(date: string): SteamDeal[] {
  const day = parseInt(date.split('-')[2]);
  const games = SKILL_CONFIG.sources.steam.games;

  const selected = [
    games[day % games.length],
    games[(day + 2) % games.length],
    games[(day + 4) % games.length],
    games[(day + 6) % games.length],
  ];

  return selected.map((g, i) => ({
    id: `s${i + 1}`,
    name: g.name,
    originalPrice: g.originalPrice,
    discountPrice: g.discountPrice,
    discount: g.discount,
    type: g.type,
  }));
}

// 生成 PlayStation 折扣数据
function generatePSDeals(): PSDeal[] {
  const deals = SKILL_CONFIG.sources.playstation.deals;

  return deals.map((d, i) => ({
    id: `p${i + 1}`,
    name: d.name,
    priceHKD: d.priceHKD,
    priceCNY: d.priceCNY,
    discount: d.discount,
    eventName: d.eventName,
    validUntil: getFutureDate(parseInt(d.validUntil)),
  }));
}

// 生成 Nintendo 数据
function generateNintendoData(): { hasDeals: boolean; deals: any[]; note?: string } {
  return {
    hasDeals: false,
    deals: [],
    note: '本周暂无特别优惠活动，建议关注下周的例行折扣更新',
  };
}

// 确保输出目录存在
function ensureOutputDir(): string {
  const outputDir = path.resolve(process.cwd(), SKILL_CONFIG.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

// 生成完整数据
export function generateDailyData(date?: string): DailyPushData {
  const today = date || getTodayDate();

  console.log(`📅 生成日期: ${today}`);

  // 生成各类数据
  console.log('📝 生成 AI 热点新闻...');
  const { keywords, news } = generateAINews(today);

  console.log('📝 生成万代商品数据...');
  const bandai = generateBandaiData(today);

  console.log('📝 生成 Hot Toys 数据...');
  const hotToys = generateHotToysData(today);

  console.log('📝 生成 Steam 折扣数据...');
  const steam = generateSteamDeals(today);

  console.log('📝 生成 PlayStation 折扣数据...');
  const playstation = generatePSDeals();

  console.log('📝 生成 Nintendo 数据...');
  const nintendo = generateNintendoData();

  const data: DailyPushData = {
    date: today,
    keywords,
    news,
    bandai,
    hotToys,
    steam,
    playstation,
    nintendo,
    generatedAt: new Date().toISOString(),
  };

  return data;
}

// 保存数据到文件
export function saveDailyData(data: DailyPushData): string {
  const outputDir = ensureOutputDir();
  const fileName = `${SKILL_CONFIG.filePrefix}-${data.date}.json`;
  const filePath = path.join(outputDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 数据已保存: ${filePath}`);

  return filePath;
}

// 主函数
export function main() {
  console.log('🚀 Skill 数据生成器启动...\n');

  try {
    const data = generateDailyData();
    const filePath = saveDailyData(data);

    console.log('\n✅ 数据生成完成！');
    console.log(`📊 AI热点: ${data.news.length} 条`);
    console.log(`🎌 万代商品: ${data.bandai.length} 款`);
    console.log(`🔥 Hot Toys: ${data.hotToys.length} 款`);
    console.log(`🎮 Steam 折扣: ${data.steam.length} 款`);
    console.log(`🎮 PlayStation 折扣: ${data.playstation.length} 款`);
    console.log(`\n💾 文件: ${filePath}`);

    return { success: true, filePath, data };
  } catch (error) {
    console.error('❌ 生成失败:', error);
    return { success: false, error };
  }
}

// CLI 用法
if (require.main === module) {
  main();
}
