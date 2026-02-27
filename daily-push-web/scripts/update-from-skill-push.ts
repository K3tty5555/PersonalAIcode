// 从 skill 9:00 推送更新数据
// 用法: npx tsx scripts/update-from-skill-push.ts "推送文本内容"

import * as fs from 'fs';
import * as path from 'path';

// 解析 skill 推送文本
function parseSkillPush(text: string) {
  const news: any[] = [];
  const keywords: string[] = [];

  // 提取关键词
  const kwMatch = text.match(/今日AI圈关键词[:：](.+)/);
  if (kwMatch) {
    keywords.push(...kwMatch[1].split(/[|｜]/).map(k => k.trim()).filter(Boolean));
  }

  // 提取新闻 (匹配 **1️⃣ 标题** 格式)
  const newsMatches = text.matchAll(/\*\*[\d１２３４５６７８９０][️⃣]?\s*(.+?)\*\*[\s\n]*🏷️\s*(.+?)[\s\n]*💬\s*(.+?)(?=\*\*[\d１２３４５６７８９０]|$)/gs);
  let rank = 1;
  for (const match of newsMatches) {
    news.push({
      id: `ai-${rank}`,
      rank: rank,
      title: match[1].trim(),
      keywords: match[2].trim().split(/[,，、]/).map((k: string) => k.trim()).filter(Boolean),
      highlight: match[3].trim(),
      url: '',
      source: 'AI热点',
    });
    rank++;
  }

  return { news, keywords };
}

// 更新 data.ts 中的新闻数据
function updateDataFile(newsData: { news: any[]; keywords: string[] }) {
  const dataPath = path.join(__dirname, '../lib/data.ts');
  let content = fs.readFileSync(dataPath, 'utf-8');

  // 替换 keywords
  const keywordsMatch = content.match(/keywords:\s*(\[[\s\S]*?\]),/);
  if (keywordsMatch) {
    content = content.replace(keywordsMatch[0], `keywords: ${JSON.stringify(newsData.keywords)},`);
  }

  // 替换 items 数组
  const itemsMatch = content.match(/items:\s*(\[[\s\S]*?\](?=,\s*bandai:))/);
  if (itemsMatch) {
    content = content.replace(
      itemsMatch[0],
      `items: ${JSON.stringify(newsData.news, null, 2)}`
    );
  }

  fs.writeFileSync(dataPath, content, 'utf-8');
  console.log('✅ 已从 skill 推送更新数据');
  console.log(`📊 更新新闻: ${newsData.news.length} 条`);
  console.log(`🏷️ 关键词: ${newsData.keywords.join(' | ')}`);
}

// 主函数
async function main() {
  const pushText = process.argv[2];

  if (!pushText) {
    console.log('用法: npx tsx scripts/update-from-skill-push.ts "推送文本"');
    console.log('或者设置环境变量 SKILL_PUSH_TEXT');
    process.exit(1);
  }

  const data = parseSkillPush(pushText);

  if (data.news.length === 0) {
    console.error('❌ 未能从推送文本解析出新闻');
    process.exit(1);
  }

  updateDataFile(data);
}

// 如果设置了环境变量，自动执行
if (process.env.SKILL_PUSH_TEXT) {
  parseSkillPush(process.env.SKILL_PUSH_TEXT);
  updateDataFile(parseSkillPush(process.env.SKILL_PUSH_TEXT));
} else {
  main();
}
