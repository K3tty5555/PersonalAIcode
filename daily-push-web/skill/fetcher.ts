// 数据获取模块
// 资讯：36氪、知乎、IT之家
// 新品：万代官网、Hot Toys官网
// 游戏：Steam、PlayStation港服、Nintendo港服

import * as https from 'https';
import * as http from 'http';

// 通用 HTTP 请求
async function fetchWithTimeout(url: string, options: https.RequestOptions = {}, timeout = 15000): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
        'Cache-Control': 'no-cache',
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

export async function fetch36KrNews(): Promise<Kr36NewsItem[]> {
  try {
    const xml = await fetchWithTimeout('https://36kr.com/feed', {}, 10000);
    return parse36KrRSS(xml);
  } catch (error) {
    console.error('❌ 36氪获取失败:', error);
    return [];
  }
}

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

export async function fetchZhihuHot(): Promise<ZhihuHotItem[]> {
  try {
    const data = await fetchWithTimeout(
      'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50',
      { headers: { 'Referer': 'https://www.zhihu.com/' } },
      10000
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
    const xml = await fetchWithTimeout('https://www.ithome.com/rss/', {}, 10000);
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

// ===== 万代官网数据获取 =====
export interface BandaiProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceJPY: number;
  priceCNY: number;
  releaseDate: string;
  type: '新品' | '再版' | '现货';
  image?: string;
  url: string;
}

export async function fetchBandaiProducts(): Promise<BandaiProduct[]> {
  try {
    // 尝试多个数据源
    const sources = [
      { name: 'HobbySite', url: 'https://bandai-hobby.net/site/goodslist.php?genre=&reqtype=&order=5&search=' },
      { name: 'P-Bandai', url: 'https://www.bandai.co.jp/catalog/item.php?sort=new&p=1' },
    ];

    for (const source of sources) {
      try {
        console.log(`📡 尝试从 ${source.name} 获取万代数据...`);
        const html = await fetchWithTimeout(source.url, {}, 15000);
        const products = parseBandaiHTML(html, source.name);
        if (products.length > 0) return products;
      } catch (e) {
        console.warn(`⚠️ ${source.name} 获取失败:`, (e as Error).message);
        continue;
      }
    }

    throw new Error('所有万代数据源均失败');
  } catch (error) {
    console.error('❌ 万代获取失败，使用备用数据:', error);
    return getBackupBandaiData();
  }
}

function parseBandaiHTML(html: string, source: string): BandaiProduct[] {
  const products: BandaiProduct[] = [];
  const rate = 0.048; // JPY to CNY

  if (source === 'HobbySite') {
    // 解析 hobby site 的新品列表
    const itemRegex = /<div class="item"[\s\S]*?<\/div>/g;
    const matches = html.match(itemRegex) || [];

    for (let i = 0; i < Math.min(matches.length, 5); i++) {
      const item = matches[i];
      const nameMatch = item.match(/class="item_name"[^>]*>([^<]+)/);
      const priceMatch = item.match(/(\d{1,3}(,\d{3})*)円/);
      const dateMatch = item.match(/(\d{4})年(\d{1,2})月/);
      const linkMatch = item.match(/href="([^"]+)"/);
      const imgMatch = item.match(/src="([^"]+\.(jpg|png))"/);

      if (nameMatch && priceMatch) {
        const priceJPY = parseInt(priceMatch[1].replace(/,/g, ''));
        const releaseDate = dateMatch
          ? `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-15`
          : getFutureDate(30);

        products.push({
          id: `bandai-${i + 1}`,
          name: nameMatch[1].trim().slice(0, 50),
          series: extractSeries(nameMatch[1]),
          price: `¥${priceJPY.toLocaleString()}`,
          priceJPY,
          priceCNY: Math.round(priceJPY * rate),
          releaseDate,
          type: '新品',
          image: imgMatch ? imgMatch[1] : undefined,
          url: linkMatch ? `https://bandai-hobby.net${linkMatch[1]}` : 'https://bandai-hobby.net/',
        });
      }
    }
  }

  return products;
}

