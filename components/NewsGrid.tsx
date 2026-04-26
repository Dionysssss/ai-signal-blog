'use client'

import { useState, useEffect } from 'react'
import type { Article, FeedSource } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { SOURCE_LABELS } from '@/lib/utils'
import LeadStory from './LeadStory'
import NewsCard from './NewsCard'
import type { FeedStats } from '@/lib/types'

const FILTERS: { key: FeedSource | 'all' }[] = [
  { key: 'all' },
  { key: 'huggingface' },
  { key: 'openai' },
  { key: 'google' },
  { key: 'arxiv' },
  { key: 'other' },
]

type FeedSourceMap = Record<string, number[]>
type SummaryMap = Record<number, { en_summary: string; zh_summary: string | null }>

async function fetchBySource(source: FeedSource | 'all', feedSourceMap: FeedSourceMap): Promise<Article[]> {
  const ids = source === 'all' ? [] : (feedSourceMap[source] ?? [])
  if (ids.length === 0) return []
  const results = await Promise.all(
    ids.map(id => fetch(`/api/feeds?feedId=${id}&limit=20`).then(r => r.json()).catch(() => []))
  )
  const all: Article[] = results.flat()
  all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return all
}

async function fetchSummaries(articleIds: number[]): Promise<SummaryMap> {
  if (articleIds.length === 0) return {}
  try {
    const res = await fetch(`/api/summaries?ids=${articleIds.join(',')}`)
    const rows: { article_id: number; en_summary: string; zh_summary: string | null }[] = await res.json()
    return Object.fromEntries(rows.map(r => [r.article_id, r]))
  } catch {
    return {}
  }
}

export default function NewsGrid({
  articles: initialArticles,
  feedSourceMap,
  stats,
  locale,
}: {
  articles: Article[]
  feedSourceMap: FeedSourceMap
  stats: FeedStats
  locale: Locale
}) {
  const [active, setActive] = useState<FeedSource | 'all'>('all')
  const [articles, setArticles] = useState(initialArticles)
  const [summaries, setSummaries] = useState<SummaryMap>({})
  const [loading, setLoading] = useState(false)

  // Fetch DB summaries whenever article list changes (for ZH locale)
  useEffect(() => {
    if (articles.length === 0) return
    const ids = articles.map(a => a.id)
    fetchSummaries(ids).then(setSummaries)
  }, [articles])

  useEffect(() => {
    if (active === 'all') { setArticles(initialArticles); return }
    setLoading(true)
    fetchBySource(active, feedSourceMap).then(data => {
      setArticles(data)
      setLoading(false)
    })
  }, [active, feedSourceMap, initialArticles])

  // Merge DB summaries into articles for current locale
  const enriched = articles.map(a => {
    const dbRow = summaries[a.id]
    if (!dbRow) return a
    return {
      ...a,
      summary: locale === 'zh' && dbRow.zh_summary
        ? dbRow.zh_summary
        : dbRow.en_summary || a.summary,
    }
  })

  const lead = enriched[0]
  const grid = enriched.slice(1, 9)

  return (
    <div>
      {/* Section filter tabs */}
      <div className="flex gap-0 flex-wrap border-b border-[var(--color-rule)] border-opacity-30 mb-0">
        {FILTERS.map(f => {
          const isActive = active === f.key
          const label = f.key === 'all'
            ? t('filter.all', locale)
            : (SOURCE_LABELS[f.key as FeedSource] ?? f.key)
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border-t-2 transition-colors ${
                isActive
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-paper-2)]'
                  : 'border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-16 text-center text-[var(--color-ink-muted)] font-mono text-sm">
          {t('filter.loading', locale)}
        </div>
      ) : enriched.length === 0 ? (
        <p className="py-16 text-center text-[var(--color-ink-muted)] font-mono text-sm">
          {t('filter.empty', locale)}
        </p>
      ) : (
        <>
          {lead && <LeadStory article={lead} locale={locale} />}
          {grid.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mt-2">
              {grid.map(a => <NewsCard key={a.id} article={a} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
