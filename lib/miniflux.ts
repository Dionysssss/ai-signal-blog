import type { Article, FeedSource, FeedStats } from './types'
import type { Locale } from './i18n'

const MINIFLUX_URL = process.env.MINIFLUX_URL!
const MINIFLUX_KEY = process.env.MINIFLUX_API_KEY!

function sourceFromFeedUrl(feedUrl: string): FeedSource {
  if (feedUrl.includes('huggingface.co')) return 'huggingface'
  if (feedUrl.includes('openai.com')) return 'openai'
  if (feedUrl.includes('anthropic.com')) return 'anthropic'
  if (feedUrl.includes('deepseek.com')) return 'deepseek'
  if (feedUrl.includes('deepmind.google') || feedUrl.includes('blog.google')) return 'google'
  if (feedUrl.includes('mistral.ai')) return 'mistral'
  if (feedUrl.includes('meta.com') || feedUrl.includes('fb.com')) return 'meta'
  if (feedUrl.includes('arxiv.org')) return 'arxiv'
  return 'other'
}

function extractSummary(content: string, locale: Locale = 'en'): string {
  const marker = '֎ AI Summary:'
  const idx = content.indexOf(marker)
  if (idx !== -1) {
    const block = content.slice(idx + marker.length).replace(/<[^>]+>/g, '')
    // Try bilingual format: "EN: ... ZH: ..."
    const enMatch = block.match(/EN:\s*(.+?)(?=ZH:|$)/s)
    const zhMatch = block.match(/ZH:\s*(.+?)$/s)
    if (locale === 'zh' && zhMatch) return zhMatch[1].trim().slice(0, 300)
    if (enMatch) return enMatch[1].trim().slice(0, 300)
    // Legacy single-language summary
    return block.trim().slice(0, 300)
  }
  return content.replace(/<[^>]+>/g, '').trim().slice(0, 200)
}

function toArticle(entry: Record<string, unknown>, feedUrl: string): Article {
  const content = (entry.content as string) ?? ''
  return {
    id: entry.id as number,
    title: entry.title as string,
    url: entry.url as string,
    content,
    summary: extractSummary(content),
    publishedAt: entry.published_at as string,
    source: sourceFromFeedUrl(feedUrl),
    tags: [],
    isRead: entry.status === 'read',
    isStarred: (entry.starred as boolean) ?? false,
    feedTitle: (entry.feed as Record<string, unknown>)?.title as string ?? '',
  }
}

async function minifluxFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${MINIFLUX_URL}${path}`, {
    ...options,
    headers: {
      'X-Auth-Token': MINIFLUX_KEY,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Miniflux ${path}: ${res.status}`)
  return res.json()
}

export async function getEntries(options: {
  limit?: number
  offset?: number
  status?: 'read' | 'unread'
  starred?: boolean
  search?: string
  feedId?: number
} = {}): Promise<Article[]> {
  const params = new URLSearchParams()
  params.set('order', 'published_at')
  params.set('direction', 'desc')
  if (options.limit) params.set('limit', String(options.limit))
  if (options.offset) params.set('offset', String(options.offset))
  if (options.status) params.set('status', options.status)
  if (options.starred) params.set('starred', 'true')
  if (options.search) params.set('search', options.search)

  const path = options.feedId
    ? `/v1/feeds/${options.feedId}/entries?${params}`
    : `/v1/entries?${params}`

  const data = await minifluxFetch(path)
  return (data.entries ?? []).map((e: Record<string, unknown>) =>
    toArticle(e, (e.feed as Record<string, unknown>)?.feed_url as string ?? '')
  )
}

export async function getEntry(id: number): Promise<Article> {
  const entry = await minifluxFetch(`/v1/entries/${id}`)
  return toArticle(entry, entry.feed?.feed_url ?? '')
}

export async function getFeeds(): Promise<Record<string, unknown>[]> {
  return minifluxFetch('/v1/feeds')
}

export async function getFeedSourceMap(): Promise<Record<FeedSource, number[]>> {
  const feeds: Record<string, unknown>[] = await minifluxFetch('/v1/feeds')
  const map: Partial<Record<FeedSource, number[]>> = {}
  for (const f of feeds) {
    const source = sourceFromFeedUrl(f.feed_url as string)
    if (!map[source]) map[source] = []
    map[source]!.push(f.id as number)
  }
  return map as Record<FeedSource, number[]>
}

export async function getFeedStats(): Promise<FeedStats> {
  const [feeds, entries] = await Promise.all([
    minifluxFetch('/v1/feeds'),
    minifluxFetch('/v1/entries?limit=1'),
  ])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weeklyEntries = await minifluxFetch(
    `/v1/entries?after=${Math.floor(weekAgo.getTime() / 1000)}&limit=1`
  )

  return {
    totalArticles: entries.total ?? 0,
    totalSources: feeds.length ?? 0,
    weeklyReleases: weeklyEntries.total ?? 0,
    lastUpdated: new Date().toISOString(),
  }
}