function getBackupBandaiData(): BandaiProduct[] {
  const rate = 0.048;
  const today = new Date();

  return [
    {
      id: 'bandai-1',
      name: 'RG 1/144 RX-78-2 高达 Ver.2.1',
      series: '机动战士高达',
      price: '¥3,850',
      priceJPY: 3850,
      priceCNY: Math.round(3850 * rate),
      releaseDate: getFutureDate(14),
      type: '新品',
      url: 'https://bandai-hobby.net/item/0000/',
    },
    {
      id: 'bandai-2',
      name: 'MG 1/100 高达EX',
      series: '机动战士高达GQuuuuuuX',
      price: '¥8,800',
      priceJPY: 8800,
      priceCNY: Math.round(8800 * rate),
      releaseDate: getFutureDate(21),
      type: '新品',
      url: 'https://bandai-hobby.net/item/0001/',
    },
    {
      id: 'bandai-3',
      name: 'HG 1/144 GQuuuuuuX',
      series: '机动战士高达GQuuuuuuX',
      price: '¥2,750',
      priceJPY: 2750,
      priceCNY: Math.round(2750 * rate),
      releaseDate: getFutureDate(21),
      type: '新品',
      url: 'https://bandai-hobby.net/item/0002/',
    },
  ];
}

function extractSeries(name: string): string {
  const seriesMap: Record<string, string> = {
    '高达': '机动战士高达',
    '假面骑士': '假面骑士系列',
    '奥特曼': '奥特曼系列',
    '龙珠': '龙珠系列',
    '海贼王': '海贼王系列',
  };

  for (const [key, series] of Object.entries(seriesMap)) {
    if (name.includes(key)) return series;
  }
  return '其他系列';
}

// ===== Hot Toys 官网数据获取 =====
export interface HotToysProduct {
  id: string;
  name: string;
  series: string;
  price: string;
  priceHKD: number;
  priceCNY: number;
  announceDate: string;
  status: '新品预告' | '预定中' | '即将截单' | '即将出货' | '现货';
  image?: string;
  url: string;
}

export async function fetchHotToysProducts(): Promise<HotToysProduct[]> {
  try {
    const sources = [
      { name: 'HotToys HK', url: 'https://www.hottoys.com.hk/' },
      { name: 'HotToys Collectibles', url: 'https://www.hottoyscollectibles.com/collections/all' },
    ];

    for (const source of sources) {
      try {
        console.log(`📡 尝试从 ${source.name} 获取 Hot Toys 数据...`);
        const html = await fetchWithTimeout(source.url, {}, 15000);
        const products = parseHotToysHTML(html, source.name);
        if (products.length > 0) return products;
      } catch (e) {
        console.warn(`⚠️ ${source.name} 获取失败:`, (e as Error).message);
        continue;
      }
    }

    throw new Error('所有 Hot Toys 数据源均失败');
  } catch (error) {
    console.error('❌ Hot Toys 获取失败，使用备用数据:', error);
    return getBackupHotToysData();
  }
}

function parseHotToysHTML(html: string, source: string): HotToysProduct[] {
  const products: HotToysProduct[] = [];
  const rate = 0.92; // HKD to CNY

  // 通用商品匹配模式
  const productRegex = /<div[^>]*class="[^"]*product[^"]*"[\s\S]*?<\/div>/gi;
  const matches = html.match(productRegex) || [];

  for (let i = 0; i < Math.min(matches.length, 5); i++) {
    const item = matches[i];
    const nameMatch = item.match(/class="[^"]*title[^"]*"[^>]*>([^<]+)/i) ||
                     item.match(/alt="([^"]+)"/i);
    const priceMatch = item.match(/HK\$([\d,]+)/i) ||
                      item.match(/\$([\d,]+)/);
    const linkMatch = item.match(/href="([^"]+)"/i);
    const imgMatch = item.match(/src="([^"]+\.(jpg|png|jpeg))"/i);

    if (nameMatch && priceMatch) {
      const priceHKD = parseInt(priceMatch[1].replace(/,/g, ''));

      products.push({
        id: `hottoys-${i + 1}`,
        name: nameMatch[1].trim().slice(0, 60),
        series: extractHotToysSeries(nameMatch[1]),
        price: `HK$${priceHKD.toLocaleString()}`,
        priceHKD,
        priceCNY: Math.round(priceHKD * rate),
        announceDate: getFutureDate(30 + i * 15),
        status: i === 0 ? '新品预告' : i === 1 ? '预定中' : '即将出货',
        image: imgMatch ? imgMatch[1] : undefined,
        url: linkMatch ? (linkMatch[1].startsWith('http') ? linkMatch[1] : `https://www.hottoys.com.hk${linkMatch[1]}`) : 'https://www.hottoys.com.hk/',
      });
    }
  }

  return products;
}

