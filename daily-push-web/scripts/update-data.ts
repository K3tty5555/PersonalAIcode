// 每日资讯抓取脚本 - 更新 data.ts 文件
// 数据来源：知乎热榜、Bilibili 热门、GitHub Trending、Steam 折扣

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
  hot?: number | string;
}

interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  type: 'new-low' | 'historical-low' | 'daily-deal';
}

// 获取知乎热榜
async function fetchZhihuHot(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=10');
    const data = await response.json();

    return data.data.map((item: any, index: number) => ({
      id: `zhihu-${item.target?.id || index}`,
      rank: index + 1,
      title: item.target?.title || '无标题',
      keywords: extractKeywords(item.target?.title),
      highlight: `${item.target?.excerpt?.slice(0, 60) || ''}...`,
      url: `https://www.zhihu.com/question/${item.target?.id}`,
      source: '知乎热榜',
      hot: item.detail_text?.match(/(\d+)/)?.[0] || '0',
    }));
  } catch (error) {
    console.error('获取知乎热榜失败:', error);
    return [];
  }
}

// 获取 Bilibili 热门
async function fetchBilibiliHot(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://api.bilibili.com/x/web-interface/popular?ps=10');
    const data = await response.json();

    return data.data?.list?.map((item: any, index: number) => ({
      id: `bili-${item.bvid}`,
      rank: index + 1,
      title: item.title,
      keywords: ['B站', '视频'],
      highlight: `UP主: ${item.owner?.name} | ${(item.stat?.view / 10000).toFixed(1)}万播放`,
      url: `https://www.bilibili.com/video/${item.bvid}`,
      source: 'Bilibili',
    })) || [];
  } catch (error) {
    console.error('获取 Bilibili 热门失败:', error);
    return [];
  }
}

