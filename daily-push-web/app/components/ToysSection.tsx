'use client';

import { ToyBrick, Flame, Package, Crown, Star, Calendar, Tag, Sparkles, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BandaiProduct, HotToysProduct } from '@/lib/data';

interface ToysSectionProps {
  bandai: BandaiProduct[];
  hotToys: HotToysProduct[];
}

// 万代品牌色 - 日本传统色
const BANDAI_COLORS = {
  bg: 'from-blue-900 via-blue-800 to-indigo-900',
  card: 'bg-blue-950/80',
  accent: '#3b82f6',
  accentLight: '#60a5fa',
  text: '#e0e7ff',
  textMuted: '#94a3b8',
  border: 'border-blue-700/30',
};

// Hot Toys 品牌色 - 奢华金红
const HOTTOYS_COLORS = {
  bg: 'from-red-950 via-red-900 to-amber-950',
  card: 'bg-red-950/80',
  accent: '#f59e0b',
  accentLight: '#fbbf24',
  text: '#fef3c7',
  textMuted: '#d4d4d8',
  border: 'border-amber-700/30',
};

// 状态标签样式
const getStatusStyle = (status: string) => {
  switch (status) {
    case '新品预告':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case '预定中':
      return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
    case '即将截单':
      return 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse';
    case '即将出货':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    case '再版预定':
      return 'bg-gradient-to-r from-violet-500 to-purple-500 text-white';
    default:
      return 'bg-slate-600 text-white';
  }
};

export default function ToysSection({ bandai, hotToys }: ToysSectionProps) {
  return (
    <section id="toys" className="py-24 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

      {/* 装饰性背景 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - 收藏展示风格 */}
        <div className="flex items-center gap-4 mb-12">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <ToyBrick className="w-7 h-7 text-white" />
            </div>
            {/* 皇冠装饰 */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
              <Crown className="w-3.5 h-3.5 text-amber-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display">收藏模型</h2>
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                PREMIUM
              </Badge>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              万代 BANDAI & Hot Toys 新品发售情报
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bandai Section - 日本传统 + 科技风 */}
          <div className={`rounded-2xl bg-gradient-to-br ${BANDAI_COLORS.bg} p-1 shadow-2xl`}>
            <div className={`${BANDAI_COLORS.card} backdrop-blur-sm rounded-xl overflow-hidden`}>
              {/* Bandai Header */}
              <div className="px-6 py-5 border-b border-blue-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        万代 BANDAI
                        <Sparkles className="w-4 h-4 text-blue-300" />
                      </CardTitle>
                      <p className="text-xs text-blue-300/70 mt-0.5">2026年发售情报 · 高达 & 假面骑士</p>
                    </div>
                  </div>
                  <Badge className="text-xs border-0 bg-blue-500/20 text-blue-200">
                    {bandai.length} 款新品
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {bandai.map((product, index) => (
                    <div
                      key={product.id}
                      className="group relative p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
                      style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)' }}
                    >
                      {/* 悬停光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* 左侧装饰条 */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-xl" />

                      <div className="relative pl-4">
                        {/* 产品标题行 */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                                {product.name}
                              </h4>
                              {product.type && (
                                <Badge className={`text-[10px] px-2 py-0.5 border-0 ${
                                  product.type === '新品'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                    : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                                }`}>
                                  {product.type}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-blue-200/60 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {product.series}
                            </p>
                          </div>
                          {/* 序号 */}
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-300">
                            {index + 1}
                          </div>
                        </div>

                        {/* 价格与日期 */}
                        <div className="flex items-center justify-between pt-3 border-t border-blue-700/30">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-white">
                              {product.price}
                            </span>
                            {product.priceCNY && (
                              <span className="text-sm text-blue-300/70">
                                ≈ ¥{product.priceCNY}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-blue-300/60">
                            <Calendar className="w-3.5 h-3.5" />
                            {product.releaseDate}
                          </div>
                        </div>
                      </div>

                      {/* 箭头指示 */}
                      <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                <Separator className="my-5 bg-blue-700/30" />

                {/* 汇率信息 */}
                <div className="flex items-center justify-between text-sm px-2">
                  <span className="flex items-center gap-2 text-blue-300/50">
                    <Tag className="w-4 h-4" />
                    汇率参考
                  </span>
                  <span className="font-mono text-xs text-blue-400/70 bg-blue-900/30 px-3 py-1 rounded-full">
                    JPY × 0.048 ≈ CNY
                  </span>
                </div>
              </CardContent>
            </div>
          </div>

          {/* Hot Toys Section - 奢华金红风格 */}
          <div className={`rounded-2xl bg-gradient-to-br ${HOTTOYS_COLORS.bg} p-1 shadow-2xl`}>
            <div className={`${HOTTOYS_COLORS.card} backdrop-blur-sm rounded-xl overflow-hidden`}>
              {/* Hot Toys Header */}
              <div className="px-6 py-5 border-b border-amber-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        Hot Toys
                        <Crown className="w-4 h-4 text-amber-400" />
                      </CardTitle>
                      <p className="text-xs text-amber-300/70 mt-0.5">高端收藏级人偶 · 2026新品预告</p>
                    </div>
                  </div>
                  <Badge className="text-xs border-0 bg-amber-500/20 text-amber-200">
                    {hotToys.length} 款精选
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {hotToys.map((product, index) => (
                    <div
                      key={product.id}
                      className="group relative p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
                      style={{ backgroundColor: 'rgba(69, 10, 10, 0.5)' }}
                    >
                      {/* 悬停光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* 左侧装饰条 */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-red-500 rounded-l-xl" />

                      <div className="relative pl-4">
                        {/* 产品标题行 */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-bold text-amber-100 text-lg group-hover:text-amber-300 transition-colors">
                                {product.name}
                              </h4>
                              {product.status && (
                                <Badge className={`text-[10px] px-2 py-0.5 border-0 ${getStatusStyle(product.status)}`}>
                                  {product.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-amber-200/50 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {product.series}
                            </p>
                          </div>
                          {/* 序号 */}
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-300">
                            {index + 1}
                          </div>
                        </div>

                        {/* 价格与日期 */}
                        <div className="flex items-center justify-between pt-3 border-t border-amber-700/30">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-amber-300">
                              {product.price}
                            </span>
                            {product.priceCNY && (
                              <span className="text-sm text-amber-400/70">
                                ≈ ¥{product.priceCNY}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-amber-300/60">
                            <Calendar className="w-3.5 h-3.5" />
                            {product.announceDate}
                          </div>
                        </div>
                      </div>

                      {/* 箭头指示 */}
                      <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                <Separator className="my-5 bg-amber-700/30" />

                {/* 汇率信息 */}
                <div className="flex items-center justify-between text-sm px-2">
                  <span className="flex items-center gap-2 text-amber-300/50">
                    <Tag className="w-4 h-4" />
                    汇率参考
                  </span>
                  <span className="font-mono text-xs text-amber-400/70 bg-amber-900/30 px-3 py-1 rounded-full">
                    HKD × 0.92 ≈ CNY
                  </span>
                </div>
              </CardContent>
            </div>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-400 flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            专业模型资讯，为收藏爱好者精心策划
          </p>
        </div>
      </div>
    </section>
  );
}
