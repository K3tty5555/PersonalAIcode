'use client';

import { ArrowDown } from 'lucide-react';

interface HeroProps {
  date: string;
}

export default function Hero({ date }: HeroProps) {
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Date badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-10">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-500 font-medium">{formattedDate}</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          今日精选
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
            资讯早报
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed">
          AI 前沿动态、万代新品发售、游戏限时折扣
          <br />
          每日为你精选最有价值的内容
        </p>

        {/* Scroll indicator */}
        <button
          onClick={() => document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors group"
        >
          <span className="text-xs font-medium uppercase tracking-wider">向下浏览</span>
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
