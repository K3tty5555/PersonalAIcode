// 从 Skill 同步数据到网站
// 支持自动重试、兜底机制、健康检查
// 运行时机：9:00 后定时执行，或手动触发

import * as fs from 'fs';
import * as path from 'path';

// 配置
const CONFIG = {
  // Skill 输出目录（相对路径）
  skillOutputDir: path.join(__dirname, '../../../skill/skill-hub/.claude/skills/daily-push-suite/output'),
  // 网站数据文件路径
  websiteDataPath: path.join(__dirname, '../lib/data.ts'),
  // JSON 数据文件路径（用于动态读取）
  jsonDataPath: path.join(__dirname, '../lib/daily-data.json'),
  // 最大重试次数
  maxRetries: 3,
  // 重试间隔（毫秒）
  retryInterval: 5 * 60 * 1000, // 5分钟
  // 数据新鲜度阈值（毫秒）- 超过此时间认为数据过期
  freshnessThreshold: 25 * 60 * 60 * 1000, // 25小时
};

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

interface SwitchDeal {
  id: string;
  name: string;
  price?: string;
  discount?: string;
  region: 'JP' | 'HK' | 'US';
  available: boolean;
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

// 获取昨日日期
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 计算未来日期
function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 读取指定日期的数据文件
function readDataForDate(date: string): DailyPushData | null {
  const jsonPath = path.join(CONFIG.skillOutputDir, `daily-push-${date}.json`);

  if (!fs.existsSync(jsonPath)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`✅ 读取数据: ${jsonPath}`);
    return data;
  } catch (error) {
    console.error(`❌ 读取失败 ${jsonPath}:`, error);
    return null;
  }
}

// 尝试读取今日数据，如果不存在则返回昨日数据（兜底机制）
function readDataWithFallback(): { data: DailyPushData; source: string; isFresh: boolean } | null {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // 1. 优先读取今日数据
  const todayData = readDataForDate(today);
  if (todayData) {
    return { data: todayData, source: 'today', isFresh: true };
  }

  console.log(`⚠️ 今日数据 (${today}) 不存在，尝试使用昨日数据兜底...`);

  // 2. 尝试读取昨日数据
  const yesterdayData = readDataForDate(yesterday);
  if (yesterdayData) {
    console.log(`⚠️ 使用昨日数据 (${yesterday}) 作为兜底`);
    return { data: yesterdayData, source: 'yesterday', isFresh: false };
  }

  // 3. 尝试读取最近7天的数据
  console.log('⚠️ 尝试读取最近7天的数据...');
  for (let i = 2; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const data = readDataForDate(dateStr);
    if (data) {
      console.log(`⚠️ 使用 ${dateStr} 的数据作为兜底`);
      return { data, source: `history-${dateStr}`, isFresh: false };
    }
  }

  return null;
}

