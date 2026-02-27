'use client';

import { Sparkles, TrendingUp, ExternalLink, ArrowRight, Zap, Cpu, Globe, Bot, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { AINewsItem } from '@/lib/data';

interface AINewsSectionProps {
  keywords: string[];
  items: AINewsItem[];
}

// 科技品牌色
const TECH_COLORS = {
  primary: '#8b5cf6', // Violet
  secondary: '#06b6d4', // Cyan
  accent: '#f59e0b', // Amber
  bg: 'from-slate-900 via-violet-950 to-slate-900',
  card: 'bg-slate-800/50',
  glow: 'shadow-violet-500/20',
};

// 根据排名返回不同样式
const getRankStyle = (rank: number) => {
  if (rank === 1) return {
    bg: 'from-amber-400 to-orange-500',
    text: 'text-white',
    glow: 'shadow-orange-500/50',
    icon: <Zap className="w-5 h-5" />,
    label: 'TOP',
  };
  if (rank === 2) return {
    bg: 'from-slate-300 to-slate-400',
    text: 'text-slate-900',
    glow: 'shadow-slate-400/50',
    icon: <Cpu className="w-5 h-5" />,
    label: 'HOT',
  };
  if (rank === 3) return {
    bg: 'from-amber-600 to-amber-700',
    text: 'text-white',
    glow: 'shadow-amber-600/50',
    icon: <BrainCircuit className="w-5 h-5" />,
    label: 'NEW',
  };
  return {
    bg: 'from-violet-500 to-purple-600',
    text: 'text-white',
    glow: 'shadow-violet-500/30',
    icon: <Bot className="w-4 h-4" />,
    label: null,
  };
};

// 生成搜索链接
function getSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
}

export default function AINewsSection({ keywords, items }: AINewsSectionProps) {
  return (
    <section id="ai" className="py-24 relative overflow-hidden">
      {/* 科技感背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - 科技风 */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25 animate-pulse">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              {/* 装饰光环 */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 opacity-20 blur-lg animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">AI 每日热榜</h2>
                <Badge className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white border-0 text-xs">
                  LIVE
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                人工智能领域最新动态与突破
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">每日 9:00 更新</span>
          </div>
        </div>

        {/* Keywords - 芯片风格 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <p className="text-sm text-slate-400">今日 AI 关键词</p>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {keywords.map((keyword, idx) => (
                <Badge
                  key={keyword}
                  className={`px-4 py-2 text-sm border-0 font-medium cursor-pointer transition-all duration-300 hover:scale-105 ${
                    idx === 0
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                      : idx === 1
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-violet-500/50'
                  }`}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        {/* News List - 赛博朋克风格 */}
        <div className="grid gap-4">
          {items.map((item, index) => {
            const linkUrl = item.url && item.url.trim() !== ''
              ? item.url
              : getSearchUrl(item.title);

            const rankStyle = getRankStyle(item.rank || index + 1);
            const isTop3 = (item.rank || index + 1) <= 3;

            return (
              <Card
                key={item.id}
                className="group relative overflow-hidden border-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  boxShadow: isTop3 ? `0 0 30px -10px ${item.rank === 1 ? 'rgba(251, 191, 36, 0.3)' : item.rank === 2 ? 'rgba(148, 163, 184, 0.3)' : 'rgba(180, 83, 9, 0.3)'}` : undefined,
                }}
                onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
              >
                {/* 顶部发光条 */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rankStyle.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />

                {/* 背景装饰 */}
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    {/* Rank Badge - 科技感 */}
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rankStyle.bg} ${rankStyle.glow} shadow-lg flex items-center justify-center relative overflow-hidden`}>
                        {/* 数字 */}
                        <span className={`text-2xl font-bold ${rankStyle.text}`}>
                          {item.rank || index + 1}
                        </span>
                        {/* 装饰图标 */}
                        <div className="absolute -bottom-1 -right-1 opacity-30">
                          {rankStyle.icon}
                        </div>
                      </div>
                      {rankStyle.label && (
                        <div className={`mt-2 text-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${rankStyle.bg} ${rankStyle.text}`}>
                          {rankStyle.label}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-semibold leading-tight text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 transition-all">
                          {item.title}
                        </h3>
                        <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>

                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {item.highlight}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.keywords.slice(0, 3).map((kw, kwIdx) => (
                            <Badge
                              key={kw}
                              variant="outline"
                              className={`text-xs backdrop-blur-sm ${
                                kwIdx === 0
                                  ? 'border-violet-500/50 text-violet-300 bg-violet-500/10'
                                  : kwIdx === 1
                                  ? 'border-cyan-500/50 text-cyan-300 bg-cyan-500/10'
                                  : 'border-slate-600 text-slate-400'
                              }`}
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          {item.source && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              {item.source}
                            </span>
                          )}
                          <ArrowRight className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer - 科技感 */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          <span>数据基于 AI 行业动态实时聚合</span>
        </div>
      </div>
    </section>
  );
}