// 获取 GitHub Trending
async function fetchGitHubTrending(): Promise<NewsItem[]> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const response = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'daily-push-web',
        },
      }
    );

    if (!response.ok) {
      const weekResponse = await fetch(
        `https://api.github.com/search/repositories?q=created:>${getDateString(7)}&sort=stars&order=desc&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'daily-push-web',
          },
        }
      );
      const weekData = await weekResponse.json();
      return weekData.items?.map((repo: any, index: number) => ({
        id: `github-${repo.id}`,
        rank: index + 1,
        title: repo.name,
        keywords: ['开源', 'GitHub', repo.language || 'Code'].filter(Boolean),
        highlight: `${repo.description?.slice(0, 60) || '本周热门开源项目'}... ⭐${repo.stargazers_count}`,
        url: repo.html_url,
        source: 'GitHub Trending',
      })) || [];
    }

    const data = await response.json();

    return data.items?.map((repo: any, index: number) => ({
      id: `github-${repo.id}`,
      rank: index + 1,
      title: repo.name,
      keywords: ['开源', 'GitHub', repo.language || 'Code'].filter(Boolean),
      highlight: `${repo.description?.slice(0, 60) || '今日热门开源项目'}... ⭐${repo.stargazers_count}`,
      url: repo.html_url,
      source: 'GitHub Trending',
    })) || [];
  } catch (error) {
    console.error('获取 GitHub Trending 失败:', error);
    return [];
  }
}

// 获取 Steam 折扣
async function fetchSteamDeals(): Promise<SteamDeal[]> {
  try {
    const response = await fetch(
      'https://store.steampowered.com/api/featuredcategories/?cc=CN&l=schinese'
    );
    const data = await response.json();

    const deals: SteamDeal[] = [];

    if (data.specials?.items) {
      data.specials.items.slice(0, 6).forEach((item: any) => {
        const discount = item.discount_percent || 0;
        let type: 'new-low' | 'historical-low' | 'daily-deal' = 'daily-deal';

        if (discount >= 75) type = 'new-low';
        else if (discount >= 50) type = 'historical-low';

        deals.push({
          id: `steam-${item.id}`,
          name: item.name,
          originalPrice: item.original_price ? `¥${(item.original_price / 100).toFixed(0)}` : '¥???',
          discountPrice: item.final_price ? `¥${(item.final_price / 100).toFixed(0)}` : '¥???',
          discount: `-${discount}%`,
          type,
        });
      });
    }

    return deals;
  } catch (error) {
    console.error('获取 Steam 折扣失败:', error);
    return [];
  }
}

// 辅助函数
function extractKeywords(title: string): string[] {
  const keywords: string[] = [];
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('ai') || lowerTitle.includes('gpt') || lowerTitle.includes('llm') || lowerTitle.includes('模型')) {
    keywords.push('AI');
  }
  if (lowerTitle.includes('google') || lowerTitle.includes('openai') || lowerTitle.includes('meta') || lowerTitle.includes('微软')) {
    keywords.push('大公司');
  }
  if (lowerTitle.includes('github') || lowerTitle.includes('code') || lowerTitle.includes('编程') || lowerTitle.includes('开源')) {
    keywords.push('编程');
  }
  if (lowerTitle.includes('startup') || lowerTitle.includes('创业') || lowerTitle.includes('融资')) {
    keywords.push('创业');
  }
  if (lowerTitle.includes('游戏') || lowerTitle.includes('switch') || lowerTitle.includes('steam') || lowerTitle.includes('ps5')) {
    keywords.push('游戏');
  }
  if (lowerTitle.includes('电影') || lowerTitle.includes('电视剧') || lowerTitle.includes('综艺')) {
    keywords.push('影视');
  }

  return keywords.length > 0 ? keywords : ['科技'];
}

function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 生成 data.ts 内容
function generateDataTS(news: NewsItem[], steamDeals: SteamDeal[], today: string): string {
  const keywords = [...new Set(news.flatMap(n => n.keywords))].slice(0, 5);

  return `// 资讯数据类型定义

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

// 模拟今日数据（使用动态日期）
const today = getTodayDate();
const todayCN = getTodayDateCN();

export const todayPush: DailyPush = {
  id: today,
  date: today,
  aiNews: {
    keywords: ${JSON.stringify(keywords)},
    items: ${JSON.stringify(news.map((item, index) => ({ ...item, rank: index + 1 })), null, 2)},
  },
  bandai: [
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
  ],
  hotToys: [
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
  ],
  gameDeals: {
    steam: ${JSON.stringify(steamDeals, null, 2)},
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
      {
        id: 'p3',
        name: '战神：诸神黄昏',
        priceHKD: 'HK$234',
        priceCNY: 208,
        discount: '-60%',
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
  console.log('🚀 开始抓取每日资讯...');
  console.log(`📅 当前时间: ${new Date().toLocaleString('zh-CN')}`);

  try {
    const [zhihuNews, bilibiliNews, githubNews, steamDeals] = await Promise.all([
      fetchZhihuHot(),
      fetchBilibiliHot(),
      fetchGitHubTrending(),
      fetchSteamDeals(),
    ]);

    // 合并并去重所有新闻
    const allNews = [...zhihuNews, ...bilibiliNews, ...githubNews]
      .sort((a, b) => {
        const hotA = typeof a.hot === 'string' ? parseInt(a.hot) : (a.hot || 0);
        const hotB = typeof b.hot === 'string' ? parseInt(b.hot) : (b.hot || 0);
        return hotB - hotA;
      })
      .slice(0, 10);

    const today = new Date().toISOString().split('T')[0];

    // 生成新的 data.ts 内容
    const dataTS = generateDataTS(allNews, steamDeals, today);

    // 写入文件
    const outputPath = path.join(__dirname, '../lib/data.ts');
    fs.writeFileSync(outputPath, dataTS, 'utf-8');

    console.log('✅ 数据更新完成！');
    console.log(`📊 获取资讯: ${allNews.length} 条`);
    console.log(`🎮 获取游戏: ${steamDeals.length} 款`);
    console.log(`💾 保存至: ${outputPath}`);

    console.log('\n📰 今日资讯摘要:');
    allNews.slice(0, 5).forEach(item => {
      console.log(`  ${item.rank}. [${item.source}] ${item.title.slice(0, 40)}...`);
    });

  } catch (error) {
    console.error('❌ 抓取失败:', error);
    process.exit(1);
  }
}

main();
