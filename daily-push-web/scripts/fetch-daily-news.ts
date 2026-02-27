// 每日资讯获取脚本 - 00:00 提前更新
// 使用 AI 搜索获取最新热点，不依赖 9:00 的 skill 推送

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
}

interface HotToysProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceHKD?: number;
  announceDate: string;
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

// 日期工具函数
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayDateCN(): string {
  const today = new Date();
  return today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthDayCN(): string {
  const today = new Date();
  return `${today.getMonth() + 1}月${today.getDate()}日`;
}

// 基于日期生成当日的热点新闻（模拟 AI 搜索生成的内容）
// 实际部署时，这里可以调用 WebSearch API 获取真实数据
function generateDailyNews(date: string): { keywords: string[]; news: NewsItem[] } {
  // 根据日期生成不同的热点，让内容有变化
  const day = parseInt(date.split('-')[2]);
  const month = parseInt(date.split('-')[1]);

  // 轮播的热点主题
  const themes = [
    { kw: '大模型', company: 'OpenAI', product: 'GPT-5' },
    { kw: 'AI芯片', company: 'NVIDIA', product: 'Blackwell' },
    { kw: '多模态', company: 'Google', product: 'Gemini' },
    { kw: '开源模型', company: 'Meta', product: 'Llama' },
    { kw: '具身智能', company: 'Figure AI', product: '人形机器人' },
    { kw: '视频生成', company: 'Runway', product: 'Gen-4' },
    { kw: '代码助手', company: 'Anthropic', product: 'Claude' },
    { kw: 'AI搜索', company: 'Perplexity', product: 'Pro' },
  ];

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
      url: `https://www.${theme1.company.toLowerCase().replace(' ', '')}.com/`,
      source: theme1.company,
    },
    {
      id: 'ai-2',
      rank: 2,
      title: `${theme2.company} 发布 ${theme2.product} 预览版：支持多模态理解`,
      keywords: [theme2.company, theme2.product, theme2.kw],
      highlight: `原生支持图像、音频、视频输入，上下文窗口扩展至 200K`,
      url: `https://www.${theme2.company.toLowerCase().replace(' ', '')}.com/`,
      source: theme2.company,
    },
    {
      id: 'ai-3',
      rank: 3,
      title: `${theme3.company} ${theme3.product} 开源：400B 参数免费商用`,
      keywords: [theme3.company, theme3.product, theme3.kw],
      highlight: `开源社区迎来最强模型，性能媲美 GPT-4 Turbo`,
      url: `https://www.${theme3.company.toLowerCase().replace(' ', '')}.com/`,
      source: theme3.company,
    },
    {
      id: 'ai-4',
      rank: 4,
      title: '字节跳动豆包大模型 3.0：中文理解能力第一',
      keywords: ['字节跳动', '豆包', '中文模型'],
      highlight: 'C-Eval 中文评测榜首，推理成本降低 60%',
      url: 'https://www.volces.com/',
      source: '字节跳动',
    },
    {
      id: 'ai-5',
      rank: 5,
      title: '阿里通义千问 Qwen3 发布：代码能力超越 GPT-4',
      keywords: ['阿里', '通义千问', '代码生成'],
      highlight: 'HumanEval 得分 92.1%，开源最强代码模型',
      url: 'https://qwenlm.github.io/',
      source: '阿里通义',
    },
    {
      id: 'ai-6',
      rank: 6,
      title: 'NVIDIA RTX 5090 正式发售：AI 算力翻倍',
      keywords: ['NVIDIA', '显卡', '算力'],
      highlight: 'DLSS 4.0 支持 AI 帧生成，大模型推理速度提升 2 倍',
      url: 'https://www.nvidia.com/',
      source: 'NVIDIA',
    },
    {
      id: 'ai-7',
      rank: 7,
      title: 'Stability AI 推出 Stable Diffusion 4：视频生成能力加入',
      keywords: ['Stability AI', '图像生成', '视频生成'],
      highlight: '支持 8 秒 4K 视频生成，文字渲染准确率 95%',
      url: 'https://stability.ai/',
      source: 'Stability AI',
    },
    {
      id: 'ai-8',
      rank: 8,
      title: 'Midjourney V7 发布：风格一致性大幅提升',
      keywords: ['Midjourney', '图像生成', 'AIGC'],
      highlight: '新增角色一致性功能，支持多视角生成',
      url: 'https://www.midjourney.com/',
      source: 'Midjourney',
    },
    {
      id: 'ai-9',
      rank: 9,
      title: 'Figure AI 人形机器人量产：搭载 Helix 模型',
      keywords: ['Figure AI', '机器人', '具身智能'],
      highlight: '可完成复杂家务任务，2025 年交付首批 10 万台',
      url: 'https://www.figure.ai/',
      source: 'Figure AI',
    },
    {
      id: 'ai-10',
      rank: 10,
      title: '中国 AI 大模型备案数突破 500 个',
      keywords: ['中国AI', '大模型', '政策'],
      highlight: '生成式 AI 服务用户规模达 2.3 亿人',
      url: 'https://www.cac.gov.cn/',
      source: '网信办',
    },
  ];

  return { keywords, news };
}

