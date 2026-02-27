'use client';

import { Package, Crown, Calendar, ArrowUpRight, Clock, ExternalLink } from 'lucide-react';
import type { BandaiProduct, HotToysProduct } from '@/lib/data';

interface ToysSectionProps {
  bandai: BandaiProduct[];
  hotToys: HotToysProduct[];
}

export default function ToysSection({ bandai, hotToys }: ToysSectionProps) {
  return (
    <section id="toys" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-sm font-medium text-purple-600 mb-2 block">收藏模型</span>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">新品发售情报</h2>
            <p className="text-gray-500 mt-2">万代 BANDAI & Hot Toys 当月精选</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Crown className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bandai Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">万代 BANDAI</h3>
                  <p className="text-xs text-gray-500">bandaihobbysite.cn</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">当月发售</span>
            </div>

            <div className="space-y-4">
              {bandai.map((product) => (
                <a
                  key={product.id}
                  href={product.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                        {product.type && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            product.type === '新品'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {product.type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{product.series}</p>

                      {/* 双日期显示 */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Clock className="w-3 h-3" />
                          <span>发售 {product.releaseDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>发布 {product.announceDate}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">{product.price}</span>
                        {(product.priceCNY ?? 0) > 0 && (
                          <span className="text-sm text-gray-400">≈ ¥{product.priceCNY}</span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">汇率参考: JPY × 0.048 ≈ CNY</p>
            </div>
          </div>

          {/* Hot Toys Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hot Toys</h3>
                  <p className="text-xs text-gray-500">小红书@HotToys</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">官方账号</span>
            </div>

            <div className="space-y-4">
              {hotToys.map((product) => (
                <a
                  key={product.id}
                  href={product.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-2xl bg-gray-50 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h4>
                        {product.status && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            product.status === '新品预告'
                              ? 'bg-blue-100 text-blue-700'
                              : product.status === '预定中'
                              ? 'bg-green-100 text-green-700'
                              : product.status === '即将截单'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {product.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{product.series}</p>

                      {/* 双日期显示 */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Clock className="w-3 h-3" />
                          <span>出货 {product.releaseDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>发布 {product.announceDate}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">{product.price}</span>
                        {(product.priceCNY ?? 0) > 0 && (
                          <span className="text-sm text-gray-400">≈ ¥{product.priceCNY}</span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">汇率参考: HKD × 0.92 ≈ CNY</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
