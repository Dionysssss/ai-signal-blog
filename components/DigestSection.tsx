import Link from 'next/link'
import { formatRelativeTime, SOURCE_LABELS } from '@/lib/utils'
import type { FeedSource } from '@/lib/types'

interface DigestArticle {
  id: number
  title: string
  url: string
  published_at: string
  feed_title: string
  feed_url: string
}

function sourceFromUrl(feedUrl: string): FeedSource {
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

export default function DigestSection({
  title,
  articles,
  emptyMsg = 'No articles today.',
}: {
  title: string
  articles: DigestArticle[]
  emptyMsg?: string
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="kicker">{title}</span>
        <div className="flex-1 border-t border-[var(--color-rule)] border-opacity-20" />
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-muted)] italic">{emptyMsg}</p>
      ) : (
        <ul className="space-y-4">
          {articles.map(a => {
            const source = sourceFromUrl(a.feed_url)
            return (
              <li key={a.id} className="border-b border-[var(--color-rule)] border-opacity-10 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-widest">
                    {SOURCE_LABELS[source] ?? a.feed_title}
                  </span>
                  <span className="text-[10px] text-[var(--color-ink-muted)]">
                    {formatRelativeTime(a.published_at)}
                  </span>
                </div>
                <Link
                  href={`/post/${a.id}`}
                  className="font-serif text-lg leading-snug hover:text-[var(--color-accent)] transition-colors"
                >
                  {a.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
