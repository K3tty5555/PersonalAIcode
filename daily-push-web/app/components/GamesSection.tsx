'use client';

import { useState } from 'react';
import { Gamepad2, Calendar } from 'lucide-react';
import type { SteamDeal, PSDeal } from '@/lib/data';

interface GamesSectionProps {
  steam: SteamDeal[];
  playstation: PSDeal[];
  nintendo: {
    hasDeals: boolean;
    deals: any[];
    note?: string;
  };
}

type Tab = 'steam' | 'playstation' | 'nintendo';

export default function GamesSection({ steam, playstation, nintendo }: GamesSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('steam');

  const tabs = [
    { id: 'steam' as Tab, label: 'Steam', color: 'bg-[#1b2838]' },
    { id: 'playstation' as Tab, label: 'PlayStation', color: 'bg-[#003087]' },
    { id: 'nintendo' as Tab, label: 'Nintendo', color: 'bg-[#e60012]' },
  ];

  const getDiscountStyle = (discount: string) => {
    const percent = parseInt(discount.replace(/[^\d]/g, ''));
    if (percent >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (percent >= 50) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-orange-500 to-amber-500';
  };

  return (
    <section id="games" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-sm font-medium text-green-600 mb-2 block">游戏折扣</span>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">限时优惠精选</h2>
            <p className="text-gray-500 mt-2">Steam、PlayStation 平台折扣信息</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-gray-100 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Steam Content */}
        {activeTab === 'steam' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {steam.slice(0, 4).map((game) => (
              <div
                key={game.id}
                className="group bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => game.url && window.open(game.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors mb-3">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${getDiscountStyle(game.discount)}`}>
                        {game.discount}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 line-through text-sm">{game.originalPrice}</span>
                        <span className="text-lg font-semibold text-green-600">{game.discountPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PlayStation Content */}
        {activeTab === 'playstation' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {playstation.map((game) => (
              <div
                key={game.id}
                className="group bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => game.url && window.open(game.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500">
                        {game.discount}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">{game.priceHKD}</span>
                        {game.priceCNY && (
                          <span className="text-sm text-gray-400">≈ ¥{game.priceCNY}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  有效期至 {game.validUntil}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nintendo Content */}
        {activeTab === 'nintendo' && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#e60012]/10 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#e60012]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nintendo eShop</h3>
            <p className="text-gray-500 mb-4">{nintendo.note || '暂无特别优惠活动'}</p>
            <a
              href="https://store.nintendo.com.hk/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#e60012] text-white rounded-full text-sm font-medium hover:bg-[#cc0010] transition-colors"
            >
              访问港服商店
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