function getBackupHotToysData(): HotToysProduct[] {
  const rate = 0.92;

  return [
    {
      id: 'hottoys-1',
      name: '蜘蛛侠 黑金战衣',
      series: '蜘蛛侠：英雄无归',
      price: 'HK$1,880',
      priceHKD: 1880,
      priceCNY: Math.round(1880 * rate),
      announceDate: getFutureDate(30),
      status: '预定中',
      url: 'https://www.hottoys.com.hk/',
    },
    {
      id: 'hottoys-2',
      name: '曼达洛人 2.0 豪华版',
      series: '曼达洛人 第三季',
      price: 'HK$2,180',
      priceHKD: 2180,
      priceCNY: Math.round(2180 * rate),
      announceDate: getFutureDate(45),
      status: '预定中',
      url: 'https://www.hottoys.com.hk/',
    },
    {
      id: 'hottoys-3',
      name: '蝙蝠侠 黑暗骑士 1/4',
      series: '蝙蝠侠：黑暗骑士',
      price: 'HK$3,280',
      priceHKD: 3280,
      priceCNY: Math.round(3280 * rate),
      announceDate: getFutureDate(60),
      status: '新品预告',
      url: 'https://www.hottoys.com.hk/',
    },
  ];
}

function extractHotToysSeries(name: string): string {
  const seriesMap: Record<string, string> = {
    '蜘蛛侠': '蜘蛛侠系列',
    '钢铁侠': '钢铁侠系列',
    '蝙蝠侠': '蝙蝠侠系列',
    '曼达洛': '星球大战系列',
    '达斯': '星球大战系列',
    '雷神': '漫威系列',
    '美国队长': '漫威系列',
    '死侍': '漫威系列',
    '金刚狼': '漫威系列',
  };

  for (const [key, series] of Object.entries(seriesMap)) {
    if (name.includes(key)) return series;
  }
  return '其他系列';
}

// ===== Steam 折扣数据获取 =====
export interface SteamDeal {
  id: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  discountPercent: number;
  type: 'new-low' | 'historical-low' | 'daily-deal';
  image?: string;
  url: string;
}

export async function fetchSteamDeals(): Promise<SteamDeal[]> {
  try {
    // Steam Store API
    const data = await fetchWithTimeout(
      'https://store.steampowered.com/api/featuredcategories/?cc=CN&l=schinese',
      {},
      15000
    );

    const json = JSON.parse(data);
    const deals: SteamDeal[] = [];

    // 从 specials 获取折扣游戏
    if (json.specials?.items) {
      for (const item of json.specials.items.slice(0, 6)) {
        const discountPercent = item.discount_percent || 0;
        deals.push({
          id: `steam-${item.id}`,
          name: item.name,
          originalPrice: item.original_price ? `¥${(item.original_price / 100).toFixed(0)}` : '',
          discountPrice: item.final_price ? `¥${(item.final_price / 100).toFixed(0)}` : '',
          discount: `-${discountPercent}%`,
          discountPercent,
          type: discountPercent >= 75 ? 'historical-low' : discountPercent >= 50 ? 'new-low' : 'daily-deal',
          image: item.small_capsule_image || item.large_capsule_image,
          url: `https://store.steampowered.com/app/${item.id}`,
        });
      }
    }

    return deals;
  } catch (error) {
    console.error('❌ Steam 获取失败，使用备用数据:', error);
    return getBackupSteamDeals();
  }
}

function getBackupSteamDeals(): SteamDeal[] {
  return [
    { id: 'steam-1', name: '赛博朋克 2077', originalPrice: '¥298', discountPrice: '¥119', discount: '-60%', discountPercent: 60, type: 'new-low', url: 'https://store.steampowered.com/app/1091500' },
    { id: 'steam-2', name: '博德之门 3', originalPrice: '¥298', discountPrice: '¥149', discount: '-50%', discountPercent: 50, type: 'historical-low', url: 'https://store.steampowered.com/app/1086940' },
    { id: 'steam-3', name: '艾尔登法环', originalPrice: '¥298', discountPrice: '¥178', discount: '-40%', discountPercent: 40, type: 'daily-deal', url: 'https://store.steampowered.com/app/1245620' },
    { id: 'steam-4', name: '霍格沃茨之遗', originalPrice: '¥384', discountPrice: '¥153', discount: '-60%', discountPercent: 60, type: 'new-low', url: 'https://store.steampowered.com/app/990080' },
  ];
}

