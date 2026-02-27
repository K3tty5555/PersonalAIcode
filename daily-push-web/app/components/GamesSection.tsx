'use client';

import { Gamepad2, Monitor, Disc, Tablet, ExternalLink, Tag, Calendar, Sparkles, Trophy, Clock, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SteamDeal, PSDeal, SwitchDeal } from '@/lib/data';

interface GamesSectionProps {
  steam: SteamDeal[];
  playstation: PSDeal[];
  nintendo: {
    hasDeals: boolean;
    deals: SwitchDeal[];
    note?: string;
  };
}

// Steam 品牌系统
const STEAM_THEME = {
  bg: 'from-[#0f1922] via-[#1b2838] to-[#0f1922]',
  card: 'bg-[#16202d]/95',
  accent: '#66c0f4',
  accentHover: '#4a9fcf',
  text: '#c6d4df',
  textMuted: '#8f98a0',
  discount: '#4c6b22',
  discountText: '#beee11',
  button: 'bg-[#1b2838] hover:bg-[#2a475e]',
};

// PlayStation 品牌系统
const PS_THEME = {
  bg: 'from-[#000810] via-[#003087] to-[#000810]',
  card: 'bg-[#001a4d]/95',
  accent: '#00a8ff',
  accentGlow: '#0045aa',
  text: '#ffffff',
  textMuted: '#b3c6ff',
  discount: '#ff6b00',
  discountGlow: '#ff9500',
};

// Nintendo 品牌系统
const NINTENDO_THEME = {
  bg: 'from-[#8b0000] via-[#e60012] to-[#8b0000]',
  card: 'bg-white',
  accent: '#e60012',
  accentLight: '#ff4d5e',
  text: '#333333',
  textMuted: '#666666',
  textLight: '#ffffff',
};

// Steam Logo SVG
const SteamLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z"/>
    <circle cx="12" cy="12" r="3" fill="#171a21"/>
    <circle cx="12" cy="12" r="1.5" fill="#66c0f4"/>
  </svg>
);

// PlayStation Logo SVG
const PlayStationLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M9.5 4v13.5c0 .31-.26.56-.58.5l-3.87-.64c-.83-.14-1.55.57-1.55 1.4v.99c0 .73.53 1.36 1.26 1.46l5.89.83c.73.1 1.35-.47 1.35-1.2V7.5c0-.83.68-1.5 1.5-1.5s1.5.67 1.5 1.5v9.5c0 .83.67 1.5 1.5 1.5h.5c.83 0 1.5-.67 1.5-1.5V4c0-1.66-1.34-3-3-3h-2c-1.66 0-3 1.34-3 3z"/>
  </svg>
);

// Nintendo Logo SVG
const NintendoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="#e60012"/>
    <path d="M7 8v8h3v-5l2 5h3V8h-3v5l-2-5H7z" fill="white"/>
  </svg>
);

