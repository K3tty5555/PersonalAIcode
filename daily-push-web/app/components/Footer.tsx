'use client';

import { Newspaper } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Daily Push</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 text-center max-w-md">
            AI 热点、万代新品、游戏折扣，每日为你精选最有价值的资讯
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#ai" className="hover:text-gray-900 transition-colors">AI 热点</a>
            <span className="text-gray-300">·</span>
            <a href="#toys" className="hover:text-gray-900 transition-colors">收藏模型</a>
            <span className="text-gray-300">·</span>
            <a href="#games" className="hover:text-gray-900 transition-colors">游戏折扣</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© {currentYear} Daily Push. All rights reserved.</p>
            <p>汇率数据仅供参考，实际以交易时为准</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
