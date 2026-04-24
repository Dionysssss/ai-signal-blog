'use client'

import { useState } from 'react'
import type { Article, FeedSource } from '@/lib/types'
import ArticleCard from './ArticleCard'
import { SOURCE_LABELS } from '@/lib/utils'

const FILTERS: { label: string; source?: FeedSource }[] = [
  { label: 'All' },
  { label: 'HuggingFace', source: 'huggingface' },
  { label: 'OpenAI', source: 'openai' },
  { label: 'Google', source: 'google' },
  { label: 'arXiv', source: 'arxiv' },
  { label: 'Other' },
]

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<FeedSource | 'all' | 'other'>('all')

  const filtered = articles.filter(a => {
    if (active === 'all') return true
    if (active === 'other') return a.source === 'other' || !SOURCE_LABELS[a.source]
    return a.source === active
  })

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => {
          const key = f.source ?? (f.label === 'All' ? 'all' : 'other')
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => setActive(key as typeof active)}
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

      {filtered.length === 0 ? (
        <p className="text-gray-400 py-8 text-center">No articles yet — check back soon.</p>
      ) : (
        filtered.map((a, i) => (
          <ArticleCard key={a.id} article={a} featured={i === 0 && active === 'all'} />
        ))
      )}
    </div>
  )
}
