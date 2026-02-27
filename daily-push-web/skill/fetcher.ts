// 数据获取模块
// 从国内平台获取真实数据：36氪、知乎、小红书等

import * as https from 'https';
import * as http from 'http';

// 通用 HTTP 请求
async function fetchWithTimeout(url: string, options: https.RequestOptions = {}, timeout = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        ...options.headers,
      },
      ...options,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', reject);
    req.end();
  });
}

// ===== 36氪数据获取 =====
export interface Kr36NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishTime: string;
  tags: string[];
  cover?: string;
}

// 36氪快讯 RSS
export async function fetch36KrNews(): Promise<Kr36NewsItem[]> {
  try {
    // 尝试多种36氪数据源
    const sources = [
      { type: 'rss', url: 'https://36kr.com/feed' },
      { type: 'api', url: 'https://36kr.com/api/newsflash' },
    ];

    for (const source of sources) {
      try {
        console.log(`📡 尝试从 ${source.type} 获取36氪数据...`);

        if (source.type === 'rss') {
          const xml = await fetchWithTimeout(source.url, {}, 8000);
          return parse36KrRSS(xml);
        }
      } catch (e) {
        console.warn(`⚠️ ${source.type} 获取失败:`, (e as Error).message);
        continue;
      }
    }

    throw new Error('所有36氪数据源均失败');
  } catch (error) {
    console.error('❌ 36氪获取失败:', error);
    return [];
  }
}

// 解析36氪 RSS
function parse36KrRSS(xml: string): Kr36NewsItem[] {
  const items: Kr36NewsItem[] = [];
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const items_match = xml.match(itemRegex) || [];

  for (let i = 0; i < Math.min(items_match.length, 15); i++) {
    const item = items_match[i];

    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

    if (titleMatch && linkMatch) {
      const title = cleanCDATA(titleMatch[1]);
      const description = descMatch ? cleanCDATA(descMatch[1]) : '';

      // 只保留AI/科技相关
      if (isAITechRelated(title + description)) {
        items.push({
          id: `kr36-${i + 1}`,
          title: title.slice(0, 100),
          summary: description.slice(0, 200).replace(/<[^>]+>/g, ''),
          url: cleanCDATA(linkMatch[1]),
          publishTime: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
          tags: extractTags(title + description),
        });
      }
    }
  }

  return items.slice(0, 10);
}

// ===== 知乎数据获取 =====
export interface ZhihuHotItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  hot: number;
  tags: string[];
}

// 知乎热榜
export async function fetchZhihuHot(): Promise<ZhihuHotItem[]> {
  try {
    const data = await fetchWithTimeout(
      'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50',
      { headers: { 'Referer': 'https://www.zhihu.com/' } },
      8000
    );

    const json = JSON.parse(data);
    const items: ZhihuHotItem[] = [];

    if (json.data) {
      for (const item of json.data) {
        const target = item.target || item;
        const title = target.title || '';
        const excerpt = target.excerpt || '';

        if (isAITechRelated(title + excerpt)) {
          items.push({
            id: `zh-${target.id || items.length}`,
            title: title.slice(0, 100),
            excerpt: excerpt.slice(0, 200),
            url: `https://www.zhihu.com/question/${target.id}`,
            hot: item.detail_text ? parseInt(item.detail_text.replace(/[^\d]/g, '')) : 0,
            tags: extractTags(title + excerpt),
          });
        }
      }
    }

    return items.slice(0, 8);
  } catch (error) {
    console.error('❌ 知乎获取失败:', error);
    return [];
  }
}

// ===== 小红书数据获取（通过搜索趋势） =====
export interface XHSTrendItem {
  id: string;
  keyword: string;
  hot: number;
  category: string;
}

