#!/usr/bin/env node
// Skill 统一入口 V2
// 整合数据生成和网站同步 - 使用真实数据源

import * as fs from 'fs';
import * as path from 'path';
import { generateDailyData, saveDailyData, healthCheck } from './generator-v2';
import { getTodayDate } from './config';

// 路径配置
const PATHS = {
  skillOutput: './skill/output',
  webDataTs: './lib/data.ts',
  webDataJson: './lib/daily-data.json',
  webSyncStatus: './lib/sync-status.json',
} as const;

// 数据类型定义
interface DailyPushData {
  date: string;
  keywords: string[];
  news: any[];
  bandai: any[];
  hotToys: any[];
  steam: any[];
  playstation: any[];
  nintendo: {
    hasDeals: boolean;
    deals: any[];
    note?: string;
  };
  generatedAt: string;
  dataQuality: {
    freshness: 'fresh' | 'warning' | 'stale';
    sources: string[];
    confidence: number;
  };
}

// 读取生成的数据文件
function readGeneratedData(date?: string): DailyPushData | null {
  const targetDate = date || getTodayDate();
  const filePath = path.resolve(process.cwd(), PATHS.skillOutput, `daily-push-${targetDate}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 数据文件不存在: ${filePath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 读取数据文件失败:`, error);
    return null;
  }
}

// 生成 TypeScript 数据文件
function generateDataTS(data: DailyPushData): string {
  return `// 自动生成的数据文件
// 生成时间: ${data.generatedAt}
// 数据来源: skill 每日推送 (V2)
// 数据质量: 置信度 ${data.dataQuality.confidence}%, 新鲜度 ${data.dataQuality.freshness}

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
  image?: string;
  publishTime?: string;
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
  discountPercent: number;
  type: 'new-low' | 'historical-low' | 'daily-deal';
  image?: string;
  url?: string;
}

export interface PSDeal {
  id: string;
  name: string;
  priceHKD: string;
  priceCNY?: number;
  discount: string;
  discountPercent: number;
  eventName: string;
  validUntil: string;
  image?: string;
  url?: string;
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

// 同步数据到网站目录
async function syncToWebsite(data: DailyPushData): Promise<boolean> {
  try {
    console.log('\n🔄 同步数据到网站...');

    // 确保目录存在
    const webDir = path.dirname(path.resolve(process.cwd(), PATHS.webDataTs));
    if (!fs.existsSync(webDir)) {
      fs.mkdirSync(webDir, { recursive: true });
    }

    // 1. 保存 JSON 数据（供 API 动态读取）
    const jsonPath = path.resolve(process.cwd(), PATHS.webDataJson);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ JSON 数据: ${jsonPath}`);

    // 2. 生成 TypeScript 文件（静态导入）
    const tsPath = path.resolve(process.cwd(), PATHS.webDataTs);
    const tsContent = generateDataTS(data);
    fs.writeFileSync(tsPath, tsContent, 'utf-8');
    console.log(`✅ TypeScript 数据: ${tsPath}`);

    // 3. 保存同步状态
    const statusPath = path.resolve(process.cwd(), PATHS.webSyncStatus);
    const status = {
      success: true,
      date: data.date,
      source: 'skill-v2',
      isFresh: data.dataQuality.freshness === 'fresh',
      confidence: data.dataQuality.confidence,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');
    console.log(`✅ 同步状态: ${statusPath}`);

    return true;
  } catch (error) {
    console.error('❌ 同步失败:', error);
    return false;
  }
}

// 主流程
async function run(options: { generate?: boolean; sync?: boolean; date?: string } = {}) {
  console.log('🚀 Skill V2 启动\n');

  const { generate = true, sync = true, date } = options;

  let data: DailyPushData | null = null;

  // 1. 生成数据
  if (generate) {
    console.log('📦 步骤 1: 生成数据 (使用真实数据源)\n');
    try {
      data = await generateDailyData(date);
      saveDailyData(data);
    } catch (error) {
      console.error('❌ 数据生成失败:', error);
      process.exit(1);
    }
  }

  // 2. 读取数据（如果没有生成）
  if (!data) {
    data = readGeneratedData(date);
  }

  // 3. 同步到网站
  if (sync && data) {
    console.log('\n📦 步骤 2: 同步到网站\n');
    const success = await syncToWebsite(data);
    if (!success) {
      process.exit(1);
    }
  }

  // 4. 健康检查
  console.log('\n📦 步骤 3: 健康检查\n');
  const health = await healthCheck();
  if (health.healthy) {
    console.log('✅ 系统健康');
  } else {
    console.log('⚠️ 发现警告:');
    health.issues.forEach(i => console.log(`   - ${i}`));
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ 全部完成！');
  console.log('='.repeat(50));
  console.log(`\n📊 数据摘要 (${data?.date}):`);
  console.log(`   AI热点: ${data?.news.length} 条 (来源: ${data?.dataQuality.sources.join(', ')})`);
  console.log(`   数据置信度: ${data?.dataQuality.confidence}%`);
  console.log(`   新鲜度: ${data?.dataQuality.freshness}`);
  console.log(`   万代: ${data?.bandai.length} 款`);
  console.log(`   Hot Toys: ${data?.hotToys.length} 款`);
  console.log(`   Steam: ${data?.steam.length} 款`);
}

// CLI 解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options: { generate?: boolean; sync?: boolean; date?: string; health?: boolean } = {
    generate: true,
    sync: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--generate-only':
        options.generate = true;
        options.sync = false;
        break;
      case '--sync-only':
        options.generate = false;
        options.sync = true;
        break;
      case '--date':
      case '-d':
        options.date = args[++i];
        break;
      case '--health':
        options.health = true;
        break;
      case '--help':
      case '-h':
        console.log(`
Usage: npx tsx skill/index.ts [options]

Options:
  --generate-only    仅生成数据，不同步
  --sync-only        仅同步，不生成（使用已有数据）
  --date, -d DATE    指定日期 (YYYY-MM-DD)
  --health           运行健康检查
  --help, -h         显示帮助

Examples:
  npx tsx skill/index.ts              # 生成并同步今日数据
  npx tsx skill/index.ts --date 2026-02-27  # 生成指定日期数据
  npx tsx skill/index.ts --sync-only  # 同步已有数据
        `);
        process.exit(0);
        break;
    }
  }

  return options;
}

// 执行
if (require.main === module) {
  const options = parseArgs();

  if (options.health) {
    healthCheck().then(health => {
      console.log(health.healthy ? '✅ 系统健康' : '⚠️ 需要关注');
      if (health.issues.length > 0) {
        console.log('\n问题:');
        health.issues.forEach(i => console.log(`  - ${i}`));
      }
      if (health.recommendations.length > 0) {
        console.log('\n建议:');
        health.recommendations.forEach(r => console.log(`  - ${r}`));
      }
    });
  } else {
    run(options).catch(error => {
      console.error('❌ 执行失败:', error);
      process.exit(1);
    });
  }
}

export { run, generateDailyData, syncToWebsite, healthCheck };
