export type FeedSource =
  | 'huggingface'
  | 'openai'
  | 'anthropic'
  | 'deepseek'
  | 'google'
  | 'mistral'
  | 'meta'
  | 'arxiv'
  | 'other'

export interface Article {
  id: number
  title: string
  url: string
  content: string
  summary: string
  publishedAt: string
  source: FeedSource
  tags: string[]
  isRead: boolean
  isStarred: boolean
  feedTitle: string
}

export interface FeedStats {
  totalArticles: number
  totalSources: number
  weeklyReleases: number
  lastUpdated: string
}

export interface TimelineEvent {
  title: string
  source: FeedSource
  date: string
  articleId: number
}