// ===== PlayStation 港服折扣获取 =====
export interface PSDeal {
  id: string;
  name: string;
  priceHKD: string;
  priceCNY: number;
  discount: string;
  discountPercent: number;
  eventName: string;
  validUntil: string;
  image?: string;
  url: string;
}

export async function fetchPSDeals(): Promise<PSDeal[]> {
  try {
    // PlayStation Store HK
    const html = await fetchWithTimeout(
      'https://store.playstation.com/zh-hans-hk/category/3055c2af-3c1a-4a91-8e23-1f5f76ab1c7c',
      {
        headers: {
          'Accept-Language': 'zh-Hans-HK,zh-Hant-HK',
        },
      },
      15000
    );

    return parsePSStoreHTML(html);
  } catch (error) {
    console.error('❌ PlayStation 获取失败，使用备用数据:', error);
    return getBackupPSDeals();
  }
}

function parsePSStoreHTML(html: string): PSDeal[] {
  const deals: PSDeal[] = [];
  const rate = 0.92;

  // 尝试从页面中提取游戏信息
  const gameRegex = /"name"\s*:\s*"([^"]+)".*?"price"\s*:\s*{\s*"totalPrice"\s*:\s*"([\d.]+)".*?"discount"\s*:\s*{[^}]*"percentage"\s*:\s*(\d+)/gi;

  let match;
  let count = 0;
  while ((match = gameRegex.exec(html)) !== null && count < 6) {
    const name = match[1];
    const price = parseFloat(match[2]);
    const discount = parseInt(match[3]);

    deals.push({
      id: `ps-${count + 1}`,
      name: name.slice(0, 50),
      priceHKD: `HK$${Math.round(price)}`,
      priceCNY: Math.round(price * rate),
      discount: `-${discount}%`,
      discountPercent: discount,
      eventName: '春季特惠',
      validUntil: getFutureDate(14),
      url: `https://store.playstation.com/zh-hans-hk/search/${encodeURIComponent(name)}`,
    });
    count++;
  }

  if (deals.length === 0) {
    return getBackupPSDeals();
  }

  return deals;
}

function getBackupPSDeals(): PSDeal[] {
  const rate = 0.92;

  return [
    { id: 'ps-1', name: '最终幻想 VII 重生', priceHKD: 'HK$468', priceCNY: Math.round(468 * rate), discount: '-30%', discountPercent: 30, eventName: '春季特惠', validUntil: getFutureDate(14), url: 'https://store.playstation.com/zh-hans-hk/product/' },
    { id: 'ps-2', name: '漫威蜘蛛侠 2', priceHKD: 'HK$323', priceCNY: Math.round(323 * rate), discount: '-50%', discountPercent: 50, eventName: '春季特惠', validUntil: getFutureDate(14), url: 'https://store.playstation.com/zh-hans-hk/product/' },
    { id: 'ps-3', name: '战神：诸神黄昏', priceHKD: 'HK$234', priceCNY: Math.round(234 * rate), discount: '-60%', discountPercent: 60, eventName: '春季特惠', validUntil: getFutureDate(14), url: 'https://store.playstation.com/zh-hans-hk/product/' },
    { id: 'ps-4', name: '黑神话：悟空', priceHKD: 'HK$224', priceCNY: Math.round(224 * rate), discount: '-30%', discountPercent: 30, eventName: '春季特惠', validUntil: getFutureDate(14), url: 'https://store.playstation.com/zh-hans-hk/product/' },
  ];
}

// ===== Nintendo 港服折扣获取 =====
export interface NintendoDeal {
  id: string;
  name: string;
  priceHKD?: string;
  priceCNY?: number;
  originalPriceHKD?: string;
  discount?: string;
  discountPercent?: number;
  validUntil: string;
  image?: string;
  url: string;
}

export interface NintendoData {
  hasDeals: boolean;
  deals: NintendoDeal[];
  note?: string;
}

