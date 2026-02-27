// 每日资讯抓取脚本 - 在构建时执行
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
  hot?: number;
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

// 获取知乎热榜
async function fetchZhihuHot(): Promise<NewsItem[]> {
  try {
    // 使用知乎 API
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
    // 获取今日创建的仓库
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
      // 如果 API 限制，获取本周热门
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

// 获取 Hacker News 最新（按时间）
async function fetchHackerNewsNewest(): Promise<NewsItem[]> {
  try {
    // 获取最新故事（newstories 而不是 topstories）
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
    const storyIds = await response.json();

    // 获取前 10 个最新故事的详情
    const stories = await Promise.all(
      storyIds.slice(0, 10).map(async (id: number, index: number) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const story = await storyRes.json();

        // 过滤掉时间太旧的（超过 24 小时）
        const storyTime = new Date(story.time * 1000);
        const hoursAgo = (Date.now() - storyTime.getTime()) / (1000 * 60 * 60);

        if (hoursAgo > 24) return null;

        return {
          id: `hn-${id}`,
          rank: index + 1,
          title: story.title || '无标题',
          keywords: extractKeywords(story.title),
          highlight: `${hoursAgo.toFixed(0)}小时前 · ${story.score || 0} 赞`,
          url: story.url || `https://news.ycombinator.com/item?id=${id}`,
          source: 'Hacker News',
        };
      })
    );

    return stories.filter((s): s is NewsItem => s !== null).slice(0, 10);
  } catch (error) {
    console.error('获取 Hacker News 失败:', error);
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

    // 从 specials 获取特惠游戏
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

// 辅助函数：提取关键词
function extractKeywords(title: string): string[] {
  const keywords: string[] = [];
  const lowerTitle = title.toLowerCase();

  // 科技关键词
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

// 获取日期字符串（几天前）
function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// 主函数
async function main() {
  console.log('🚀 开始抓取每日资讯...');
  console.log(`📅 当前时间: ${new Date().toLocaleString('zh-CN')}`);

  try {
    // 并行获取所有数据
    const [zhihuNews, bilibiliNews, githubNews, hnNews, steamDeals] = await Promise.all([
      fetchZhihuHot(),
      fetchBilibiliHot(),
      fetchGitHubTrending(),
      fetchHackerNewsNewest(),
      fetchSteamDeals(),
    ]);

    // 合并并去重所有新闻（按时间排序）
    const allNews = [...zhihuNews, ...bilibiliNews, ...githubNews, ...hnNews]
      .sort((a, b) => ((b.hot ? parseInt(String(b.hot)) : 0) - (a.hot ? parseInt(String(a.hot)) : 0)))
      .slice(0, 10)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    // 生成数据文件
    const today = new Date().toISOString().split('T')[0];
    const data = {
      id: today,
      date: today,
      generatedAt: new Date().toISOString(),
      aiNews: {
        keywords: [...new Set(allNews.flatMap(n => n.keywords))].slice(0, 5),
        items: allNews,
      },
      gameDeals: {
        steam: steamDeals,
        playstation: [], // 需要特殊处理，暂时为空
        nintendo: {
          hasDeals: false,
          deals: [],
          note: '请访问 Nintendo eShop 查看优惠',
        },
      },
    };

    // 写入文件
    const outputPath = path.join(__dirname, '../lib/daily-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

    console.log('✅ 数据抓取完成！');
    console.log(`📊 获取资讯: ${allNews.length} 条`);
    console.log(`🎮 获取游戏: ${steamDeals.length} 款`);
    console.log(`💾 保存至: ${outputPath}`);

    // 打印摘要
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
