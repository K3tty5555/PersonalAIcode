// 每日资讯生成脚本 - 使用 AI 搜索生成数据
// 替代方案：不依赖外部 API，直接使用 AI 生成高质量内容

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

interface DailyData {
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

// 生成 AI 热点新闻（基于 skill 格式）
function generateAINews(): { keywords: string[]; news: NewsItem[] } {
  // 这里是 AI 生成的热点新闻数据
  // 实际使用时可以通过 AI 搜索获取真实数据
  const keywords = ['大模型', 'AI芯片', '开源', '多模态', 'Agent'];

  const news: NewsItem[] = [
    {
      id: 'ai-1',
      rank: 1,
      title: 'Claude 4 正式发布：超长上下文与推理能力全面升级',
      keywords: ['Anthropic', 'Claude', '大模型'],
      highlight: '支持 200K 上下文窗口，推理能力较前代提升 40%',
      url: 'https://www.anthropic.com/news/claude-4',
      source: 'Anthropic',
    },
    {
      id: 'ai-2',
      rank: 2,
      title: 'OpenAI GPT-5 预览版曝光：多模态能力大幅增强',
      keywords: ['OpenAI', 'GPT-5', '多模态'],
      highlight: '原生支持图像、音频、视频理解，代码能力超越 GPT-4',
      url: 'https://openai.com/blog',
      source: 'OpenAI Blog',
    },
    {
      id: 'ai-3',
      rank: 3,
      title: 'Google Gemini 2.5 Pro 登顶多项基准测试',
      keywords: ['Google', 'Gemini', '基准测试'],
      highlight: '在 MMLU、HumanEval 等测试中获得 SOTA 成绩',
      url: 'https://deepmind.google/',
      source: 'Google DeepMind',
    },
    {
      id: 'ai-4',
      rank: 4,
      title: 'Meta 开源 Llama 4 系列：最高 400B 参数',
      keywords: ['Meta', 'Llama', '开源'],
      highlight: '继续保持开源领先地位，企业级性能媲美闭源模型',
      url: 'https://ai.meta.com/',
      source: 'Meta AI',
    },
    {
      id: 'ai-5',
      rank: 5,
      title: '字节跳动发布豆包 2.0：中文理解能力第一',
      keywords: ['字节跳动', '豆包', '中文模型'],
      highlight: 'C-Eval 中文评测榜首，推理速度提升 50%',
      url: 'https://www.volces.com/',
      source: '字节跳动',
    },
    {
      id: 'ai-6',
      rank: 6,
      title: '阿里通义千问 3.0 开源：110B 参数性能惊艳',
      keywords: ['阿里', '通义千问', '开源'],
      highlight: 'Qwen3-110B 在多项评测中超越 Llama 3.1 405B',
      url: 'https://qwenlm.github.io/',
      source: '阿里通义',
    },
    {
      id: 'ai-7',
      rank: 7,
      title: 'NVIDIA 发布 RTX 5090：AI 算力翻倍',
      keywords: ['NVIDIA', '显卡', '算力'],
      highlight: 'DLSS 4.0 支持 AI 帧生成，大模型推理速度提升 2 倍',
      url: 'https://www.nvidia.com/',
      source: 'NVIDIA',
    },
    {
      id: 'ai-8',
      rank: 8,
      title: 'Stability AI 推出 Stable Diffusion 4',
      keywords: ['Stability AI', '图像生成', 'SD4'],
      highlight: '文字渲染能力大幅提升，支持 4K 分辨率生成',
      url: 'https://stability.ai/',
      source: 'Stability AI',
    },
    {
      id: 'ai-9',
      rank: 9,
      title: 'Figure AI 人形机器人量产：搭载 Helix 模型',
      keywords: ['Figure AI', '机器人', '具身智能'],
      highlight: '可完成复杂家务任务，2025 年交付首批产品',
      url: 'https://www.figure.ai/',
      source: 'Figure AI',
    },
    {
      id: 'ai-10',
      rank: 10,
      title: 'Midjourney V7 发布：视频生成能力加入',
      keywords: ['Midjourney', '视频生成', 'AIGC'],
      highlight: '支持 8 秒视频生成，风格一致性大幅提升',
      url: 'https://www.midjourney.com/',
      source: 'Midjourney',
    },
  ];

  return { keywords, news };
}

// 生成万代商品数据
function generateBandaiData(): BandaiProduct[] {
  return [
    {
      id: 'b1',
      name: 'MG 1/100 高达 EX',
      series: '机动战士高达',
      price: '¥520',
      priceJPY: 11000,
      releaseDate: getFutureDate(10),
    },
    {
      id: 'b2',
      name: 'RG 1/144 强袭自由高达',
      series: 'SEED DESTINY',
      price: '¥380',
      priceJPY: 8000,
      releaseDate: getFutureDate(15),
    },
    {
      id: 'b3',
      name: 'HG 1/144 风灵高达 修改型',
      series: '水星的魔女',
      price: '¥190',
      priceJPY: 4000,
      releaseDate: getFutureDate(20),
    },
    {
      id: 'b4',
      name: 'S.H.Figuarts 哉阿斯奥特曼',
      series: '奥特曼',
      price: '¥450',
      priceJPY: 9500,
      releaseDate: getFutureDate(5),
    },
    {
      id: 'b5',
      name: '真骨雕 假面骑士响鬼 20周年版',
      series: '假面骑士',
      price: '¥550',
      priceJPY: 11500,
      releaseDate: getFutureDate(12),
    },
  ];
}

// 生成 Hot Toys 数据
function generateHotToysData(): HotToysProduct[] {
  return [
    {
      id: 'h1',
      name: '钢铁侠 Mark 85 战损版',
      series: '复仇者联盟4',
      price: 'HK$2,680',
      priceHKD: 2680,
      announceDate: getFutureDate(30),
    },
    {
      id: 'h2',
      name: '蝙蝠侠 黑暗骑士 1/4',
      series: '蝙蝠侠三部曲',
      price: 'HK$3,280',
      priceHKD: 3280,
      announceDate: getFutureDate(45),
    },
    {
      id: 'h3',
      name: '蜘蛛侠 黑金战衣',
      series: '蜘蛛侠：英雄无归',
      price: 'HK$1,880',
      priceHKD: 1880,
      announceDate: getFutureDate(60),
    },
    {
      id: 'h4',
      name: '安纳金天行者(复制人战争) 1/6',
      series: '星球大战',
      price: 'HK$1,680',
      priceHKD: 1680,
      announceDate: getFutureDate(25),
    },
  ];
}

// 生成 Steam 折扣数据
function generateSteamDeals(): SteamDeal[] {
  return [
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
    {
      id: 's5',
      name: '星空 Starfield',
      originalPrice: '¥298',
      discountPrice: '¥149',
      discount: '-50%',
      type: 'historical-low',
    },
    {
      id: 's6',
      name: '方舟：生存飞升',
      originalPrice: '¥248',
      discountPrice: '¥99',
      discount: '-60%',
      type: 'new-low',
    },
  ];
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
function generateNintendoData(): { hasDeals: boolean; deals: SwitchDeal[]; note?: string } {
  return {
    hasDeals: false,
    deals: [],
    note: '本周暂无特别优惠活动，建议关注下周的例行折扣更新',
  };
}

// 生成完整的 data.ts 文件
function generateDataTS(data: DailyData): string {
  return `// 资讯数据类型定义
// 生成时间: ${new Date().toISOString()}

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

// 尝试从 skill 输出目录读取数据
function tryReadSkillData(): Partial<DailyData> | null {
  const skillOutputPath = path.join(__dirname, '../../../skill/skill-hub/.claude/skills/daily-push-suite/output');

  if (!fs.existsSync(skillOutputPath)) {
    console.log('ℹ️ 未找到 skill 输出目录，使用内置数据生成');
    return null;
  }

  const todayFile = path.join(skillOutputPath, `daily-push-${getTodayDate()}.json`);

  if (!fs.existsSync(todayFile)) {
    console.log(`ℹ️ 未找到今日 skill 数据文件: ${todayFile}`);
    console.log('   使用内置数据生成');
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(todayFile, 'utf-8'));
    console.log('✅ 成功读取 skill 数据文件');
    return data;
  } catch (error) {
    console.error('❌ 读取 skill 数据失败:', error);
    return null;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始生成每日资讯...');
  console.log(`📅 当前时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('');

  try {
    // 尝试读取 skill 数据
    const skillData = tryReadSkillData();

    // 生成各类数据（优先使用 skill 数据）
    console.log('📝 生成 AI 热点新闻...');
    const { keywords, news } = skillData?.news ?
      { keywords: skillData.keywords || [], news: skillData.news } :
      generateAINews();

    console.log('📝 生成万代商品数据...');
    const bandai = skillData?.bandai || generateBandaiData();

    console.log('📝 生成 Hot Toys 数据...');
    const hotToys = skillData?.hotToys || generateHotToysData();

    console.log('📝 生成 Steam 折扣数据...');
    const steam = skillData?.steam || generateSteamDeals();

    console.log('📝 生成 PlayStation 折扣数据...');
    const playstation = skillData?.playstation || generatePSDeals();

    console.log('📝 生成 Nintendo 数据...');
    const nintendo = skillData?.nintendo || generateNintendoData();

    // 组装数据
    const dailyData: DailyData = {
      date: getTodayDate(),
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
    console.log(`📊 AI热点: ${news.length} 条`);
    console.log(`🎌 万代商品: ${bandai.length} 款`);
    console.log(`🔥 Hot Toys: ${hotToys.length} 款`);
    console.log(`🎮 Steam 折扣: ${steam.length} 款`);
    console.log(`🎮 PlayStation 折扣: ${playstation.length} 款`);
    console.log(`💾 保存至: ${outputPath}`);

    console.log('\n📰 今日 AI 热点摘要:');
    news.slice(0, 5).forEach(item => {
      console.log(`  ${item.rank}. ${item.title.slice(0, 40)}...`);
    });

    console.log('\n💡 提示: 这是基于模板生成的示例数据');
    console.log('   如需真实数据，请运行 skill 的每日推送任务');

  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  }
}

main();
