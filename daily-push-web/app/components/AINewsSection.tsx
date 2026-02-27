'use client';

import { Sparkles, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { AINewsItem } from '@/lib/data';

interface AINewsSectionProps {
  keywords: string[];
  items: AINewsItem[];
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
          {items.map((item, index) => (
            <Card
              key={item.id}
              className="card-hover border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
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
                    <h3 className="text-lg font-semibold mb-2 leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 leading-relaxed">
                      {item.highlight}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      {item.keywords.map((kw) => (
                        <Badge
                          key={kw}
                          variant="outline"
                          className="text-xs border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400"
                        >
                          {kw}
                        </Badge>
                      ))}
                      {item.source && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto">
                          来源: {item.source}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* External Link */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