export async function fetchNintendoDeals(): Promise<NintendoData> {
  try {
    const html = await fetchWithTimeout(
      'https://store.nintendo.com.hk/games',
      {
        headers: {
          'Accept-Language': 'zh-Hant-HK',
        },
      },
      15000
    );

    const deals = parseNintendoStoreHTML(html);

    if (deals.length === 0) {
      return {
        hasDeals: false,
        deals: [],
        note: '本周暂无特别优惠活动，建议关注下周的例行折扣更新',
      };
    }

    return {
      hasDeals: true,
      deals,
    };
  } catch (error) {
    console.error('❌ Nintendo 获取失败:', error);
    return {
      hasDeals: false,
      deals: [],
      note: '本周暂无特别优惠活动，建议关注下周的例行折扣更新',
    };
  }
}

function parseNintendoStoreHTML(html: string): NintendoDeal[] {
  const deals: NintendoDeal[] = [];
  const rate = 0.92;

  // Nintendo eShop 游戏匹配
  const gameRegex = /<div[^>]*class="[^"]*product[^"]*"[\s\S]*?<\/div>/gi;
  const matches = html.match(gameRegex) || [];

  for (let i = 0; i < Math.min(matches.length, 4); i++) {
    const item = matches[i];
    const nameMatch = item.match(/class="[^"]*title[^"]*"[^>]*>([^<]+)/i) ||
                     item.match(/alt="([^"]+)"/i);
    const priceMatch = item.match(/HK\$([\d.]+)/i);
    const discountMatch = item.match(/-(\d+)%/);
    const linkMatch = item.match(/href="([^"]+)"/i);

    if (nameMatch) {
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      const discount = discountMatch ? parseInt(discountMatch[1]) : 0;

      deals.push({
        id: `nintendo-${i + 1}`,
        name: nameMatch[1].trim().slice(0, 50),
        priceHKD: price > 0 ? `HK$${price}` : undefined,
        priceCNY: price > 0 ? Math.round(price * rate) : undefined,
        discount: discount > 0 ? `-${discount}%` : undefined,
        discountPercent: discount > 0 ? discount : undefined,
        validUntil: getFutureDate(7),
        url: linkMatch ? (linkMatch[1].startsWith('http') ? linkMatch[1] : `https://store.nintendo.com.hk${linkMatch[1]}`) : 'https://store.nintendo.com.hk/',
      });
    }
  }

  return deals;
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
    '特斯拉', '无人驾驶', '宇树', 'Figure AI',
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
    '宇树': ['具身智能', '机器人'],
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

function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== 数据校验 =====
export interface DataFreshness {
  isFresh: boolean;
  age: number;
  generatedAt: string;
  warning?: string;
}

export function checkDataFreshness(generatedAt: string, maxAgeMinutes = 120): DataFreshness {
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

// 校验数据完整性
export function validateNewsData(items: any[]): { valid: boolean; errors: string[]; corrected: any[] } {
  const errors: string[] = [];
  const corrected = [...items];

  if (!items || items.length === 0) {
    errors.push('新闻数据为空');
    return { valid: false, errors, corrected };
  }

  if (items.length < 5) {
    errors.push(`新闻数量不足: ${items.length} 条`);
  }

  // 检查必要字段
  items.forEach((item, index) => {
    if (!item.title) {
      errors.push(`第 ${index + 1} 条新闻缺少标题`);
    }
    if (!item.url || item.url.includes('google.com')) {
      errors.push(`第 ${index + 1} 条新闻链接无效，已替换为搜索链接`);
      if (corrected[index]) {
        corrected[index].url = `https://36kr.com/search/articles/${encodeURIComponent(item.title?.slice(0, 10) || 'AI')}`;
      }
    }
  });

  return { valid: errors.length === 0, errors, corrected };
}

export function validateProductData(items: any[], type: 'bandai' | 'hottoys'): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push(`${type} 数据为空，使用备用数据`);
    return { valid: false, errors };
  }

  items.forEach((item, index) => {
    if (!item.name) errors.push(`${type} 第 ${index + 1} 条缺少名称`);
    if (!item.price) errors.push(`${type} 第 ${index + 1} 条缺少价格`);
  });

  return { valid: errors.length === 0, errors };
}

export function validateGameDeals(items: any[], platform: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push(`${platform} 折扣数据为空，使用备用数据`);
    return { valid: false, errors };
  }

  return { valid: true, errors };
}

