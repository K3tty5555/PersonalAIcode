// 获取实时资讯的 API 封装

import type { AINewsItem, SteamDeal, BandaiProduct, HotToysProduct } from './data';

// 动态获取 Skill 数据的接口
export interface SkillDataResult {
  success: boolean;
  data?: {
    date: string;
    aiNews: {
      keywords: string[];
      items: AINewsItem[];
    };
    bandai: BandaiProduct[];
    hotToys: HotToysProduct[];
    gameDeals: {
      steam: SteamDeal[];
      playstation: any[];
      nintendo: {
        hasDeals: boolean;
        deals: any[];
        note?: string;
      };
    };
  };
  source?: 'skill' | 'static' | 'error';
  error?: string;
}

// 尝试从多个来源获取数据，按优先级排序：
// 1. 本地 daily-data.json（如果存在且是今天的）
// 2. 静态导入的 data.ts
// 3. 兜底：静态数据
export async function fetchSkillData(): Promise<SkillDataResult> {
  try {
    // 尝试读取本地 JSON 文件（由 sync-from-skill.ts 生成）
    const response = await fetch('/api/daily-data');
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data,
        source: 'skill',
      };
    }
  } catch (error) {
    console.log('动态获取 skill 数据失败，使用静态数据');
  }

  // 如果动态获取失败，返回静态数据
  return {
    success: true,
    source: 'static',
  };
}

// 检查数据是否需要更新
export async function checkDataFreshness(): Promise<{
  isFresh: boolean;
  lastUpdated: string;
  needsUpdate: boolean;
}> {
  try {
    const response = await fetch('/api/health');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('健康检查失败');
  }

  return {
    isFresh: false,
    lastUpdated: 'unknown',
    needsUpdate: true,
  };
}

// 使用 Hacker News 获取技术/AI 相关热门文章
export async function fetchAINews(): Promise<AINewsItem[]> {
  try {
    // Hacker News 热门文章 API
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await response.json();

    // 获取前 10 个故事的详情
    const stories = await Promise.all(
      storyIds.slice(0, 10).map(async (id: number, index: number) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const story = await storyRes.json();

        return {
          id: String(id),
          rank: index + 1,
          title: story.title || '无标题',
          keywords: extractKeywords(story.title),
          highlight: `来自 Hacker News 的热门讨论，${story.score || 0} 赞`,
          url: story.url || `https://news.ycombinator.com/item?id=${id}`,
          source: 'Hacker News',
        };
      })
    );

    return stories;
  } catch (error) {
    console.error('获取 AI 新闻失败:', error);
    return [];
  }
}

// 从标题提取关键词
function extractKeywords(title: string): string[] {
  const keywords = [];
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('ai') || lowerTitle.includes('gpt') || lowerTitle.includes('llm')) {
    keywords.push('AI');
  }
  if (lowerTitle.includes('google') || lowerTitle.includes('openai') || lowerTitle.includes('meta')) {
    keywords.push('大公司');
  }
  if (lowerTitle.includes('github') || lowerTitle.includes('code') || lowerTitle.includes('programming')) {
    keywords.push('编程');
  }
  if (lowerTitle.includes('startup') || lowerTitle.includes('funding')) {
    keywords.push('创业');
  }

  return keywords.length > 0 ? keywords : ['科技'];
}

// 获取 GitHub Trending（作为 AI/技术资讯补充）
export async function fetchGitHubTrending(): Promise<AINewsItem[]> {
  try {
    // 使用 GitHub API 搜索今日创建的仓库（按 star 排序）
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const response = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=5`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('GitHub API 限制');
    }

    const data = await response.json();

    return data.items.map((repo: any, index: number) => ({
      id: `gh-${repo.id}`,
      rank: index + 1,
      title: `[GitHub 热门] ${repo.name}`,
      keywords: ['开源', 'GitHub'],
      highlight: repo.description || '今日热门开源项目',
      url: repo.html_url,
      source: 'GitHub',
    }));
  } catch (error) {
    console.error('获取 GitHub 趋势失败:', error);
    return [];
  }
}

// 获取实时 Steam 折扣（使用 Steam API）
export async function fetchSteamDeals(): Promise<SteamDeal[]> {
  try {
    // Steam 特惠接口
    const response = await fetch(
      'https://store.steampowered.com/api/featuredcategories/?cc=CN&l=schinese'
    );
    const data = await response.json();

    const deals: SteamDeal[] = [];

    // 从 specials 获取特惠游戏
    if (data.specials?.items) {
      data.specials.items.slice(0, 5).forEach((item: any, index: number) => {
        const discount = item.discount_percent || 0;
        let type: 'new-low' | 'historical-low' | 'daily-deal' = 'daily-deal';

        if (discount >= 75) type = 'new-low';
        else if (discount >= 50) type = 'historical-low';

        deals.push({
          id: `steam-${item.id}`,
          name: item.name,
          originalPrice: `¥${item.original_price ? item.original_price / 100 : '?'}`,
          discountPrice: `¥${item.final_price ? item.final_price / 100 : '?'}`,
          discount: `-${discount}%`,
          discountPercent: discount,
          type,
          image: item.small_capsule_image,
        });
      });
    }

    return deals;
  } catch (error) {
    console.error('获取 Steam 折扣失败:', error);
    return [];
  }
}

// 获取 Reddit r/gamedeals 折扣信息
export async function fetchGameDeals(): Promise<SteamDeal[]> {
  try {
    const response = await fetch('https://www.reddit.com/r/GameDeals/hot.json?limit=10');
    const data = await response.json();

    return data.data.children.slice(0, 5).map((post: any, index: number) => {
      const title = post.data.title;

      // 尝试从标题提取折扣信息
      const discountMatch = title.match(/(\d+)%/);
      const priceMatch = title.match(/\$(\d+\.?\d*)/);

      return {
        id: `reddit-${post.data.id}`,
        name: title.slice(0, 50) + (title.length > 50 ? '...' : ''),
        originalPrice: priceMatch ? `$${priceMatch[1]}` : '查看详情',
        discountPrice: discountMatch ? `-${discountMatch[1]}%` : '特惠',
        discount: discountMatch ? `-${discountMatch[1]}%` : 'Deal',
        type: discountMatch && parseInt(discountMatch[1]) > 50 ? 'new-low' : 'daily-deal',
      };
    });
  } catch (error) {
    console.error('获取游戏折扣失败:', error);
    return [];
  }
}

// 获取所有实时数据
export async function fetchAllRealTimeData() {
  const [aiNews, steamDeals] = await Promise.all([
    fetchAINews(),
    fetchSteamDeals(),
  ]);

  return {
    aiNews,
    steamDeals,
    lastUpdated: new Date().toISOString(),
  };
}