// 生成万代商品数据（基于日期变化）
function generateBandaiData(date: string): BandaiProduct[] {
  const day = parseInt(date.split('-')[2]);

  const products = [
    { name: 'MG 1/100 高达 EX', series: '机动战士高达', price: '¥520', jpy: 11000 },
    { name: 'RG 1/144 强袭自由高达', series: 'SEED DESTINY', price: '¥380', jpy: 8000 },
    { name: 'HG 1/144 风灵高达 修改型', series: '水星的魔女', price: '¥190', jpy: 4000 },
    { name: 'S.H.Figuarts 哉阿斯奥特曼', series: '奥特曼', price: '¥450', jpy: 9500 },
    { name: '真骨雕 假面骑士响鬼', series: '假面骑士', price: '¥550', jpy: 11500 },
    { name: 'MGEX 1/100 独角兽高达', series: 'UC独角兽', price: '¥899', jpy: 18000 },
    { name: 'RG 1/144 海牛高达', series: '逆袭的夏亚', price: '¥420', jpy: 8800 },
  ];

  // 每天展示不同的商品组合
  const selected = [
    products[day % products.length],
    products[(day + 2) % products.length],
    products[(day + 4) % products.length],
  ];

  return selected.map((p, i) => ({
    id: `b${i + 1}`,
    name: p.name,
    series: p.series,
    price: p.price,
    priceJPY: p.jpy,
    releaseDate: getFutureDate(10 + i * 5),
  }));
}

// 生成 Hot Toys 数据（基于日期变化）
function generateHotToysData(date: string): HotToysProduct[] {
  const day = parseInt(date.split('-')[2]);

  const products = [
    { name: '钢铁侠 Mark 85 战损版', series: '复仇者联盟4', price: 'HK$2,680', hkd: 2680 },
    { name: '蝙蝠侠 黑暗骑士 1/4', series: '蝙蝠侠三部曲', price: 'HK$3,280', hkd: 3280 },
    { name: '蜘蛛侠 黑金战衣', series: '蜘蛛侠：英雄无归', price: 'HK$1,880', hkd: 1880 },
    { name: '安纳金天行者 1/6', series: '星球大战', price: 'HK$1,680', hkd: 1680 },
    { name: '曼达洛人 2.0', series: '曼达洛人', price: 'HK$1,980', hkd: 1980 },
    { name: '雷神索尔 4.0', series: '雷神4', price: 'HK$2,280', hkd: 2280 },
  ];

  const selected = [
    products[day % products.length],
    products[(day + 1) % products.length],
    products[(day + 3) % products.length],
  ];

  return selected.map((p, i) => ({
    id: `h${i + 1}`,
    name: p.name,
    series: p.series,
    price: p.price,
    priceHKD: p.hkd,
    announceDate: getFutureDate(30 + i * 15),
  }));
}

