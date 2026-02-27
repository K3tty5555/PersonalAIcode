'use client';

import { ArrowDown, Sparkles, Gamepad2, ToyBrick } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const categories = [
    { icon: Sparkles, label: 'AI热点', count: 'TOP 10', color: 'from-violet-500 to-purple-600' },
    { icon: ToyBrick, label: '模型手办', count: '新品', color: 'from-pink-500 to-rose-600' },
    { icon: Gamepad2, label: '游戏折扣', count: '精选', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900" />

      {/* 装饰性元素 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 日期标签 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {formattedDate}
        </div>

        {/* 主标题 */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="block text-zinc-400 dark:text-zinc-500 mb-2">今日</span>
          <span className="gradient-text">精选资讯</span>
        </h1>

        {/* 副标题 */}
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          AI前沿动态、万代新品发售、游戏限时折扣<br className="hidden sm:block" />
          三大领域，每日为你精选最有价值的内容
        </p>

        {/* 分类标签 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">{cat.label}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{cat.count}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA 按钮 */}
        <Button
          size="lg"
          className="rounded-full px-8 h-12 text-base bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
          onClick={() => document.getElementById('today')?.scrollIntoView({ behavior: 'smooth' })}
        >
          开始浏览
          <ArrowDown className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
    </section>
  );
}
