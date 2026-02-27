// 健康检查脚本 - 监控数据新鲜度并自动修复
// 用法: npx tsx scripts/health-check.ts

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CONFIG = {
  dataPath: path.join(__dirname, '../lib/data.ts'),
  syncStatusPath: path.join(__dirname, '../lib/sync-status.json'),
  freshnessThreshold: 25 * 60 * 60 * 1000, // 25小时
  autoFix: process.env.AUTO_FIX === 'true',
};

function getTodayDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

interface HealthStatus {
  healthy: boolean;
  date: string;
  dataFresh: boolean;
  dataAge: number; // 小时
  message: string;
  action?: string;
}

function checkHealth(): HealthStatus {
  const today = getTodayDate();

  // 检查 data.ts 文件是否存在
  if (!fs.existsSync(CONFIG.dataPath)) {
    return {
      healthy: false,
      date: today,
      dataFresh: false,
      dataAge: Infinity,
      message: '数据文件不存在',
      action: '需要立即运行同步脚本',
    };
  }

  // 检查同步状态
  if (!fs.existsSync(CONFIG.syncStatusPath)) {
    return {
      healthy: false,
      date: today,
      dataFresh: false,
      dataAge: Infinity,
      message: '同步状态文件不存在',
      action: '需要立即运行同步脚本',
    };
  }

  try {
    const status = JSON.parse(fs.readFileSync(CONFIG.syncStatusPath, 'utf-8'));
    const lastSync = new Date(status.timestamp).getTime();
    const now = Date.now();
    const ageHours = (now - lastSync) / (60 * 60 * 1000);
    const isFresh = status.date === today && (now - lastSync) < CONFIG.freshnessThreshold;

    if (isFresh) {
      return {
        healthy: true,
        date: today,
        dataFresh: true,
        dataAge: ageHours,
        message: `数据正常，${ageHours.toFixed(1)} 小时前同步`,
      };
    }

    if (status.date !== today) {
      return {
        healthy: false,
        date: today,
        dataFresh: false,
        dataAge: ageHours,
        message: `数据过期: 上次同步是 ${status.date}，今天是 ${today}`,
        action: '需要运行同步脚本获取今日数据',
      };
    }

    return {
      healthy: false,
      date: today,
      dataFresh: false,
      dataAge: ageHours,
      message: `数据已过期 ${ageHours.toFixed(1)} 小时`,
      action: '需要运行同步脚本刷新数据',
    };
  } catch (error) {
    return {
      healthy: false,
      date: today,
      dataFresh: false,
      dataAge: Infinity,
      message: '读取同步状态失败',
      action: '需要立即运行同步脚本',
    };
  }
}

function autoFix(): boolean {
  console.log('🔧 尝试自动修复...');
  try {
    const syncScript = path.join(__dirname, 'sync-from-skill.ts');
    execSync(`npx tsx ${syncScript}`, { stdio: 'inherit' });
    console.log('✅ 自动修复成功');
    return true;
  } catch (error) {
    console.error('❌ 自动修复失败:', error);
    return false;
  }
}

function main() {
  console.log('🏥 运行健康检查...\n');

  const status = checkHealth();

  // 输出状态
  if (status.healthy) {
    console.log('🟢', status.message);
    process.exit(0);
  } else {
    console.log('🔴', status.message);
    if (status.action) {
      console.log('📋', status.action);
    }

    // 自动修复
    if (CONFIG.autoFix) {
      console.log('');
      const fixed = autoFix();
      process.exit(fixed ? 0 : 1);
    }

    process.exit(1);
  }
}

// CLI 用法
if (require.main === module) {
  main();
}

export { checkHealth };
export type { HealthStatus };
