'use client';

import { Sparkles, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { AINewsItem } from '@/lib/data';

interface AINewsSectionProps {
  keywords: string[];
  items: AINewsItem[];
}

// 生成搜索链接（当没有具体URL时使用）
function getSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
}

export default function AINewsSection({ keywords, items }: AINewsSectionProps) {
  return (
    <section id="ai" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">今日热榜</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                科技/视频/开源每日 TOP 10
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">每日 00:00 更新</span>
          </div>
        </div>

        {/* Keywords */}
        <div className="mb-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">今日关键词</p>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        {/* News List */}
        <div className="grid gap-4">
          {items.map((item, index) => {
            // 确保每个条目都有可点击的链接
            const linkUrl = item.url && item.url.trim() !== ''
              ? item.url
              : getSearchUrl(item.title);

            return (
              <Card
                key={item.id}
                className="group card-hover border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Rank Number */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                        {item.rank || index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold mb-2 leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {item.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-violet-500 transition-colors flex-shrink-0 mt-1" />
                      </div>

                      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 leading-relaxed">
                        {item.highlight}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.keywords.slice(0, 3).map((kw) => (
                            <Badge
                              key={kw}
                              variant="outline"
                              className="text-xs border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.source && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              {item.source}
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            点击卡片即可查看详情
          </p>
        </div>
      </div>
    </section>
  );
}