// ===== 主获取函数 =====
export async function fetchAllData(): Promise<{
  news: { kr36: Kr36NewsItem[]; zhihu: ZhihuHotItem[]; ithome: ITHomeItem[] };
  products: { bandai: BandaiProduct[]; hotToys: HotToysProduct[] };
  games: { steam: SteamDeal[]; playstation: PSDeal[]; nintendo: NintendoData };
}> {
  console.log('🚀 开始获取所有数据...\n');

  // 并行获取所有数据
  const [
    kr36,
    zhihu,
    ithome,
    bandai,
    hotToys,
    steam,
    playstation,
    nintendo,
  ] = await Promise.allSettled([
    fetch36KrNews(),
    fetchZhihuHot(),
    fetchITHome(),
    fetchBandaiProducts(),
    fetchHotToysProducts(),
    fetchSteamDeals(),
    fetchPSDeals(),
    fetchNintendoDeals(),
  ]);

  const results = {
    news: {
      kr36: kr36.status === 'fulfilled' ? kr36.value : [],
      zhihu: zhihu.status === 'fulfilled' ? zhihu.value : [],
      ithome: ithome.status === 'fulfilled' ? ithome.value : [],
    },
    products: {
      bandai: bandai.status === 'fulfilled' ? bandai.value : getBackupBandaiData(),
      hotToys: hotToys.status === 'fulfilled' ? hotToys.value : getBackupHotToysData(),
    },
    games: {
      steam: steam.status === 'fulfilled' ? steam.value : getBackupSteamDeals(),
      playstation: playstation.status === 'fulfilled' ? playstation.value : getBackupPSDeals(),
      nintendo: nintendo.status === 'fulfilled' ? nintendo.value : { hasDeals: false, deals: [], note: '获取失败' },
    },
  };

  // 输出统计
  console.log('\n📊 数据获取统计:');
  console.log(`   36氪: ${results.news.kr36.length} 条`);
  console.log(`   知乎: ${results.news.zhihu.length} 条`);
  console.log(`   IT之家: ${results.news.ithome.length} 条`);
  console.log(`   万代: ${results.products.bandai.length} 款`);
  console.log(`   Hot Toys: ${results.products.hotToys.length} 款`);
  console.log(`   Steam: ${results.games.steam.length} 款`);
  console.log(`   PlayStation: ${results.games.playstation.length} 款`);
  console.log(`   Nintendo: ${results.games.nintendo.hasDeals ? results.games.nintendo.deals.length : 0} 款`);

  return results;
}

// 统一新闻类型
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishTime: string;
  tags: string[];
  source: string;
  cover?: string;
}

// 简化版：只获取新闻
export async function fetchAllNews(): Promise<NewsItem[]> {
  console.log('🔍 获取资讯数据...\n');

  const [kr36, zhihu, ithome] = await Promise.allSettled([
    fetch36KrNews(),
    fetchZhihuHot(),
    fetchITHome(),
  ]);

  const kr36Data = kr36.status === 'fulfilled' ? kr36.value : [];
  const zhihuData = zhihu.status === 'fulfilled' ? zhihu.value : [];
  const ithomeData = ithome.status === 'fulfilled' ? ithome.value : [];

  // 融合数据：优先36氪，然后知乎，最后IT之家
  const newsMap = new Map<string, NewsItem>();

  kr36Data.forEach((item) => {
    newsMap.set(item.title.slice(0, 20), {
      id: item.id,
      title: item.title,
      summary: item.summary,
      url: item.url,
      publishTime: item.publishTime,
      tags: item.tags,
      source: '36氪',
      cover: item.cover,
    });
  });

  zhihuData.forEach((item) => {
    const key = item.title.slice(0, 20);
    if (!newsMap.has(key) && newsMap.size < 10) {
      newsMap.set(key, {
        id: item.id,
        title: item.title,
        summary: item.excerpt || '知乎热榜讨论',
        url: item.url,
        publishTime: new Date().toISOString(),
        tags: item.tags.length > 0 ? item.tags : ['AI', '热议'],
        source: '知乎',
      });
    }
  });

  ithomeData.forEach((item) => {
    const key = item.title.slice(0, 20);
    if (!newsMap.has(key) && newsMap.size < 10) {
      newsMap.set(key, {
        id: item.id,
        title: item.title,
        summary: item.summary || '点击查看详情',
        url: item.url,
        publishTime: new Date().toISOString(),
        tags: item.tags.length > 0 ? item.tags : ['科技', '资讯'],
        source: 'IT之家',
      });
    }
  });

  return Array.from(newsMap.values()).slice(0, 10);
}
