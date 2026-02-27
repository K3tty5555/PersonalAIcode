// API 路由：提供每日数据
// 优先返回最新的 skill 数据，支持动态刷新

import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { todayPush } from '@/lib/data';

// 获取今日日期
function getTodayDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// 尝试读取 JSON 数据文件
function readJsonData() {
  const jsonPath = path.join(process.cwd(), 'lib', 'daily-data.json');

  if (!fs.existsSync(jsonPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(content);

    // 验证数据是否是今天的
    const today = getTodayDate();
    if (data.date === today) {
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

// GET /api/daily-data
export async function GET() {
  try {
    // 1. 优先尝试读取 JSON 数据文件（由 sync-from-skill.ts 生成）
    const jsonData = readJsonData();
    if (jsonData) {
      return NextResponse.json({
        ...jsonData,
        _source: 'json',
        _timestamp: new Date().toISOString(),
      });
    }

    // 2. 回退到静态导入的数据
    return NextResponse.json({
      date: todayPush.date,
      aiNews: todayPush.aiNews,
      bandai: todayPush.bandai,
      hotToys: todayPush.hotToys,
      gameDeals: todayPush.gameDeals,
      _source: 'static',
      _timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// 重新验证数据
export async function POST() {
  try {
    // 触发数据同步（异步执行，不等待结果）
    const { exec } = require('child_process');
    const scriptPath = path.join(process.cwd(), 'scripts', 'sync-from-skill.ts');

    exec(`npx tsx ${scriptPath}`, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error('Sync failed:', error);
        return;
      }
      console.log('Sync output:', stdout);
    });

    return NextResponse.json({
      message: 'Data sync triggered',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to trigger sync' },
      { status: 500 }
    );
  }
}
