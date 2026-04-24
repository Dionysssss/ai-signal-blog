'use client'

import { useState, useEffect } from 'react'
import type { Article, FeedSource } from '@/lib/types'
import ArticleCard from './ArticleCard'

const FILTERS: { label: string; key: FeedSource | 'all' }[] = [
  { label: 'All',         key: 'all' },
  { label: 'HuggingFace', key: 'huggingface' },
  { label: 'OpenAI',      key: 'openai' },
  { label: 'Google',      key: 'google' },
  { label: 'arXiv',       key: 'arxiv' },
  { label: 'Other',       key: 'other' },
]

type FeedSourceMap = Record<string, number[]>

async function fetchBySource(source: FeedSource | 'all', feedSourceMap: FeedSourceMap): Promise<Article[]> {
  if (source === 'all') return []

  const feedIds = source === 'other'
    ? Object.entries(feedSourceMap).filter(([k]) => k === 'other').flatMap(([, v]) => v)
    : (feedSourceMap[source] ?? [])

  if (feedIds.length === 0) return []

  const results = await Promise.all(
    feedIds.map(id =>
      fetch(`/api/feeds?feedId=${id}&limit=20`)
        .then(r => r.json())
        .catch(() => [])
    )
  )
  const all: Article[] = results.flat()
  all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return all
}

export default function ArticleList({
  articles: initialArticles,
  feedSourceMap,
}: {
  articles: Article[]
  feedSourceMap: FeedSourceMap
}) {
  const [active, setActive] = useState<FeedSource | 'all'>('all')
  const [articles, setArticles] = useState(initialArticles)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (active === 'all') {
      setArticles(initialArticles)
      return
    }
    setLoading(true)
    fetchBySource(active, feedSourceMap).then(data => {
      setArticles(data)
      setLoading(false)
    })
  }, [active, feedSourceMap, initialArticles])

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => {
          const isActive = active === f.key
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                isActive
                  ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                  : 'border-[#EBEBEB] text-gray-500 hover:border-[#1D9E75] hover:text-[#1D9E75]'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : articles.length === 0 ? (
        <p className="text-gray-400 py-8 text-center">No articles yet — check back soon.</p>
      ) : (
        articles.map((a, i) => (
          <ArticleCard key={a.id} article={a} featured={i === 0 && active === 'all'} />
        ))
      )}
    </div>
  )
}
