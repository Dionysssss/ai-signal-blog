export type Locale = 'en' | 'zh'

const dict = {
  en: {
    'nav.feed': 'Feed',
    'nav.archive': 'Archive',
    'stats.articles': 'articles',
    'stats.sources': 'sources',
    'stats.thisWeek': 'this week',
    'home.title': 'AI Model Releases',
    'home.subtitle': 'AI model releases · AI-summarized',
    'home.edition': 'No.',
    'home.sources': 'Sources',
    'home.about': 'About',
    'home.aboutText': 'AI Signal tracks model releases and research across major labs. Articles are collected via RSS and summarized by Gemini 2.5 Flash Lite.',
    'filter.all': 'All',
    'filter.loading': 'Loading…',
    'filter.empty': 'No articles yet — check back soon.',
    'article.readOriginal': 'Read original →',
    'article.aiSummary': 'AI Summary',
    'article.related': 'More from',
    'footer.powered': 'Powered by Miniflux · miniflux-ai · Gemini',
  },
  zh: {
    'nav.feed': '动态',
    'nav.archive': '归档',
    'stats.articles': '篇文章',
    'stats.sources': '个来源',
    'stats.thisWeek': '本周',
    'home.title': 'AI 模型发布',
    'home.subtitle': 'AI 模型发布动态 · AI 摘要',
    'home.edition': '第',
    'home.sources': '来源',
    'home.about': '关于',
    'home.aboutText': 'AI Signal 追踪各大实验室的模型发布与研究动态，通过 RSS 聚合，由 Gemini 2.5 Flash Lite 生成摘要。',
    'filter.all': '全部',
    'filter.loading': '加载中…',
    'filter.empty': '暂无文章，请稍后再来。',
    'article.readOriginal': '阅读原文 →',
    'article.aiSummary': 'AI 摘要',
    'article.related': '同来源更多',
    'footer.powered': '数据来源：Miniflux · miniflux-ai · Gemini',
  },
} as const

export type I18nKey = keyof typeof dict.en

export function t(key: I18nKey, locale: Locale = 'en'): string {
  return dict[locale][key] ?? dict.en[key] ?? key
}
