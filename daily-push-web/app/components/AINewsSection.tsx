'use client';

import { ArrowUpRight } from 'lucide-react';
import type { AINewsItem } from '@/lib/data';

interface AINewsSectionProps {
  keywords: string[];
  items: AINewsItem[];
}

export default function AINewsSection({ keywords, items }: AINewsSectionProps) {
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <section id="ai" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-blue-600 mb-2 block">人工智能</span>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">AI 每日热榜</h2>
            <p className="text-gray-500 mt-2">来自 36氪、知乎、IT之家</p>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {keywords.slice(0, 5).map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="group relative bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${getRankStyle(item.rank || index + 1)}`}>
                  {item.rank || index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                        {item.highlight}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {item.source || '36氪'}
                    </span>
                    {item.keywords?.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-xs text-gray-400">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