// 生成 data.ts 文件内容
function generateDataTS(data: DailyPushData): string {
  return `// 资讯数据类型定义
// 生成时间: ${new Date().toISOString()}
// 数据来源: skill 每日推送

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
  priceCNY?: number;
  releaseDate: string;
  type?: string;
  image?: string;
  url?: string;
}

export interface HotToysProduct {
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

// 今日数据
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
    steam: ${JSON.stringify(data.steam.slice(0, 6), null, 2)},
    playstation: ${JSON.stringify(data.playstation.slice(0, 4), null, 2)},
    nintendo: ${JSON.stringify(data.nintendo, null, 2)},
  },
};

// 历史数据
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

// 保存 JSON 格式数据（供动态读取）
function saveJsonData(data: DailyPushData) {
  const jsonData = {
    ...data,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CONFIG.jsonDataPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`💾 JSON 数据已保存: ${CONFIG.jsonDataPath}`);
}

// 保存同步状态
function saveSyncStatus(status: { success: boolean; date: string; source: string; isFresh: boolean; timestamp: string; error?: string }) {
  const statusPath = path.join(__dirname, '../lib/sync-status.json');
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');
}

// 读取同步状态
function readSyncStatus(): { success: boolean; date: string; timestamp: string } | null {
  const statusPath = path.join(__dirname, '../lib/sync-status.json');
  if (!fs.existsSync(statusPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
  } catch {
    return null;
  }
}

// 检查数据是否需要更新
function needsUpdate(): boolean {
  const today = getTodayDate();
  const status = readSyncStatus();

  if (!status) {
    return true;
  }

  // 如果上次同步不是今天，需要更新
  if (status.date !== today) {
    return true;
  }

  // 检查数据新鲜度
  const lastSync = new Date(status.timestamp).getTime();
  const now = Date.now();
  if (now - lastSync > CONFIG.freshnessThreshold) {
    console.log('⚠️ 数据已过期，需要更新');
    return true;
  }

  return false;
}

// 主同步函数
async function syncFromSkill(attempt = 1): Promise<boolean> {
  const today = getTodayDate();

  console.log(`\n🚀 开始同步数据 (尝试 ${attempt}/${CONFIG.maxRetries})...`);
  console.log(`📅 今日日期: ${today}`);

  try {
    // 检查是否需要更新
    if (!needsUpdate()) {
      console.log('✅ 数据已是最新，无需更新');
      return true;
    }

    // 读取数据（带兜底机制）
    const result = readDataWithFallback();
    if (!result) {
      throw new Error('无法读取任何数据（今日、昨日或历史数据）');
    }

    const { data, source, isFresh } = result;

    // 生成并保存 TypeScript 文件
    console.log('📝 生成 data.ts 文件...');
    const dataTS = generateDataTS(data);
    fs.writeFileSync(CONFIG.websiteDataPath, dataTS, 'utf-8');

    // 同时保存 JSON 文件（供动态读取）
    saveJsonData(data);

    // 保存同步状态
    saveSyncStatus({
      success: true,
      date: today,
      source,
      isFresh,
      timestamp: new Date().toISOString(),
    });

    console.log('\n✅ 数据同步成功！');
    console.log(`📊 AI热点: ${data.news.length} 条`);
    console.log(`🎌 万代: ${data.bandai.length} 款`);
    console.log(`🔥 Hot Toys: ${data.hotToys.length} 款`);
    console.log(`🎮 Steam折扣: ${data.steam.length} 款`);
    console.log(`📅 数据来源: ${source} ${isFresh ? '(最新)' : '(兜底)'}`);

    // 如果不是最新数据，安排重试
    if (!isFresh && attempt < CONFIG.maxRetries) {
      console.log(`\n⏳ 将在 ${CONFIG.retryInterval / 60000} 分钟后重试获取今日数据...`);
      setTimeout(() => {
        syncFromSkill(attempt + 1);
      }, CONFIG.retryInterval);
    }

    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ 同步失败:', errorMsg);

    saveSyncStatus({
      success: false,
      date: today,
      source: 'error',
      isFresh: false,
      timestamp: new Date().toISOString(),
      error: errorMsg,
    });

    // 安排重试
    if (attempt < CONFIG.maxRetries) {
      console.log(`\n⏳ 将在 ${CONFIG.retryInterval / 60000} 分钟后重试 (${attempt + 1}/${CONFIG.maxRetries})...`);
      setTimeout(() => {
        syncFromSkill(attempt + 1);
      }, CONFIG.retryInterval);
    } else {
      console.error('❌ 已达到最大重试次数，同步失败');
    }

    return false;
  }
}

// 健康检查函数
function healthCheck(): { healthy: boolean; message: string } {
  const today = getTodayDate();
  const status = readSyncStatus();

  if (!status) {
    return { healthy: false, message: '未找到同步状态，需要立即同步' };
  }

  if (status.date !== today) {
    return { healthy: false, message: `数据过期: 上次同步是 ${status.date}` };
  }

  const lastSync = new Date(status.timestamp).getTime();
  const now = Date.now();
  const hoursSinceSync = (now - lastSync) / (60 * 60 * 1000);

  if (hoursSinceSync > 24) {
    return { healthy: false, message: `数据已过期 ${hoursSinceSync.toFixed(1)} 小时` };
  }

  return { healthy: true, message: `数据正常，${hoursSinceSync.toFixed(1)} 小时前同步` };
}

// CLI 用法
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === '--health-check' || command === '-c') {
    const result = healthCheck();
    console.log(result.healthy ? '🟢' : '🔴', result.message);
    process.exit(result.healthy ? 0 : 1);
  } else if (command === '--retry' || command === '-r') {
    // 强制重试，忽略已有状态
    syncFromSkill(1).then(success => {
      process.exit(success ? 0 : 1);
    });
  } else {
    // 默认执行同步
    syncFromSkill(1).then(success => {
      process.exit(success ? 0 : 1);
    });
  }
}

export { syncFromSkill, healthCheck, readDataWithFallback };
