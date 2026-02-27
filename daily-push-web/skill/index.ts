#!/usr/bin/env node
// Skill 统一入口
// 使用: npx tsx skill/index.ts [command]

import { main as generateMain } from './generator';

// 命令类型
type Command = 'generate' | 'health' | 'help';

// 健康检查
async function healthCheck() {
  const fs = await import('fs');
  const path = await import('path');

  const dataPath = path.resolve(process.cwd(), './lib/daily-data.json');
  const statusPath = path.resolve(process.cwd(), './lib/sync-status.json');

  console.log('🏥 健康检查\n');

  const issues: string[] = [];

  if (!fs.existsSync(dataPath)) {
    issues.push('数据文件不存在');
  } else {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    if (!data.news || data.news.length === 0) {
      issues.push('新闻数据为空');
    }
    if (!data.bandai || data.bandai.length === 0) {
      issues.push('万代数据为空');
    }
    if (!data.hotToys || data.hotToys.length === 0) {
      issues.push('Hot Toys数据为空');
    }

    const age = (Date.now() - new Date(data.generatedAt).getTime()) / 60000;
    if (age > 120) {
      issues.push(`数据已过期 (${Math.round(age)}分钟)`);
    }
  }

  if (issues.length === 0) {
    console.log('✅ 系统健康');
    return true;
  } else {
    console.log('⚠️ 发现问题:');
    issues.forEach((i) => console.log(`   - ${i}`));
    return false;
  }
}

// 显示帮助
function showHelp() {
  console.log(`
🚀 Skill - 每日推送数据生成器

用法:
  npx tsx skill/index.ts [command]

命令:
  generate    生成每日数据 (默认)
  health      运行健康检查
  help        显示帮助

示例:
  npx tsx skill/index.ts              # 生成今日数据
  npx tsx skill/index.ts health       # 检查数据健康
`);
}

// 主入口
async function run() {
  const args = process.argv.slice(2);
  const command: Command = (args[0] as Command) || 'generate';

  switch (command) {
    case 'generate':
      await generateMain();
      break;
    case 'health':
      await healthCheck();
      break;
    case 'help':
      showHelp();
      break;
    default:
      console.log(`❌ 未知命令: ${command}`);
      showHelp();
      process.exit(1);
  }
}

run().catch((error) => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});
