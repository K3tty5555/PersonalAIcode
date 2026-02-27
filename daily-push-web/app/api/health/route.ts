// API 路由：健康检查
// 返回数据新鲜度和同步状态

import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// 获取今日日期
function getTodayDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// 读取同步状态
function readSyncStatus() {
  const statusPath = path.join(process.cwd(), 'lib', 'sync-status.json');

  if (!fs.existsSync(statusPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
  } catch {
    return null;
  }
}

// GET /api/health
export async function GET() {
  try {
    const today = getTodayDate();
    const status = readSyncStatus();

    if (!status) {
      return NextResponse.json({
        isFresh: false,
        lastUpdated: 'unknown',
        needsUpdate: true,
        message: '未找到同步状态',
      });
    }

    const lastSync = new Date(status.timestamp).getTime();
    const now = Date.now();
    const hoursSinceSync = (now - lastSync) / (60 * 60 * 1000);
    const isFresh = status.date === today && hoursSinceSync < 25;

    return NextResponse.json({
      isFresh,
      lastUpdated: status.timestamp,
      needsUpdate: !isFresh,
      date: status.date,
      source: status.source,
      hoursSinceSync: Math.round(hoursSinceSync * 10) / 10,
      message: isFresh
        ? `数据正常，${hoursSinceSync.toFixed(1)}小时前同步`
        : `数据过期，上次同步: ${status.date}`,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        isFresh: false,
        lastUpdated: 'error',
        needsUpdate: true,
        message: '健康检查失败',
      },
      { status: 500 }
    );
  }
}