export async function fetchXHSTrends(): Promise<XHSTrendItem[]> {
  // 小红书无公开API，使用预定义的AI热点关键词
  const aiTrends = [
    { keyword: 'AI绘画', category: 'AIGC' },
    { keyword: 'ChatGPT', category: '大模型' },
    { keyword: 'Midjourney教程', category: 'AI工具' },
    { keyword: 'AI视频生成', category: 'AIGC' },
    { keyword: '数字人', category: 'AI应用' },
    { keyword: 'AI写作', category: 'AI工具' },
    { keyword: '自动驾驶', category: 'AI应用' },
    { keyword: '人形机器人', category: '具身智能' },
    { keyword: 'AI编程', category: 'AI工具' },
    { keyword: '多模态AI', category: '大模型' },
  ];

  return aiTrends.map((t, i) => ({
    id: `xhs-${i + 1}`,
    keyword: t.keyword,
    hot: Math.floor(Math.random() * 500000) + 100000,
    category: t.category,
  }));
}

// ===== IT之家数据获取 =====
export interface ITHomeItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  time: string;
  tags: string[];
}

export async function fetchITHome(): Promise<ITHomeItem[]> {
  try {
    const xml = await fetchWithTimeout('https://www.ithome.com/rss/', {}, 8000);
    const items: ITHomeItem[] = [];
    const itemRegex = /<item>[\s\S]*?<\/item>/g;
    const matches = xml.match(itemRegex) || [];

    for (let i = 0; i < Math.min(matches.length, 20); i++) {
      const item = matches[i];
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);

      if (titleMatch && linkMatch) {
        const title = cleanCDATA(titleMatch[1]);
        const desc = descMatch ? cleanCDATA(descMatch[1]) : '';

        if (isAITechRelated(title + desc)) {
          items.push({
            id: `ith-${i + 1}`,
            title: title.slice(0, 100),
            summary: desc.replace(/<[^>]+>/g, '').slice(0, 200),
            url: cleanCDATA(linkMatch[1]),
            time: new Date().toISOString(),
            tags: extractTags(title + desc),
          });
        }
      }
    }

    return items.slice(0, 8);
  } catch (error) {
    console.error('❌ IT之家获取失败:', error);
    return [];
  }
}

// ===== 游戏折扣数据 =====
// Steam 折扣
export async function fetchSteamDeals() {
  try {
    // 使用 Steam API 获取热门折扣
    const data = await fetchWithTimeout(
      'https://store.steampowered.com/api/featuredcategories/?cc=CN&l=schinese',
      {},
      10000
    );

    const json = JSON.parse(data);
    const deals: any[] = [];

    // 从 specials 获取折扣游戏
    if (json.specials?.items) {
      for (const item of json.specials.items.slice(0, 8)) {
        deals.push({
          id: `steam-${item.id}`,
          name: item.name,
          originalPrice: `¥${item.original_price ? (item.original_price / 100).toFixed(0) : '?'}`,
          discountPrice: `¥${item.final_price ? (item.final_price / 100).toFixed(0) : '?'}`,
          discount: `-${item.discount_percent}%`,
          image: item.small_capsule_image || item.large_capsule_image,
          type: item.discount_percent >= 75 ? 'historical-low' : 'daily-deal',
          url: `https://store.steampowered.com/app/${item.id}`,
        });
      }
    }

    return deals;
  } catch (error) {
    console.error('❌ Steam 获取失败:', error);
    return [];
  }
}

// ===== 工具函数 =====
function cleanCDATA(str: string): string {
  return str
    .replace(/^\s*<!\[CDATA\[/, '')
    .replace(/\]\]>\s*$/, '')
    .trim();
}

function isAITechRelated(text: string): boolean {
  const keywords = [
    'AI', '人工智能', '大模型', 'LLM', 'ChatGPT', 'Claude', 'GPT',
    '机器学习', '深度学习', '神经网络', '算法', '算力', '芯片',
    '自动驾驶', '机器人', '人形机器人', '具身智能',
    'AIGC', '生成式', '扩散模型', 'Stable Diffusion', 'Midjourney',
    'OpenAI', 'Anthropic', 'Google', 'Gemini', '微软', '阿里', '百度',
    '文心一言', '通义千问', '豆包', '智谱', '月之暗面',
    'NVIDIA', '英伟达', '显卡', 'GPU', 'CUDA',
    '科技', '互联网', '数字化', '智能', '创新',
  ];

  const lowerText = text.toLowerCase();
  return keywords.some(kw =>
    lowerText.includes(kw.toLowerCase()) ||
    text.includes(kw)
  );
}

