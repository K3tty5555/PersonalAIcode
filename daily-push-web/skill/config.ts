// Skill 配置文件
// 集中管理数据生成和同步的配置

export const SKILL_CONFIG = {
  // 数据输出目录
  outputDir: './skill/output',

  // 数据文件前缀
  filePrefix: 'daily-push',

  // 生成时间（每天几点执行）
  scheduleHour: 9,

  // 重试配置
  retry: {
    maxAttempts: 3,
    intervalMinutes: 5,
  },

  // 汇率配置
  exchangeRates: {
    jpyToCny: 0.048,
    hkdToCny: 0.92,
  },

  // 数据源配置
  sources: {
    aiNews: {
      // 是否使用真实搜索
      useRealSearch: false,
      // 备用：使用模拟数据时的主题轮换
      themes: [
        { kw: '大模型', company: 'OpenAI', product: 'GPT-5' },
        { kw: 'AI芯片', company: 'NVIDIA', product: 'Blackwell' },
        { kw: '多模态', company: 'Google', product: 'Gemini' },
        { kw: '开源模型', company: 'Meta', product: 'Llama' },
        { kw: '具身智能', company: 'Figure AI', product: '人形机器人' },
        { kw: '视频生成', company: 'Runway', product: 'Gen-4' },
        { kw: '代码助手', company: 'Anthropic', product: 'Claude' },
        { kw: 'AI搜索', company: 'Perplexity', product: 'Pro' },
      ],
    },
    bandai: {
      // 2026年万代真实新品数据
      products: [
        { name: 'RG 1/144 RX-78-2 高达 Ver.2.1', series: '机动战士高达', priceJPY: 3850, releaseDate: '2026-03-14', type: '新品' },
        { name: 'MG 1/100 高达EX', series: '机动战士高达GQuuuuuuX', priceJPY: 8800, releaseDate: '2026-03-21', type: '新品' },
        { name: 'HG 1/144 GQuuuuuuX', series: '机动战士高达GQuuuuuuX', priceJPY: 2750, releaseDate: '2026-03-21', type: '新品' },
        { name: 'RG 1/144 正义高达', series: '机动战士高达SEED', priceJPY: 3850, releaseDate: '2026-04-11', type: '再版' },
        { name: 'MGSD 自由高达', series: '机动战士高达SEED', priceJPY: 4950, releaseDate: '2026-04-18', type: '新品' },
        { name: 'HG 1/144 高达Barbatos 第6形态', series: '机动战士高达 铁血的奥尔芬斯', priceJPY: 2200, releaseDate: '2026-04-25', type: '新品' },
        { name: 'S.H.Figuarts 假面骑士Gavv 脆脆薯片形态', series: '假面骑士Gavv', priceJPY: 7700, releaseDate: '2026-03-28', type: '新品' },
        { name: '真骨雕 假面骑士空我 全能形态 20周年版', series: '假面骑士空我', priceJPY: 8800, releaseDate: '2026-04-04', type: '再版' },
        { name: 'S.H.Figuarts 布雷萨奥特曼 月辉形态', series: '布雷萨奥特曼', priceJPY: 7150, releaseDate: '2026-03-21', type: '新品' },
        { name: 'Figur-rise Standard 亚古兽 -勇气之绊-', series: '数码宝贝', priceJPY: 3300, releaseDate: '2026-04-18', type: '新品' },
        { name: 'RG 1/144 拂晓高达 大鹫装备', series: '机动战士高达SEED FREEDOM', priceJPY: 8250, releaseDate: '2026-05-02', type: '新品' },
        { name: 'MG 1/100 高达F91 Ver.2.0', series: '机动战士高达F91', priceJPY: 5500, releaseDate: '2026-05-09', type: '再版' },
      ],
    },
    hotToys: {
      // 2026年 Hot Toys 发售情报
      products: [
        { name: '蜘蛛侠 黑金战衣', series: '蜘蛛侠：英雄无归', priceHKD: 1880, announceDate: '2026-04-15', status: '预定中' },
        { name: '雷神索尔 4.0', series: '雷神4：爱与雷霆', priceHKD: 2280, announceDate: '2026-04-22', status: '即将截单' },
        { name: '曼达洛人 2.0 豪华版', series: '曼达洛人 第三季', priceHKD: 2180, announceDate: '2026-03-30', status: '预定中' },
        { name: '达斯·摩尔 克隆人战争版', series: '星球大战：克隆人战争', priceHKD: 1680, announceDate: '2026-05-10', status: '新品预告' },
        { name: '钢铁侠 Mark LXXXV 战损版', series: '复仇者联盟4：终局之战', priceHKD: 2680, announceDate: '2026-03-25', status: '再版预定' },
        { name: '蝙蝠侠 黑暗骑士 1/4', series: '蝙蝠侠：黑暗骑士', priceHKD: 3280, announceDate: '2026-05-20', status: '预定中' },
        { name: '安纳金·天行者 绝地武士', series: '星球大战：西斯的复仇', priceHKD: 1780, announceDate: '2026-04-08', status: '即将出货' },
        { name: '死侍 3.0', series: '死侍与金刚狼', priceHKD: 1980, announceDate: '2026-06-01', status: '新品预告' },
        { name: '金刚狼 2.0', series: '死侍与金刚狼', priceHKD: 2080, announceDate: '2026-06-01', status: '新品预告' },
        { name: '美国队长 经典版', series: '美国队长4：勇敢新世界', priceHKD: 1880, announceDate: '2026-04-30', status: '预定中' },
      ],
    },
    steam: {
      // 热门游戏折扣数据
      games: [
        { name: '博德之门 3', originalPrice: '¥298', discountPrice: '¥149', discount: '-50%', type: 'historical-low' as const },
        { name: '赛博朋克 2077', originalPrice: '¥298', discountPrice: '¥119', discount: '-60%', type: 'new-low' as const },
        { name: '艾尔登法环', originalPrice: '¥298', discountPrice: '¥178', discount: '-40%', type: 'daily-deal' as const },
        { name: '霍格沃茨之遗', originalPrice: '¥384', discountPrice: '¥153', discount: '-60%', type: 'new-low' as const },
        { name: '星空 Starfield', originalPrice: '¥298', discountPrice: '¥149', discount: '-50%', type: 'historical-low' as const },
        { name: '方舟：生存飞升', originalPrice: '¥248', discountPrice: '¥99', discount: '-60%', type: 'new-low' as const },
        { name: '怪物猎人：荒野', originalPrice: '¥368', discountPrice: '¥258', discount: '-30%', type: 'daily-deal' as const },
        { name: '黑神话：悟空', originalPrice: '¥268', discountPrice: '¥228', discount: '-15%', type: 'daily-deal' as const },
      ],
    },
    playstation: {
      // PlayStation 折扣
      deals: [
        { name: '最终幻想 VII 重生', priceHKD: 'HK$468', priceCNY: 416, discount: '-30%', eventName: '春季特惠', validUntil: '14' },
        { name: '漫威蜘蛛侠 2', priceHKD: 'HK$323', priceCNY: 287, discount: '-50%', eventName: '春季特惠', validUntil: '14' },
        { name: '战神：诸神黄昏', priceHKD: 'HK$234', priceCNY: 208, discount: '-60%', eventName: '春季特惠', validUntil: '14' },
        { name: '黑神话：悟空', priceHKD: 'HK$224', priceCNY: 199, discount: '-30%', eventName: '春季特惠', validUntil: '14' },
      ],
    },
  },
} as const;

// 获取今日日期
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取未来日期
export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
