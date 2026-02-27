'use client';

import { ToyBrick, Flame, Package, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BandaiProduct, HotToysProduct } from '@/lib/data';

interface ToysSectionProps {
  bandai: BandaiProduct[];
  hotToys: HotToysProduct[];
}

export default function ToysSection({ bandai, hotToys }: ToysSectionProps) {
  return (
    <section id="toys" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <ToyBrick className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">模型手办</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">万代新品 & Hot Toys 情报</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bandai Section */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">万代发售商品</CardTitle>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">BANDAI 2026年发售情报</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{bandai.length} 款</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {bandai.map((product) => (
                  <div
                    key={product.id}
                    className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.name}
                          </h4>
                          {product.type && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                              {product.type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                          {product.series}
                        </p>
                        {/* 双货币展示 */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {product.price}
                            </span>
                            {product.priceCNY && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                (约 ¥{product.priceCNY})
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-300 dark:text-zinc-600">|</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            发售: {product.releaseDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  汇率参考
                </span>
                <span className="font-mono text-xs">日元 × 0.048 ≈ 人民币</span>
              </div>
            </CardContent>
          </Card>

          {/* Hot Toys Section */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Hot Toys 新品预告</CardTitle>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">高端收藏级人偶 2026</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{hotToys.length} 款</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {hotToys.map((product) => (
                  <div
                    key={product.id}
                    className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            {product.name}
                          </h4>
                          {product.status && (
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 ${
                                product.status === '即将出货'
                                  ? 'border-green-500 text-green-600 dark:text-green-400'
                                  : product.status === '即将截单'
                                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                  : 'border-red-500 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {product.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                          {product.series}
                        </p>
                        {/* 双货币展示 */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              {product.price}
                            </span>
                            {product.priceCNY && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                (约 ¥{product.priceCNY})
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-300 dark:text-zinc-600">|</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {product.announceDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  汇率参考
                </span>
                <span className="font-mono text-xs">港币 × 0.92 ≈ 人民币</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