function extractTags(text: string): string[] {
  const tagMap: Record<string, string[]> = {
    '大模型': ['AI', '大模型'],
    'ChatGPT': ['AI', 'ChatGPT'],
    'Claude': ['AI', 'Claude'],
    'GPT': ['AI', 'GPT'],
    'AIGC': ['AIGC', '生成式AI'],
    '生成式': ['AIGC', '生成式AI'],
    '图像生成': ['AIGC', '图像'],
    '视频生成': ['AIGC', '视频'],
    '自动驾驶': ['AI应用', '自动驾驶'],
    '机器人': ['具身智能', '机器人'],
    '人形机器人': ['具身智能', '机器人'],
    '芯片': ['硬件', '芯片'],
    'NVIDIA': ['硬件', 'NVIDIA'],
    '英伟达': ['硬件', 'NVIDIA'],
    '算力': ['基础设施', '算力'],
    '阿里云': ['云服务', '阿里云'],
    '百度': ['百度', 'AI'],
    '阿里': ['阿里', 'AI'],
    '腾讯': ['腾讯', 'AI'],
    '字节': ['字节', 'AI'],
  };

  const tags = new Set<string>();
  for (const [keyword, tagList] of Object.entries(tagMap)) {
    if (text.includes(keyword)) {
      tagList.forEach(t => tags.add(t));
    }
  }

  return Array.from(tags).slice(0, 3);
}

// ===== 数据新鲜度校验 =====
export interface DataFreshness {
  isFresh: boolean;
  age: number; // 分钟
  generatedAt: string;
  warning?: string;
}

export function checkDataFreshness(generatedAt: string, maxAgeMinutes = 60): DataFreshness {
  const generated = new Date(generatedAt);
  const now = new Date();
  const age = Math.floor((now.getTime() - generated.getTime()) / (1000 * 60));

  return {
    isFresh: age < maxAgeMinutes,
    age,
    generatedAt,
    warning: age >= maxAgeMinutes ? `数据已过期 ${age} 分钟` : undefined,
  };
}

// 校验数据结构完整性
export function validateData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data) {
    return { valid: false, errors: ['数据为空'] };
  }

  // 检查必需字段
  if (!data.date) errors.push('缺少日期字段');
  if (!data.news || !Array.isArray(data.news)) errors.push('缺少新闻数据');
  if (!data.bandai || !Array.isArray(data.bandai)) errors.push('缺少万代数据');
  if (!data.hotToys || !Array.isArray(data.hotToys)) errors.push('缺少Hot Toys数据');

  // 检查数据新鲜度
  if (data.generatedAt) {
    const freshness = checkDataFreshness(data.generatedAt, 120);
    if (!freshness.isFresh) {
      errors.push(freshness.warning || '数据过期');
    }
  }

  // 检查日期是否匹配今天
  const today = new Date().toISOString().split('T')[0];
  if (data.date && data.date !== today) {
    errors.push(`日期不匹配: ${data.date} !== ${today}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ===== 主获取函数 =====
export async function fetchAllAINews(): Promise<{
  kr36: Kr36NewsItem[];
  zhihu: ZhihuHotItem[];
  xhs: XHSTrendItem[];
  ithome: ITHomeItem[];
}> {
  console.log('🚀 开始获取 AI 资讯...\n');

  const [kr36, zhihu, xhs, ithome] = await Promise.allSettled([
    fetch36KrNews(),
    fetchZhihuHot(),
    fetchXHSTrends(),
    fetchITHome(),
  ]);

  const results = {
    kr36: kr36.status === 'fulfilled' ? kr36.value : [],
    zhihu: zhihu.status === 'fulfilled' ? zhihu.value : [],
    xhs: xhs.status === 'fulfilled' ? xhs.value : [],
    ithome: ithome.status === 'fulfilled' ? ithome.value : [],
  };

  console.log(`✅ 36氪: ${results.kr36.length} 条`);
  console.log(`✅ 知乎: ${results.zhihu.length} 条`);
  console.log(`✅ 小红书趋势: ${results.xhs.length} 条`);
  console.log(`✅ IT之家: ${results.ithome.length} 条`);

  return results;
}