export default function GamesSection({ steam, playstation, nintendo }: GamesSectionProps) {
  const getSteamDiscountStyle = (type: SteamDeal['type']) => {
    switch (type) {
      case 'new-low':
        return { bg: 'bg-gradient-to-r from-green-600 to-green-500', label: '新史低', icon: Trophy };
      case 'historical-low':
        return { bg: 'bg-gradient-to-r from-red-600 to-orange-500', label: '史低', icon: Percent };
      case 'daily-deal':
        return { bg: 'bg-gradient-to-r from-blue-600 to-cyan-500', label: '每日特惠', icon: Clock };
      default:
        return { bg: 'bg-gradient-to-r from-slate-600 to-slate-500', label: '折扣', icon: Tag };
    }
  };

  return (
    <section id="games" className="py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">游戏折扣</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">三大平台精选优惠，一站掌握</p>
          </div>
        </div>

        <Tabs defaultValue="steam" className="w-full">
          {/* Platform Tabs - Brand Style */}
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex mb-8 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl gap-1">
            <TabsTrigger
              value="steam"
              className="gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1b2838] data-[state=active]:to-[#2a475e] data-[state=active]:text-white rounded-xl transition-all duration-300 py-3 px-6"
            >
              <Monitor className="w-5 h-5" />
              <span className="font-semibold">Steam</span>
            </TabsTrigger>
            <TabsTrigger
              value="playstation"
              className="gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#003087] data-[state=active]:to-[#0045aa] data-[state=active]:text-white rounded-xl transition-all duration-300 py-3 px-6"
            >
              <Disc className="w-5 h-5" />
              <span className="font-semibold">PlayStation</span>
            </TabsTrigger>
            <TabsTrigger
              value="nintendo"
              className="gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e60012] data-[state=active]:to-[#ff1a2e] data-[state=active]:text-white rounded-xl transition-all duration-300 py-3 px-6"
            >
              <Tablet className="w-5 h-5" />
              <span className="font-semibold">Nintendo</span>
            </TabsTrigger>
          </TabsList>

          {/* Steam Content */}
          <TabsContent value="steam" className="animate-in fade-in-50 duration-300">
            <div className={`rounded-3xl bg-gradient-to-br ${STEAM_THEME.bg} p-1.5 shadow-2xl`}>
              <div className={`${STEAM_THEME.card} backdrop-blur-sm rounded-[20px] overflow-hidden`}>
                {/* Steam Header with Logo */}
                <div className="px-8 py-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1b2838] to-[#2a475e] flex items-center justify-center border border-[#66c0f4]/30 shadow-lg">
                        <SteamLogo />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-white">Steam</span>
                          <Badge className="bg-[#66c0f4]/20 text-[#66c0f4] border-0 text-xs">
                            STORE
                          </Badge>
                        </div>
                        <p className="text-xs text-[#8f98a0] mt-0.5">PC游戏首选平台 · 每日特惠</p>
                      </div>
                    </div>
                    <Badge className="bg-[#4c6b22] text-[#beee11] border-0 text-sm px-3 py-1">
                      {steam.length} 款精选
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {steam.map((game, index) => {
                      const discountStyle = getSteamDiscountStyle(game.type);
                      const Icon = discountStyle.icon;
                      return (
                        <div
                          key={game.id}
                          className="group relative p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
                          style={{ backgroundColor: 'rgba(27, 40, 56, 0.6)' }}
                        >
                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#66c0f4]/0 via-[#66c0f4]/10 to-[#66c0f4]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Game Cover Placeholder */}
                          <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 aspect-[16/9] flex items-center justify-center">
                            <Monitor className="w-12 h-12 text-slate-600" />
                            <div className={`absolute top-3 left-3 ${discountStyle.bg} px-2 py-1 rounded-md flex items-center gap-1`}>
                              <Icon className="w-3 h-3 text-white" />
                              <span className="text-xs font-bold text-white">{discountStyle.label}</span>
                            </div>
                          </div>

                          <div className="relative">
                            <h4 className="font-bold text-[#c6d4df] text-lg mb-3 group-hover:text-[#66c0f4] transition-colors line-clamp-1">
                              {game.name}
                            </h4>

                            {/* Price Section */}
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1.5 rounded bg-[#4c6b22] text-[#beee11] font-bold text-lg">
                                {game.discount}
                              </div>
                              <div className="flex flex-col items-end ml-auto">
                                <span className="text-sm text-[#8f98a0] line-through">
                                  {game.originalPrice}
                                </span>
                                <span className="text-xl font-bold text-[#beee11]">
                                  {game.discountPrice}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Glow */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#66c0f4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-[#8f98a0]">
                      价格数据仅供参考，请以 Steam 商店实际价格为准
                    </p>
                  </div>
                </CardContent>
              </div>
            </div>
          </TabsContent>

          {/* PlayStation Content */}
          <TabsContent value="playstation" className="animate-in fade-in-50 duration-300">
            <div className={`rounded-3xl bg-gradient-to-br ${PS_THEME.bg} p-1.5 shadow-2xl`}>
              <div className={`${PS_THEME.card} backdrop-blur-sm rounded-[20px] overflow-hidden`}>
                {/* PlayStation Header */}
                <div className="px-8 py-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#003087] to-[#0045aa] flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <PlayStationLogo />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-white">PlayStation™</span>
                          <Badge className="bg-blue-500/20 text-blue-300 border-0 text-xs">
                            STORE
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-300/70 mt-0.5">主机游戏 · 春季特惠活动</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <Badge className="bg-white/10 text-white border-0">
                        {playstation.length} 款精选
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="space-y-4">
                    {playstation.map((game, index) => (
                      <div
                        key={game.id}
                        className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-white/10 cursor-pointer"
                        style={{ backgroundColor: 'rgba(0, 50, 130, 0.4)' }}
                      >
                        {/* Rank Number */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                          {index + 1}
                        </div>

                        {/* Game Cover */}
                        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center flex-shrink-0">
                          <Disc className="w-10 h-10 text-blue-400/50" />
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-lg truncate group-hover:text-[#00a8ff] transition-colors mb-2">
                            {game.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-blue-300/60">
                            <Calendar className="w-4 h-4" />
                            <span>截止: {game.validUntil}</span>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white">{game.priceHKD}</div>
                            {game.priceCNY && (
                              <div className="text-sm text-blue-300/60">
                                约 ¥{game.priceCNY}
                              </div>
                            )}
                          </div>
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform shadow-lg">
                            <span className="text-white font-bold text-xl">{game.discount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-300/60 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {playstation[0]?.eventName || '春季特惠'}
                      </span>
                      <span className="text-blue-300/40 text-xs">
                        汇率参考: 港币 × 0.92 ≈ 人民币
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </TabsContent>

          {/* Nintendo Content */}
          <TabsContent value="nintendo" className="animate-in fade-in-50 duration-300">
            <div className={`rounded-3xl bg-gradient-to-br ${NINTENDO_THEME.bg} p-1.5 shadow-2xl`}>
              <div className="bg-white rounded-[20px] overflow-hidden">
                {/* Nintendo Header */}
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#e60012] to-[#ff1a2e]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg">
                        <NintendoLogo />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-white">Nintendo eShop</span>
                          <Badge className="bg-white/20 text-white border-0 text-xs">
                            SWITCH
                          </Badge>
                        </div>
                        <p className="text-xs text-white/70 mt-0.5">任天堂游戏商店</p>
                      </div>
                    </div>
                    <Badge className="bg-white text-[#e60012] border-0 font-bold">
                      {nintendo.hasDeals ? `${nintendo.deals.length} 款优惠` : '今日无新优惠'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8">
                  {nintendo.hasDeals ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {nintendo.deals.map((game) => (
                        <div
                          key={game.id}
                          className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:shadow-red-100 cursor-pointer bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                              <Tablet className="w-10 h-10 text-[#e60012]" />
                            </div>
                            <Badge
                              className="text-xs border-0"
                              style={{
                                backgroundColor: game.region === 'JP' ? '#e60012' : '#ff6b00',
                                color: 'white',
                              }}
                            >
                              {game.region === 'JP' ? '日服' : game.region === 'HK' ? '港服' : '美服'}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#e60012] transition-colors">
                            {game.name}
                          </h4>
                          {game.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-[#e60012]">
                                {game.price}
                              </span>
                              {game.discount && (
                                <Badge variant="outline" className="text-sm border-red-200 text-red-500">
                                  {game.discount}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="relative inline-block mb-6">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mx-auto">
                          <Tablet className="w-14 h-14 text-[#e60012]" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 animate-bounce flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-yellow-900" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        本周暂无特别优惠
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {nintendo.note || '建议关注下周的例行折扣更新'}
                      </p>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-[#e60012] font-medium">
                        <Sparkles className="w-5 h-5" />
                        敬请期待下次促销
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-400 text-center">
                    价格和优惠以 Nintendo eShop 实际显示为准
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
