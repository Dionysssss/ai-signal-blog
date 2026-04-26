import Link from 'next/link'
import type { Article } from '@/lib/types'
import { formatRelativeTime, truncate, SOURCE_LABELS } from '@/lib/utils'

export default function NewsCard({ article }: { article: Article }) {
  return (
    <article className="py-4 border-b border-[var(--color-rule)] border-opacity-20">
      <div className="flex items-center gap-2 mb-1">
        <span className="kicker">{SOURCE_LABELS[article.source]}</span>
        <span className="text-[10px] text-[var(--color-ink-muted)] font-mono">
          {formatRelativeTime(article.publishedAt)}
        </span>
      </div>
      <Link href={`/post/${article.id}`}>
        <h3 className="font-serif text-base sm:text-lg leading-snug hover:text-[var(--color-accent)] transition-colors cursor-pointer mb-1">
          {article.title}
        </h3>
      </Link>
      {article.summary && (
        <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed line-clamp-2">
          {truncate(article.summary, 140)}
        </p>
      )}
    </article>
  )
}
