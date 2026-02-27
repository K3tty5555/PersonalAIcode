'use client';

import { Gamepad2, Monitor, Disc, Tablet } from 'lucide-react';
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

export default function GamesSection({ steam, playstation, nintendo }: GamesSectionProps) {
  const getDiscountColor = (type: SteamDeal['type']) => {
    switch (type) {
      case 'new-low':
        return 'bg-orange-500';
      case 'historical-low':
        return 'bg-red-500';
      case 'daily-deal':
        return 'bg-blue-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getTypeLabel = (type: SteamDeal['type']) => {
    switch (type) {
      case 'new-low':
        return '新史低';
      case 'historical-low':
        return '史低';
      case 'daily-deal':
        return '特惠';
      default:
        return '折扣';
    }
  };

  return (
    <section id="games" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">游戏折扣</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Steam / PlayStation / Nintendo 精选优惠</p>
          </div>
        </div>

        <Tabs defaultValue="steam" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex mb-8">
            <TabsTrigger value="steam" className="gap-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Steam</span>
            </TabsTrigger>
            <TabsTrigger value="playstation" className="gap-2">
              <Disc className="w-4 h-4" />
              <span className="hidden sm:inline">PlayStation</span>
            </TabsTrigger>
            <TabsTrigger value="nintendo" className="gap-2">
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Nintendo</span>
            </TabsTrigger>
          </TabsList>

          {/* Steam Content */}
          <TabsContent value="steam">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    Steam 今日折扣
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{steam.length} 款精选</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {steam.map((game) => (
                    <div
                      key={game.id}
                      className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all card-hover"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold line-clamp-1 flex-1 mr-2">{game.name}</h4>
                        <Badge className={`${getDiscountColor(game.type)} text-white text-xs shrink-0`}>
                          {getTypeLabel(game.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 dark:text-zinc-500 line-through text-sm">{game.originalPrice}</span>
                        <span className="text-green-600 dark:text-green-400 font-bold">{game.discountPrice}</span>
                        <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 ml-auto">
                          {game.discount}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PlayStation Content */}
          <TabsContent value="playstation">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Disc className="w-5 h-5 text-blue-600" />
                    PlayStation Store 春季特惠
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{playstation.length} 款精选</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playstation.map((game) => (
                    <div
                      key={game.id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{game.name}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          活动截止: {game.validUntil}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-blue-600 dark:text-blue-400">{game.priceHKD}</div>
                          {game.priceCNY && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              约 ¥{game.priceCNY}
                            </div>
                          )}
                        </div>
                        <Badge className="bg-blue-500 text-white">{game.discount}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
                  <p>💡 汇率参考: 港币 × 0.92 ≈ 人民币 (实际以付款时为准)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nintendo Content */}
          <TabsContent value="nintendo">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tablet className="w-5 h-5 text-red-500" />
                    Nintendo eShop
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {nintendo.hasDeals ? `${nintendo.deals.length} 款优惠` : '今日无新优惠'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {nintendo.hasDeals ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {nintendo.deals.map((game) => (
                      <div
                        key={game.id}
                        className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
                      >
                        <h4 className="font-semibold mb-2">{game.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {game.region === 'JP' && '日服'}
                            {game.region === 'HK' && '港服'}
                          </Badge>
                          {game.price && <span className="text-green-600 dark:text-green-400 font-medium">{game.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      <Tablet className="w-8 h-8 text-zinc-400" />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">{nintendo.note || '本周暂无特别优惠活动'}</p>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">建议关注下周的例行折扣更新</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