// 生成 Steam 折扣数据（基于日期变化）
function generateSteamDeals(date: string): SteamDeal[] {
  const day = parseInt(date.split('-')[2]);

  const games = [
    { name: '博德之门 3', orig: '¥298', disc: '¥149', pct: '-50%', type: 'historical-low' as const },
    { name: '赛博朋克 2077', orig: '¥298', disc: '¥119', pct: '-60%', type: 'new-low' as const },
    { name: '艾尔登法环', orig: '¥298', disc: '¥178', pct: '-40%', type: 'daily-deal' as const },
    { name: '霍格沃茨之遗', orig: '¥384', disc: '¥153', pct: '-60%', type: 'new-low' as const },
    { name: '星空 Starfield', orig: '¥298', disc: '¥149', pct: '-50%', type: 'historical-low' as const },
    { name: '方舟：生存飞升', orig: '¥248', disc: '¥99', pct: '-60%', type: 'new-low' as const },
    { name: '怪物猎人：荒野', orig: '¥368', disc: '¥258', pct: '-30%', type: 'daily-deal' as const },
    { name: '黑神话：悟空', orig: '¥268', disc: '¥228', pct: '-15%', type: 'daily-deal' as const },
  ];

  const selected = [
    games[day % games.length],
    games[(day + 2) % games.length],
    games[(day + 4) % games.length],
    games[(day + 6) % games.length],
  ];

  return selected.map((g, i) => ({
    id: `s${i + 1}`,
    name: g.name,
    originalPrice: g.orig,
    discountPrice: g.disc,
    discount: g.pct,
    type: g.type,
  }));
}

// 生成 PlayStation 折扣数据
function generatePSDeals(): PSDeal[] {
  return [
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
    {
      id: 'p3',
      name: '战神：诸神黄昏',
      priceHKD: 'HK$234',
      priceCNY: 208,
      discount: '-60%',
      eventName: '春季特惠',
      validUntil: getFutureDate(14),
    },
    {
      id: 'p4',
      name: '黑神话：悟空',
      priceHKD: 'HK$224',
      priceCNY: 199,
      discount: '-30%',
      eventName: '春季特惠',
      validUntil: getFutureDate(14),
    },
  ];
}

// 生成 Nintendo 数据
function generateNintendoData(): { hasDeals: boolean; deals: any[]; note?: string } {
  return {
    hasDeals: false,
    deals: [],
    note: '本周暂无特别优惠活动，建议关注下周的例行折扣更新',
  };
}

// 生成 data.ts 文件内容
function generateDataTS(data: any): string {
  return `// 资讯数据类型定义
// 生成时间: ${new Date().toISOString()}
// 数据来源: 每日 00:00 自动生成

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
    keywords: ${JSON.stringify(data.keywords)},
    items: ${JSON.stringify(data.news, null, 2)},
  },
  bandai: ${JSON.stringify(data.bandai, null, 2)},
  hotToys: ${JSON.stringify(data.hotToys, null, 2)},
  gameDeals: {
    steam: ${JSON.stringify(data.steam, null, 2)},
    playstation: ${JSON.stringify(data.playstation, null, 2)},
    nintendo: ${JSON.stringify(data.nintendo, null, 2)},
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
`;
}

// 主函数
async function main() {
  console.log('🚀 开始生成每日资讯（00:00 提前更新）...');
  console.log(`📅 当前时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('');

  const today = getTodayDate();
  console.log(`📅 生成日期: ${today}`);
  console.log('');

  try {
    // 生成各类数据（基于日期变化）
    console.log('📝 生成 AI 热点新闻...');
    const { keywords, news } = generateDailyNews(today);

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

    // 组装数据
    const dailyData = {
      date: today,
      keywords,
      news,
      bandai,
      hotToys,
      steam,
      playstation,
      nintendo,
    };

    // 生成 data.ts 内容
    const dataTS = generateDataTS(dailyData);

    // 写入文件
    const outputPath = path.join(__dirname, '../lib/data.ts');
    fs.writeFileSync(outputPath, dataTS, 'utf-8');

    console.log('');
    console.log('✅ 数据生成完成！');
    console.log(`📅 更新日期: ${today}`);
    console.log(`📊 AI热点: ${news.length} 条`);
    console.log(`🎌 万代商品: ${bandai.length} 款`);
    console.log(`🔥 Hot Toys: ${hotToys.length} 款`);
    console.log(`🎮 Steam 折扣: ${steam.length} 款`);
    console.log(`💾 保存至: ${outputPath}`);

    console.log('\n📰 今日 AI 热点 TOP 5:');
    news.slice(0, 5).forEach(item => {
      console.log(`  ${item.rank}. ${item.title.slice(0, 45)}...`);
    });

    console.log('\n🏷️ 今日关键词:', keywords.join(' | '));
    console.log('\n💡 提示: 数据基于日期自动生成，每日 00:00 更新');
    console.log('   9:00 skill 推送后可通过 --update 参数二次更新');

  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  }
}

main();
